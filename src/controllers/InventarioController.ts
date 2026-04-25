import type { Inventario, Lote, FilterParams, PaginatedResult } from "@/models";
import { paginate } from "./BaseController";

const MOCK_LOTES: Lote[] = [
  { id: "l1", numLote: "LOT-2024-001", fechaElaboracion: new Date("2024-01-01"), fechaVencimiento: new Date("2026-01-01"), stockBD: 500, estado: true, productoId: "1", categoriaId: "1", createdAt: new Date("2024-01-01") },
  { id: "l2", numLote: "LOT-2024-002", fechaElaboracion: new Date("2024-01-15"), fechaVencimiento: new Date("2024-07-15"), stockBD: 200, estado: true, productoId: "2", categoriaId: "1", createdAt: new Date("2024-01-15") },
  { id: "l3", numLote: "LOT-2024-003", fechaElaboracion: new Date("2024-02-01"), fechaVencimiento: new Date("2024-05-01"), stockBD: 100, estado: true, productoId: "3", categoriaId: "2", createdAt: new Date("2024-02-01") },
  { id: "l4", numLote: "LOT-2024-004", fechaElaboracion: new Date("2024-02-20"), fechaVencimiento: new Date("2026-02-20"), stockBD: 300, estado: true, productoId: "4", categoriaId: "3", createdAt: new Date("2024-02-20") },
];

const MOCK_INVENTARIO: Inventario[] = [
  { id: "i1", codInventario: "INV-001", stockSucursal: 120, estado: true, loteId: "l1", sucursalId: "s1", createdAt: new Date("2024-01-05") },
  { id: "i2", codInventario: "INV-002", stockSucursal: 80, estado: true, loteId: "l2", sucursalId: "s1", createdAt: new Date("2024-01-20") },
  { id: "i3", codInventario: "INV-003", stockSucursal: 45, estado: true, loteId: "l3", sucursalId: "s2", createdAt: new Date("2024-02-05") },
  { id: "i4", codInventario: "INV-004", stockSucursal: 200, estado: true, loteId: "l4", sucursalId: "s1", createdAt: new Date("2024-02-25") },
];

class InventarioController {
  private inventarios = [...MOCK_INVENTARIO];
  private lotes = [...MOCK_LOTES];

  async getAllInventario(filters: FilterParams = {}): Promise<PaginatedResult<Inventario>> {
    let result = [...this.inventarios];
    if (filters.estado !== undefined) {
      result = result.filter((i) => i.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getAllLotes(filters: FilterParams = {}): Promise<PaginatedResult<Lote>> {
    let result = [...this.lotes];
    if (filters.search) {
      result = result.filter((l) => l.numLote.toLowerCase().includes(filters.search!.toLowerCase()));
    }
    if (filters.estado !== undefined) {
      result = result.filter((l) => l.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getLoteById(id: string): Promise<Lote | null> {
    return this.lotes.find((l) => l.id === id) ?? null;
  }

  async createLote(data: Omit<Lote, "id" | "createdAt" | "updatedAt">): Promise<Lote> {
    const item: Lote = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.lotes.push(item);
    return item;
  }

  async updateLote(id: string, data: Partial<Lote>): Promise<Lote> {
    const idx = this.lotes.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Lote no encontrado");
    this.lotes[idx] = { ...this.lotes[idx], ...data, updatedAt: new Date() };
    return this.lotes[idx];
  }

  async deleteLote(id: string): Promise<void> {
    this.lotes = this.lotes.filter((l) => l.id !== id);
  }

  async createInventario(data: Omit<Inventario, "id" | "createdAt" | "updatedAt">): Promise<Inventario> {
    const item: Inventario = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.inventarios.push(item);
    return item;
  }

  async updateInventario(id: string, data: Partial<Inventario>): Promise<Inventario> {
    const idx = this.inventarios.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Inventario no encontrado");
    this.inventarios[idx] = { ...this.inventarios[idx], ...data, updatedAt: new Date() };
    return this.inventarios[idx];
  }

  async updateStock(inventarioId: string, delta: number): Promise<Inventario> {
    const inv = this.inventarios.find((i) => i.id === inventarioId);
    if (!inv) throw new Error("Inventario no encontrado");
    return this.updateInventario(inventarioId, { stockSucursal: inv.stockSucursal + delta });
  }

  getTotalStock(): number {
    return this.inventarios.reduce((acc, i) => acc + i.stockSucursal, 0);
  }
}

export const inventarioController = new InventarioController();
