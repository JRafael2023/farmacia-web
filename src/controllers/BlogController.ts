import type { Blog, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

const MOCK_BLOGS: Blog[] = [
  { id: "b1", titulo: "Importancia del control de inventario en farmacias", estado: true, categoriaId: "1", urlImg: "https://placehold.co/400x200", createdAt: new Date("2024-01-20") },
  { id: "b2", titulo: "Cómo almacenar correctamente los medicamentos", estado: true, categoriaId: "2", urlImg: "https://placehold.co/400x200", createdAt: new Date("2024-02-10") },
  { id: "b3", titulo: "Novedades en medicamentos genéricos 2024", estado: false, categoriaId: "3", urlImg: "https://placehold.co/400x200", createdAt: new Date("2024-03-01") },
];

class BlogController {
  private items = [...MOCK_BLOGS];

  async getAll(filters: FilterParams = {}): Promise<PaginatedResult<Blog>> {
    let result = [...this.items];
    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["titulo"] as (keyof Record<string, unknown>)[]) as unknown as Blog[];
    }
    if (filters.estado !== undefined) {
      result = result.filter((b) => b.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getById(id: string): Promise<Blog | null> {
    return this.items.find((b) => b.id === id) ?? null;
  }

  async create(data: Omit<Blog, "id" | "createdAt" | "updatedAt">): Promise<Blog> {
    const item: Blog = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Blog>): Promise<Blog> {
    const idx = this.items.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Blog no encontrado");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((b) => b.id !== id);
  }

  async toggleEstado(id: string, estado: boolean): Promise<Blog> {
    return this.update(id, { estado });
  }
}

export const blogController = new BlogController();
