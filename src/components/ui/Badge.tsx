import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral" | "blue";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-cyan-100 text-cyan-700",
  neutral: "bg-slate-100 text-slate-600",
  blue: "bg-blue-100 text-blue-700",
};

export default function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span className={cn("badge", VARIANT_CLASSES[variant], className)}>
      {children}
    </span>
  );
}

export function EstadoBadge({ estado }: { estado: boolean }) {
  return (
    <Badge variant={estado ? "success" : "danger"}>
      {estado ? "Activo" : "Inactivo"}
    </Badge>
  );
}

export function OrderStatusBadge({ estado }: { estado: string }) {
  const map: Record<string, BadgeVariant> = {
    entrante: "blue",
    procesado: "warning",
    enviado: "info",
    entregado: "success",
  };
  const labels: Record<string, string> = {
    entrante: "Entrante",
    procesado: "Procesado",
    enviado: "Enviado",
    entregado: "Entregado",
  };
  return <Badge variant={map[estado] ?? "neutral"}>{labels[estado] ?? estado}</Badge>;
}

export function CreditStatusBadge({ estado }: { estado: string }) {
  const map: Record<string, BadgeVariant> = {
    ACTIVO: "success",
    INACTIVO: "neutral",
    PENDIENTE: "warning",
    APROBADO: "success",
    RECHAZADO: "danger",
  };
  return <Badge variant={map[estado] ?? "neutral"}>{estado}</Badge>;
}

export function ExpirationBadge({ days }: { days: number }) {
  if (days <= 90) return <Badge variant="danger">{days}d — Crítico</Badge>;
  if (days <= 210) return <Badge variant="warning">{days}d — Próximo</Badge>;
  return <Badge variant="success">{days}d — OK</Badge>;
}
