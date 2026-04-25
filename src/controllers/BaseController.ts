import type { FilterParams, PaginatedResult } from "@/models";

/**
 * Base controller interface — all entity controllers implement this.
 * When backend is ready, replace mock data with real API calls here.
 */
export interface IBaseController<T> {
  getAll(filters?: FilterParams): Promise<PaginatedResult<T>>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  toggleEstado(id: string, estado: boolean): Promise<T>;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total, page, pageSize, totalPages };
}

export function filterBySearch<T extends Record<string, unknown>>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  const q = search.toLowerCase();
  return items.filter((item) =>
    fields.some((field) =>
      String(item[field] ?? "").toLowerCase().includes(q)
    )
  );
}
