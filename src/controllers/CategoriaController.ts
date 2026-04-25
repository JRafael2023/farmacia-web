import type { Categoria, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

const MOCK_CATEGORIAS: Categoria[] = [
  { id: "1", nombre: "Analgésicos", descripcion: "Medicamentos para el dolor", estado: true, createdAt: new Date("2024-01-01") },
  { id: "2", nombre: "Antibióticos", descripcion: "Medicamentos contra bacterias", estado: true, createdAt: new Date("2024-01-01") },
  { id: "3", nombre: "Gastroprotectores", descripcion: "Protectores gástricos", estado: true, createdAt: new Date("2024-01-01") },
  { id: "4", nombre: "Antihistamínicos", descripcion: "Medicamentos para alergias", estado: true, createdAt: new Date("2024-01-01") },
  { id: "5", nombre: "Vitaminas", descripcion: "Suplementos vitamínicos", estado: false, createdAt: new Date("2024-02-01") },
];

class CategoriaController {
  private items = [...MOCK_CATEGORIAS];

  async getAll(filters: FilterParams = {}): Promise<PaginatedResult<Categoria>> {
    let result = [...this.items];
    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["nombre", "descripcion"] as (keyof Record<string, unknown>)[]) as unknown as Categoria[];
    }
    if (filters.estado !== undefined) {
      result = result.filter((c) => c.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getById(id: string): Promise<Categoria | null> {
    return this.items.find((c) => c.id === id) ?? null;
  }

  async getActivas(): Promise<Categoria[]> {
    return this.items.filter((c) => c.estado);
  }

  async create(data: Omit<Categoria, "id" | "createdAt" | "updatedAt">): Promise<Categoria> {
    const item: Categoria = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Categoria>): Promise<Categoria> {
    const idx = this.items.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Categoría no encontrada");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((c) => c.id !== id);
  }

  async toggleEstado(id: string, estado: boolean): Promise<Categoria> {
    return this.update(id, { estado });
  }
}

export const categoriaController = new CategoriaController();
