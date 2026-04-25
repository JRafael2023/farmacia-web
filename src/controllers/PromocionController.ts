import type { Promocion, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

const MOCK_PROMOCIONES: Promocion[] = [
  { id: "p1", nombre: "Descuento Verano 10%", estado: true, fechaInicio: new Date("2024-01-01"), fechaFin: new Date("2024-03-31"), tipoPromocion: "porcentaje", createdAt: new Date("2024-01-01") },
  { id: "p2", nombre: "2x1 Vitaminas", estado: true, fechaInicio: new Date("2024-02-01"), fechaFin: new Date("2024-02-28"), tipoPromocion: "combo", createdAt: new Date("2024-02-01") },
  { id: "p3", nombre: "Oferta Especial Antibióticos", estado: false, fechaInicio: new Date("2024-03-01"), fechaFin: new Date("2024-03-15"), tipoPromocion: "descuento_fijo", createdAt: new Date("2024-03-01") },
];

class PromocionController {
  private items = [...MOCK_PROMOCIONES];

  async getAll(filters: FilterParams = {}): Promise<PaginatedResult<Promocion>> {
    let result = [...this.items];
    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["nombre", "tipoPromocion"] as (keyof Record<string, unknown>)[]) as unknown as Promocion[];
    }
    if (filters.estado !== undefined) {
      result = result.filter((p) => p.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getById(id: string): Promise<Promocion | null> {
    return this.items.find((p) => p.id === id) ?? null;
  }

  async create(data: Omit<Promocion, "id" | "createdAt" | "updatedAt">): Promise<Promocion> {
    const item: Promocion = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Promocion>): Promise<Promocion> {
    const idx = this.items.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Promoción no encontrada");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((p) => p.id !== id);
  }

  async toggleEstado(id: string, estado: boolean): Promise<Promocion> {
    return this.update(id, { estado });
  }

  getActivas(): Promocion[] {
    const now = new Date();
    return this.items.filter((p) => p.estado && p.fechaInicio <= now && p.fechaFin >= now);
  }
}

export const promocionController = new PromocionController();
