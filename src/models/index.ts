// ─── Base ───────────────────────────────────────────────────────────────────
export interface BaseRecord {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ─── Usuario ─────────────────────────────────────────────────────────────────
export interface Usuario extends BaseRecord {
  email: string;
  displayName: string;
  photoUrl?: string;
  phoneNumber?: string;
  role: "admin" | "client";
  estado: boolean;
}

// ─── Categoria ───────────────────────────────────────────────────────────────
export interface Categoria extends BaseRecord {
  nombre: string;
  descripcion: string;
  img?: string;
  estado: boolean;
}

// ─── Laboratorio ─────────────────────────────────────────────────────────────
export interface Laboratorio extends BaseRecord {
  nombre: string;
  estado: boolean;
  categoriaId: string;
  categoria?: Categoria;
}

// ─── Sucursal ─────────────────────────────────────────────────────────────────
export interface Sucursal extends BaseRecord {
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: boolean;
}

// ─── Producto ────────────────────────────────────────────────────────────────
export interface Producto extends BaseRecord {
  codigo: string;
  codigoBarras?: number;
  nombre: string;
  descripcion: string;
  marca: string;
  unidad: string;
  precio: number;
  precioCompra: number;
  precioVenta: number;
  descuento: number;
  img?: string;
  estado: boolean;
  categoriaId: string;
  categoria?: Categoria;
  laboratorioId?: string;
  laboratorio?: Laboratorio;
  promocionId?: string;
}

// ─── Lote ────────────────────────────────────────────────────────────────────
export interface Lote extends BaseRecord {
  numLote: string;
  fechaElaboracion: Date;
  fechaVencimiento: Date;
  stockBD: number;
  estado: boolean;
  productoId: string;
  producto?: Producto;
  categoriaId: string;
  categoria?: Categoria;
}

// ─── Inventario ──────────────────────────────────────────────────────────────
export interface Inventario extends BaseRecord {
  codInventario: string;
  stockSucursal: number;
  estado: boolean;
  loteId: string;
  lote?: Lote;
  sucursalId: string;
  sucursal?: Sucursal;
}

// ─── Promocion ───────────────────────────────────────────────────────────────
export interface Promocion extends BaseRecord {
  nombre: string;
  estado: boolean;
  fechaInicio: Date;
  fechaFin: Date;
  tipoPromocion: string;
}

// ─── Pedido ──────────────────────────────────────────────────────────────────
export type EstadoAtencion = "entrante" | "procesado" | "enviado" | "entregado";
export type TipoPago = "efectivo" | "credito" | "transferencia";

export interface Pedido extends BaseRecord {
  codPedido: string;
  fechaPedido: Date;
  fechaAtendida?: Date;
  pdfUrl?: string;
  cantidadTotal: number;
  importeTotal: number;
  saldoRestante: number;
  tipoPago: TipoPago;
  estadoAtencion: EstadoAtencion;
  estado: boolean;
  procesamiento: boolean;
  usuarioId: string;
  usuario?: Usuario;
  detalles?: DetallePedido[];
}

// ─── DetallePedido ────────────────────────────────────────────────────────────
export interface DetallePedido extends BaseRecord {
  pedidoId: string;
  productoId: string;
  producto?: Producto;
  inventarioId: string;
  inventario?: Inventario;
  cantidad: number;
  subtotal: number;
  estado: boolean;
}

// ─── Credito ─────────────────────────────────────────────────────────────────
export interface Credito extends BaseRecord {
  usuarioId: string;
  usuario?: Usuario;
  saldoInicial: number;
  saldoCredito: number;
  cuota: number;
  fechaInicio: Date;
  fechaFinal: Date;
  estadoCredito: "ACTIVO" | "INACTIVO";
  estadoBloqueo: boolean;
}

// ─── SolicitudCredito ────────────────────────────────────────────────────────
export interface SolicitudCredito extends BaseRecord {
  usuarioId: string;
  usuario?: Usuario;
  nombreCliente: string;
  ruc: string;
  dni: string;
  resolucionSanitaria: string;
  ventasMensuales: string;
  saldo: number;
  cuota: number;
  fechaSolicitud: Date;
  fechaRespuesta?: Date;
  mensaje?: string;
  estadoAprobacion: "PENDIENTE" | "APROBADO" | "RECHAZADO";
}

// ─── Blog ────────────────────────────────────────────────────────────────────
export interface Blog extends BaseRecord {
  titulo: string;
  urlImg?: string;
  urlVideo?: string;
  estado: boolean;
  categoriaId: string;
  categoria?: Categoria;
}

// ─── Devolucion ───────────────────────────────────────────────────────────────
export interface Devolucion extends BaseRecord {
  pedidoId: string;
  pedido?: Pedido;
  usuarioId: string;
  usuario?: Usuario;
  horaDevuelta?: Date;
  horaSolicitud: Date;
  comentario: string;
  estadoDevuelto: string;
}

// ─── Notificacion ─────────────────────────────────────────────────────────────
export interface Notificacion extends BaseRecord {
  titulo: string;
  mensaje: string;
  leida: boolean;
  tipo: "pedido" | "credito" | "devolucion" | "sistema";
  referenciaId?: string;
}

// ─── Bonificacion ─────────────────────────────────────────────────────────────
export interface Bonificacion extends BaseRecord {
  usuarioId: string;
  usuario?: Usuario;
  cantPuntos: number;
}

// ─── ProductoDescuento (for discounted product display) ──────────────────────
export interface ProductoDescuento {
  codProducto: string;
  productoId: string;
  nombre: string;
  descripcion: string;
  img?: string;
  precio: number;
  precioDescontado: number;
  descuento: number;
}

// ─── DetallePedidoTemporal (cart) ─────────────────────────────────────────────
export interface DetallePedidoTemporal {
  productoId: string;
  inventarioId: string;
  loteId: string;
  sucursalId: string;
  codigoDetalle: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter ───────────────────────────────────────────────────────────────────
export interface FilterParams {
  search?: string;
  estado?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
