import type { Producto, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PRODUCTOS: Producto[] = [
  {
    id: "1", codigo: "PRD-001", codigoBarras: 7501000000001,
    nombre: "Paracetamol 500mg", descripcion: "Analgésico y antipirético", marca: "Genérico",
    unidad: "Tableta", precio: 0.5, precioCompra: 0.25, precioVenta: 0.5, descuento: 0,
    estado: true, categoriaId: "1", laboratorioId: "1", createdAt: new Date("2024-01-01"),
  },
  {
    id: "2", codigo: "PRD-002", codigoBarras: 7501000000002,
    nombre: "Ibuprofeno 400mg", descripcion: "Antiinflamatorio no esteroideo", marca: "MK",
    unidad: "Cápsula", precio: 0.8, precioCompra: 0.4, precioVenta: 0.8, descuento: 5,
    estado: true, categoriaId: "1", laboratorioId: "2", createdAt: new Date("2024-01-05"),
  },
  {
    id: "3", codigo: "PRD-003", codigoBarras: 7501000000003,
    nombre: "Amoxicilina 500mg", descripcion: "Antibiótico de amplio espectro", marca: "Sigma",
    unidad: "Cápsula", precio: 1.2, precioCompra: 0.6, precioVenta: 1.2, descuento: 0,
    estado: true, categoriaId: "2", laboratorioId: "1", createdAt: new Date("2024-01-10"),
  },
  {
    id: "4", codigo: "PRD-004", codigoBarras: 7501000000004,
    nombre: "Omeprazol 20mg", descripcion: "Inhibidor de la bomba de protones", marca: "Genérico",
    unidad: "Cápsula", precio: 0.6, precioCompra: 0.3, precioVenta: 0.6, descuento: 0,
    estado: true, categoriaId: "3", laboratorioId: "3", createdAt: new Date("2024-02-01"),
  },
  {
    id: "5", codigo: "PRD-005", codigoBarras: 7501000000005,
    nombre: "Loratadina 10mg", descripcion: "Antihistamínico de segunda generación", marca: "Bayer",
    unidad: "Tableta", precio: 0.4, precioCompra: 0.2, precioVenta: 0.4, descuento: 10,
    estado: false, categoriaId: "4", laboratorioId: "2", createdAt: new Date("2024-02-15"),
  },
];

// ─── Controller ───────────────────────────────────────────────────────────────
class ProductoController {
  private items = [...MOCK_PRODUCTOS];

  async getAll(filters: FilterParams = {}): Promise<PaginatedResult<Producto>> {
    let result = [...this.items];

    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["nombre", "codigo", "marca", "descripcion"] as (keyof Record<string, unknown>)[]) as unknown as Producto[];
    }
    if (filters.estado !== undefined) {
      result = result.filter((p) => p.estado === filters.estado);
    }

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    return paginate(result, page, pageSize);
  }

  async getById(id: string): Promise<Producto | null> {
    return this.items.find((p) => p.id === id) ?? null;
  }

  async create(data: Omit<Producto, "id" | "createdAt" | "updatedAt">): Promise<Producto> {
    const newItem: Producto = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, data: Partial<Producto>): Promise<Producto> {
    const idx = this.items.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Producto no encontrado");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((p) => p.id !== id);
  }

  async toggleEstado(id: string, estado: boolean): Promise<Producto> {
    return this.update(id, { estado });
  }

  async getByCategoriaId(categoriaId: string): Promise<Producto[]> {
    return this.items.filter((p) => p.categoriaId === categoriaId);
  }
}

export const productoController = new ProductoController();
