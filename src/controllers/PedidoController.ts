import type { Pedido, EstadoAtencion, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

const MOCK_PEDIDOS: Pedido[] = [
  {
    id: "1", codPedido: "PED-001", fechaPedido: new Date("2024-03-01"), cantidadTotal: 5,
    importeTotal: 45.0, saldoRestante: 0, tipoPago: "efectivo", estadoAtencion: "entregado",
    estado: true, procesamiento: true, usuarioId: "u1", createdAt: new Date("2024-03-01"),
  },
  {
    id: "2", codPedido: "PED-002", fechaPedido: new Date("2024-03-05"), cantidadTotal: 3,
    importeTotal: 28.5, saldoRestante: 28.5, tipoPago: "credito", estadoAtencion: "enviado",
    estado: true, procesamiento: true, usuarioId: "u2", createdAt: new Date("2024-03-05"),
  },
  {
    id: "3", codPedido: "PED-003", fechaPedido: new Date("2024-03-10"), cantidadTotal: 8,
    importeTotal: 92.0, saldoRestante: 92.0, tipoPago: "transferencia", estadoAtencion: "procesado",
    estado: true, procesamiento: false, usuarioId: "u3", createdAt: new Date("2024-03-10"),
  },
  {
    id: "4", codPedido: "PED-004", fechaPedido: new Date("2024-03-12"), cantidadTotal: 2,
    importeTotal: 15.0, saldoRestante: 15.0, tipoPago: "efectivo", estadoAtencion: "entrante",
    estado: true, procesamiento: false, usuarioId: "u1", createdAt: new Date("2024-03-12"),
  },
  {
    id: "5", codPedido: "PED-005", fechaPedido: new Date("2024-03-14"), cantidadTotal: 10,
    importeTotal: 120.0, saldoRestante: 60.0, tipoPago: "credito", estadoAtencion: "entrante",
    estado: true, procesamiento: false, usuarioId: "u4", createdAt: new Date("2024-03-14"),
  },
];

class PedidoController {
  private items = [...MOCK_PEDIDOS];

  async getAll(filters: FilterParams & { estadoAtencion?: EstadoAtencion } = {}): Promise<PaginatedResult<Pedido>> {
    let result = [...this.items];
    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["codPedido"] as (keyof Record<string, unknown>)[]) as unknown as Pedido[];
    }
    if (filters.estadoAtencion) {
      result = result.filter((p) => p.estadoAtencion === filters.estadoAtencion);
    }
    result.sort((a, b) => b.fechaPedido.getTime() - a.fechaPedido.getTime());
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getById(id: string): Promise<Pedido | null> {
    return this.items.find((p) => p.id === id) ?? null;
  }

  async getByEstado(estado: EstadoAtencion): Promise<Pedido[]> {
    return this.items.filter((p) => p.estadoAtencion === estado);
  }

  async create(data: Omit<Pedido, "id" | "createdAt" | "updatedAt">): Promise<Pedido> {
    const item: Pedido = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Pedido>): Promise<Pedido> {
    const idx = this.items.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Pedido no encontrado");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async updateEstado(id: string, estadoAtencion: EstadoAtencion): Promise<Pedido> {
    return this.update(id, { estadoAtencion });
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((p) => p.id !== id);
  }

  async toggleEstado(id: string, estado: boolean): Promise<Pedido> {
    return this.update(id, { estado });
  }

  getCountByEstado(): Record<EstadoAtencion, number> {
    return {
      entrante: this.items.filter((p) => p.estadoAtencion === "entrante").length,
      procesado: this.items.filter((p) => p.estadoAtencion === "procesado").length,
      enviado: this.items.filter((p) => p.estadoAtencion === "enviado").length,
      entregado: this.items.filter((p) => p.estadoAtencion === "entregado").length,
    };
  }
}

export const pedidoController = new PedidoController();
