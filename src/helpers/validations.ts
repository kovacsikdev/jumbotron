export const validateScore = (value: number): number => {
  return value < 0 ? 0 : value;
}

export const validateTimeouts = (value: number): number => {
  return value < 0 ? 0 : value > 3 ? 3 : value;
}

export const validateQuarter = (value: number): number => {
  return value < 1 ? 1 : value > 4 ? 4 : value;
}

export const validateYards = (value: number): number => {
  return value < 1 ? 1 : value > 99 ? 99 : value;
}