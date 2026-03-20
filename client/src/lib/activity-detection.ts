export type Activity =
  | "RESTING"
  | "LIGHT_ACTIVITY"
  | "WALKING"
  | "RUNNING"
  | "MUSCLE_EXERTION";

interface ActivityInput {
  bpm: number;
  emg: number;
}

export function detectActivity({ bpm, emg }: ActivityInput): Activity {
  // normalize EMG if needed
  const emgLevel = emg;

  if (bpm < 60 && emgLevel < 200) {
    return "RESTING";
  }

  if (bpm < 90 && emgLevel < 500) {
    return "LIGHT_ACTIVITY";
  }

  if (bpm >= 90 && bpm < 120 && emgLevel < 800) {
    return "WALKING";
  }

  if (bpm >= 120 && emgLevel < 1000) {
    return "RUNNING";
  }

  if (emgLevel >= 1000) {
    return "MUSCLE_EXERTION";
  }

  return "LIGHT_ACTIVITY";
}
