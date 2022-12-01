function randomMinMax(min: number, max: number, decimal = false): number {
  if (!decimal) return Math.floor(Math.random() * (max - min + 1) + min);
  return Math.random() * (max - min) + min;
}

export default randomMinMax;
