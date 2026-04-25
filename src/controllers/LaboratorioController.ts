import type { Laboratorio, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

const MOCK_LABORATORIOS: Laboratorio[] = [
  { id: "1", nombre: "Laboratorio Roemmers", estado: true, categoriaId: "1", createdAt: new Date("2024-01-01") },
  { id: "2", nombre: "Bayer S.A.", estado: true, categoriaId: "1", createdAt: new Date("2024-01-01") },
  { id: "3", nombre: "Pfizer Inc.", estado: true, categoriaId: "2", createdAt: new Date("2024-01-01") },
  { id: "4", nombre: "Sigma Pharma", estado: true, categoriaId: "3", createdAt: new Date("2024-01-01") },
  { id: "5", nombre: "MK Colombia", estado: false, categoriaId: "4", createdAt: new Date("2024-02-01") },
];

class LaboratorioController {
  private items = [...MOCK_LABORATORIOS];

  async getAll(filters: FilterParams = {}): Promise<PaginatedResult<Laboratorio>> {
    let result = [...this.items];
    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["nombre"] as (keyof Record<string, unknown>)[]) as unknown as Laboratorio[];
    }
    if (filters.estado !== undefined) {
      result = result.filter((l) => l.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getById(id: string): Promise<Laboratorio | null> {
    return this.items.find((l) => l.id === id) ?? null;
  }

  async getActivos(): Promise<Laboratorio[]> {
    return this.items.filter((l) => l.estado);
  }

  async create(data: Omit<Laboratorio, "id" | "createdAt" | "updatedAt">): Promise<Laboratorio> {
    const item: Laboratorio = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Laboratorio>): Promise<Laboratorio> {
    const idx = this.items.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Laboratorio no encontrado");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((l) => l.id !== id);
  }

  async toggleEstado(id: string, estado: boolean): Promise<Laboratorio> {
    return this.update(id, { estado });
  }
}

export const laboratorioController = new LaboratorioController();
