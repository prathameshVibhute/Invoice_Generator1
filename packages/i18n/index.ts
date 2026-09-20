export type TranslationTree = Record<string, string | TranslationTree>;
export function t(dictionary: TranslationTree, key: string): string {
  const value = key
    .split(".")
    .reduce<string | TranslationTree | undefined>(
      (current, part) => (typeof current === "object" ? current[part] : undefined),
      dictionary,
    );
  return typeof value === "string" ? value : key;
}
