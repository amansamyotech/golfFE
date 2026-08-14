export const TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGINATION_MODEL = { page: 0, pageSize: 10 };
export const TABLE_HEIGHT = 560;

export function sortLatestFirst<T>(items: T[] = []): T[] {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const recA = a as Record<string, unknown>;
    const recB = b as Record<string, unknown>;
    const aKey = (recA.createdAt || recA.dateTime || recA.date || recA.startDate || recA._id || "") as string;
    const bKey = (recB.createdAt || recB.dateTime || recB.date || recB.startDate || recB._id || "") as string;
    const aTime = new Date(aKey).getTime();
    const bTime = new Date(bKey).getTime();
    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
      return bTime - aTime;
    }
    return String(recB._id || "").localeCompare(String(recA._id || ""));
  });
}
