import { BAD_REQUEST, CREATED } from "../constant/http";
import appAssert from "../errors/app-assert";
import RfidTagModel from "../models/rfid-tag.model";
import CustomResponse from "../utils/response";
import { asyncHandler } from "../utils/utils";

/**
 * @route GET /api/v1/rfid-tag
 */
export const getRfidTags = asyncHandler(async (req, res) => {
  const tags = await RfidTagModel.find()
    .populate({
      path: "registration",
      populate: [
        { path: "user", select: "name email" },
        { path: "event", select: "name" },
      ],
    })
    .populate("event", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.json(new CustomResponse(true, tags, "RFID tags fetched successfully"));
});

/**
 * @route POST /api/v1/rfid-tag
 */
export const createRfidTag = asyncHandler(async (req, res) => {
  const { epc, label } = req.body;
  appAssert(epc, BAD_REQUEST, "EPC is required");

  const existing = await RfidTagModel.findOne({ epc });
  if (existing) {
    res
      .status(BAD_REQUEST)
      .json(
        new CustomResponse(
          false,
          null,
          "An RFID tag with this EPC already exists",
        ),
      );
    return;
  }

  const tag = await RfidTagModel.create({ epc, label });

  res
    .status(CREATED)
    .json(new CustomResponse(true, tag, "RFID tag created successfully"));
});

/**
 * @route DELETE /api/v1/rfid-tag/:tagID
 */
export const removeRfidTag = asyncHandler(async (req, res) => {
  const { tagID } = req.params;

  const tag = await RfidTagModel.findByIdAndDelete(tagID);
  appAssert(tag, BAD_REQUEST, "RFID tag not found");

  res.json(new CustomResponse(true, null, "RFID tag deleted successfully"));
});

/**
 * @route PATCH /api/v1/rfid-tag/unassign/:tagID
 */
export const unassignRfidTag = asyncHandler(async (req, res) => {
  const { tagID } = req.params;

  const tag = await RfidTagModel.findByIdAndUpdate(
    tagID,
    { registration: null, event: null, status: "available" },
    { new: true },
  );
  appAssert(tag, BAD_REQUEST, "RFID tag not found");

  res.json(new CustomResponse(true, null, "RFID tag unassigned successfully"));
});
