export function getAvatarHueRotation(seed: string): string {
  const normalizedSeed = seed.trim().toLowerCase();
  let hash = 0;

  for (const character of normalizedSeed) {
    hash = (hash * 31 + character.codePointAt(0)!) % 360;
  }

  return `${hash}deg`;
}
