export const ORDER_STATUS = {
  ENTRANTE: "entrante",
  PROCESADO: "procesado",
  ENVIADO: "enviado",
  ENTREGADO: "entregado",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  entrante: "Entrante",
  procesado: "Procesado",
  enviado: "Enviado",
  entregado: "Entregado",
};

export const PAYMENT_TYPES = {
  CASH: "efectivo",
  CREDIT: "credito",
  TRANSFER: "transferencia",
} as const;

export const PAYMENT_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  credito: "Crédito",
  transferencia: "Transferencia",
};

export const CREDIT_STATUS = {
  ACTIVE: "ACTIVO",
  INACTIVE: "INACTIVO",
} as const;

export const CREDIT_REQUEST_STATUS = {
  PENDING: "PENDIENTE",
  APPROVED: "APROBADO",
  REJECTED: "RECHAZADO",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
} as const;

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Productos",
    href: "/productos",
    icon: "Package",
  },
  {
    label: "Categorías",
    href: "/categorias",
    icon: "Tag",
  },
  {
    label: "Laboratorios",
    href: "/laboratorios",
    icon: "FlaskConical",
  },
  {
    label: "Inventario",
    href: "/inventario",
    icon: "Warehouse",
    children: [
      { label: "Stock", href: "/inventario" },
      { label: "Lotes", href: "/lotes" },
      { label: "Almacén", href: "/almacen" },
    ],
  },
  {
    label: "Pedidos",
    href: "/pedidos",
    icon: "ShoppingCart",
    children: [
      { label: "Todos", href: "/pedidos" },
      { label: "Entrantes", href: "/pedidos/entrantes" },
      { label: "Procesados", href: "/pedidos/procesados" },
      { label: "Enviados", href: "/pedidos/enviados" },
      { label: "Entregados", href: "/pedidos/entregados" },
    ],
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: "Users",
  },
  {
    label: "Créditos",
    href: "/creditos",
    icon: "CreditCard",
    children: [
      { label: "Activos", href: "/creditos" },
      { label: "Solicitudes", href: "/creditos/solicitudes" },
    ],
  },
  {
    label: "Blogs",
    href: "/blogs",
    icon: "FileText",
  },
  {
    label: "Promociones",
    href: "/promociones",
    icon: "Percent",
  },
  {
    label: "Notificaciones",
    href: "/notificaciones",
    icon: "Bell",
  },
] as const;

export const PAGINATION_SIZES = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;
