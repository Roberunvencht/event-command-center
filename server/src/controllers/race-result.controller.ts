import { BAD_REQUEST } from "../constant/http";
import appAssert from "../errors/app-assert";
import RaceResultModel from "../models/race-result.model";
import CustomResponse from "../utils/response";
import { asyncHandler } from "../utils/utils";

/**
 * @route GET /api/v1/race-result
 * Query: eventID (required), raceCategory (optional)
 * Returns race results sorted by: finished first (by elapsedMs), then running, then others.
 */
export const getRaceResults = asyncHandler(async (req, res) => {
  const { eventID, raceCategory } = req.query;
  appAssert(eventID, BAD_REQUEST, "eventID query parameter is required");

  const filters: any = { event: eventID };
  if (raceCategory) {
    filters.raceCategory = raceCategory;
  }

  const results = await RaceResultModel.find(filters)
    .populate({
      path: "registration",
      populate: [
        { path: "user", select: "name email phone" },
        { path: "event", select: "name" },
      ],
    })
    .populate("rfidTag", "epc label")
    .sort({ elapsedMs: 1, status: 1, createdAt: 1 })
    .lean();

  // Sort: finished (by rank) first, then running, then not_started, then dnf/dns
  const statusOrder: Record<string, number> = {
    finished: 0,
    running: 1,
    not_started: 2,
    dns: 3,
    dnf: 4,
  };

  results.sort((a, b) => {
    const statusA = statusOrder[a.status] ?? 5;
    const statusB = statusOrder[b.status] ?? 5;
    if (statusA !== statusB) return statusA - statusB;
    // Within finished, sort by rank/elapsedMs
    if (a.status === "finished" && b.status === "finished") {
      return (a.elapsedMs ?? Infinity) - (b.elapsedMs ?? Infinity);
    }
    return 0;
  });

  res.json(
    new CustomResponse(true, results, "Race results fetched successfully"),
  );
});
