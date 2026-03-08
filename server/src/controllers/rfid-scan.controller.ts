import { BAD_REQUEST, NOT_FOUND } from "../constant/http";
import appAssert from "../errors/app-assert";
import RfidTagModel from "../models/rfid-tag.model";
import RaceResultModel from "../models/race-result.model";
import RegistrationModel from "../models/registration.model";
import CustomResponse from "../utils/response";
import { asyncHandler } from "../utils/utils";
import { io } from "../server";

/**
 * @route POST /api/v1/rfid/scan
 * Receives timing data from RFID reader hardware.
 * Body: { epc, readerId, timestamp }
 */
export const handleRfidScan = asyncHandler(async (req, res) => {
  const { epc, readerId, timestamp } = req.body;
  appAssert(epc, BAD_REQUEST, "EPC is required");
  appAssert(readerId, BAD_REQUEST, "Reader ID is required");

  const scanTime = timestamp ? new Date(timestamp) : new Date();

  // 1. Look up the RFID tag
  const tag = await RfidTagModel.findOne({ epc });
  appAssert(
    tag,
    NOT_FOUND,
    "RFID tag not found. Make sure it is registered in the system.",
  );
  appAssert(
    tag.status === "assigned" && tag.registration,
    BAD_REQUEST,
    "This RFID tag is not assigned to any participant",
  );

  // 2. Get the registration
  const registration = await RegistrationModel.findById(tag.registration);
  appAssert(registration, NOT_FOUND, "Registration not found for this tag");

  // 3. Find or create a RaceResult
  let raceResult = await RaceResultModel.findOne({
    registration: registration._id,
    event: registration.event,
  } as any);

  if (!raceResult) {
    raceResult = await RaceResultModel.create({
      registration: registration._id,
      event: registration.event,
      raceCategory: registration.raceCategory,
      rfidTag: tag._id,
      status: "not_started",
    } as any);
  }

  // 4. Process based on readerId
  if (readerId === "start-line") {
    raceResult.startTime = scanTime;
    raceResult.status = "running";
  } else if (readerId === "finish-line") {
    raceResult.finishTime = scanTime;
    raceResult.status = "finished";

    // Compute elapsed time
    if (raceResult.startTime) {
      raceResult.elapsedMs =
        scanTime.getTime() - raceResult.startTime.getTime();
    }
  } else {
    // Checkpoint read (e.g. "checkpoint-1", "checkpoint-water-station")
    raceResult.checkpoints.push({
      name: readerId,
      time: scanTime,
    });
  }

  await raceResult.save();

  // 5. Compute ranks for finished runners in the same event + category
  if (readerId === "finish-line") {
    const finishedResults = await RaceResultModel.find({
      event: registration.event,
      raceCategory: registration.raceCategory,
      status: "finished",
      elapsedMs: { $exists: true, $ne: null },
    } as any).sort({ elapsedMs: 1 });

    for (let i = 0; i < finishedResults.length; i++) {
      const result = finishedResults[i];
      if (result) {
        result.rank = i + 1;
        await result.save();
      }
    }

    // Re-read the current result to get updated rank
    raceResult = (await RaceResultModel.findById(raceResult._id))!;
  }

  // 6. Populate for response
  const populated = await RaceResultModel.findById(raceResult!._id)
    .populate({
      path: "registration",
      populate: [
        { path: "user", select: "name email" },
        { path: "event", select: "name" },
      ],
    })
    .populate("rfidTag", "epc label")
    .lean();

  // 7. Emit via Socket.IO for live updates
  const raceNamespace = io.of("/race");
  raceNamespace.emit("raceUpdate", {
    eventId: registration.event?.toString(),
    raceResult: populated,
  });

  res.json(
    new CustomResponse(true, populated, "RFID scan processed successfully"),
  );
});
