import type { Credito, SolicitudCredito, FilterParams, PaginatedResult } from "@/models";
import { paginate } from "./BaseController";

const MOCK_CREDITOS: Credito[] = [
  { id: "c1", usuarioId: "u2", saldoInicial: 500, saldoCredito: 350, cuota: 3, fechaInicio: new Date("2024-01-01"), fechaFinal: new Date("2024-04-01"), estadoCredito: "ACTIVO", estadoBloqueo: false, createdAt: new Date("2024-01-01") },
  { id: "c2", usuarioId: "u3", saldoInicial: 1000, saldoCredito: 0, cuota: 6, fechaInicio: new Date("2023-06-01"), fechaFinal: new Date("2023-12-01"), estadoCredito: "INACTIVO", estadoBloqueo: false, createdAt: new Date("2023-06-01") },
  { id: "c3", usuarioId: "u4", saldoInicial: 800, saldoCredito: 800, cuota: 4, fechaInicio: new Date("2024-02-01"), fechaFinal: new Date("2024-06-01"), estadoCredito: "ACTIVO", estadoBloqueo: true, createdAt: new Date("2024-02-01") },
];

const MOCK_SOLICITUDES: SolicitudCredito[] = [
  { id: "s1", usuarioId: "u5", nombreCliente: "María García", ruc: "20123456789", dni: "12345678", resolucionSanitaria: "RS-001-2024", ventasMensuales: "5000", saldo: 2000, cuota: 6, fechaSolicitud: new Date("2024-03-01"), estadoAprobacion: "PENDIENTE", createdAt: new Date("2024-03-01") },
  { id: "s2", usuarioId: "u6", nombreCliente: "Carlos Pérez", ruc: "20987654321", dni: "87654321", resolucionSanitaria: "RS-002-2024", ventasMensuales: "3500", saldo: 1500, cuota: 3, fechaSolicitud: new Date("2024-02-15"), fechaRespuesta: new Date("2024-02-20"), mensaje: "Aprobado", estadoAprobacion: "APROBADO", createdAt: new Date("2024-02-15") },
  { id: "s3", usuarioId: "u7", nombreCliente: "Ana Torres", ruc: "20111222333", dni: "11122233", resolucionSanitaria: "RS-003-2024", ventasMensuales: "1000", saldo: 3000, cuota: 12, fechaSolicitud: new Date("2024-03-10"), fechaRespuesta: new Date("2024-03-12"), mensaje: "Saldo solicitado excede límite", estadoAprobacion: "RECHAZADO", createdAt: new Date("2024-03-10") },
];

class CreditoController {
  private creditos = [...MOCK_CREDITOS];
  private solicitudes = [...MOCK_SOLICITUDES];

  async getAllCreditos(filters: FilterParams = {}): Promise<PaginatedResult<Credito>> {
    let result = [...this.creditos];
    if (filters.search) {
      result = result.filter((c) => c.usuarioId.includes(filters.search!));
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getAllSolicitudes(filters: FilterParams = {}): Promise<PaginatedResult<SolicitudCredito>> {
    let result = [...this.solicitudes];
    if (filters.search) {
      result = result.filter((s) =>
        s.nombreCliente.toLowerCase().includes(filters.search!.toLowerCase()) ||
        s.dni.includes(filters.search!) ||
        s.ruc.includes(filters.search!)
      );
    }
    return paginate(result, filters.page ?? 1, filters.pageSize ?? 10);
  }

  async getCreditoByUsuario(usuarioId: string): Promise<Credito | null> {
    return this.creditos.find((c) => c.usuarioId === usuarioId && c.estadoCredito === "ACTIVO") ?? null;
  }

  async createCredito(data: Omit<Credito, "id" | "createdAt" | "updatedAt">): Promise<Credito> {
    const item: Credito = { ...data, id: Date.now().toString(), createdAt: new Date() };
    this.creditos.push(item);
    return item;
  }

  async updateCredito(id: string, data: Partial<Credito>): Promise<Credito> {
    const idx = this.creditos.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Crédito no encontrado");
    this.creditos[idx] = { ...this.creditos[idx], ...data, updatedAt: new Date() };
    return this.creditos[idx];
  }

  async bloquearCredito(id: string, bloqueado: boolean): Promise<Credito> {
    return this.updateCredito(id, { estadoBloqueo: bloqueado });
  }

  async aprobarSolicitud(id: string, mensaje: string): Promise<SolicitudCredito> {
    const idx = this.solicitudes.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Solicitud no encontrada");
    this.solicitudes[idx] = { ...this.solicitudes[idx], estadoAprobacion: "APROBADO", mensaje, fechaRespuesta: new Date(), updatedAt: new Date() };
    return this.solicitudes[idx];
  }

  async rechazarSolicitud(id: string, mensaje: string): Promise<SolicitudCredito> {
    const idx = this.solicitudes.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Solicitud no encontrada");
    this.solicitudes[idx] = { ...this.solicitudes[idx], estadoAprobacion: "RECHAZADO", mensaje, fechaRespuesta: new Date(), updatedAt: new Date() };
    return this.solicitudes[idx];
  }

  getPendingCount(): number {
    return this.solicitudes.filter((s) => s.estadoAprobacion === "PENDIENTE").length;
  }
}

export const creditoController = new CreditoController();
