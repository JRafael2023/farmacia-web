import type { Usuario, FilterParams, PaginatedResult } from "@/models";
import { paginate, filterBySearch } from "./BaseController";

const MOCK_CLIENTES: Usuario[] = [
  { id: "u1", email: "juan.rios@email.com", displayName: "Juan Ríos", phoneNumber: "987654321", role: "client", estado: true, createdAt: new Date("2024-01-10") },
  { id: "u2", email: "maria.garcia@email.com", displayName: "María García", phoneNumber: "987123456", role: "client", estado: true, createdAt: new Date("2024-01-15") },
  { id: "u3", email: "carlos.perez@email.com", displayName: "Carlos Pérez", phoneNumber: "986789012", role: "client", estado: true, createdAt: new Date("2024-02-01") },
  { id: "u4", email: "ana.torres@email.com", displayName: "Ana Torres", phoneNumber: "985678901", role: "client", estado: false, createdAt: new Date("2024-02-10") },
  { id: "u5", email: "luis.mendez@email.com", displayName: "Luis Méndez", phoneNumber: "984567890", role: "client", estado: true, createdAt: new Date("2024-03-01") },
];

class ClienteController {
  private items = [...MOCK_CLIENTES];

  async getAll(filters: FilterParams = {}): Promise<PaginatedResult<Usuario>> {
    let result = this.items.filter((u) => u.role === "client");
    if (filters.search) {
      result = filterBySearch(result as unknown as Record<string, unknown>[], filters.search, ["displayName", "email", "phoneNumber"] as (keyof Record<string, unknown>)[]) as unknown as Usuario[];
    }
    if (filters.estado !== undefined) {
      result = result.filter((u) => u.estado === filters.estado);
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getById(id: string): Promise<Usuario | null> {
    return this.items.find((u) => u.id === id) ?? null;
  }

  async create(data: Omit<Usuario, "id" | "createdAt" | "updatedAt">): Promise<Usuario> {
    const item: Usuario = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario> {
    const idx = this.items.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Cliente no encontrado");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async toggleEstado(id: string, estado: boolean): Promise<Usuario> {
    return this.update(id, { estado });
  }

  getTotal(): number {
    return this.items.filter((u) => u.role === "client").length;
  }
}

export const clienteController = new ClienteController();
