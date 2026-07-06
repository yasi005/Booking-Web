export function buildPageList(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const result: (number | "ellipsis")[] = [];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  result.push(1);
  if (windowStart > 2) result.push("ellipsis");

  for (let page = windowStart; page <= windowEnd; page++) {
    result.push(page);
  }

  if (windowEnd < totalPages - 1) result.push("ellipsis");
  result.push(totalPages);

  return result;
}
