const STANDARD_INITIAL_CHAR = /[\p{L}\p{N}]/u;

export function getAvatarInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .map((part) =>
      Array.from(part).find((character) =>
        STANDARD_INITIAL_CHAR.test(character),
      ),
    )
    .filter((character): character is string => Boolean(character))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
