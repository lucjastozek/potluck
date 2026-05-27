export function getAvatarHueRotation(seed: string): string {
  const normalizedSeed = seed.trim().toLowerCase();
  let hash = 0;

  for (const character of normalizedSeed) {
    hash = (hash * 31 + character.codePointAt(0)!) % 360;
  }

  return `${hash}deg`;
}

export function getAvatarHueClass(seed: string, buckets = 12): string {
  const normalizedSeed = seed.trim().toLowerCase();
  let hash = 0;
  for (const character of normalizedSeed) {
    hash = (hash * 31 + character.codePointAt(0)!) % 1000000007;
  }

  const bucket = Math.abs(hash) % buckets;
  return `avatarHue${bucket}`;
}
