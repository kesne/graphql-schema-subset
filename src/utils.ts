export function compact<T>(arr: (T | undefined | null | false | void)[]): T[] {
  return arr.filter(Boolean) as T[];
}
