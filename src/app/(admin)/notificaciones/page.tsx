"use client";
import { Bell, ShoppingCart, CreditCard, RefreshCw, Info, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

type NotifType = "pedido" | "credito" | "devolucion" | "sistema";

interface NotifItem {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: NotifType;
  leida: boolean;
  fecha: Date;
}

const ICON_MAP: Record<NotifType, React.ReactNode> = {
  pedido: <ShoppingCart size={16} className="text-blue-600" />,
  credito: <CreditCard size={16} className="text-violet-600" />,
  devolucion: <RefreshCw size={16} className="text-amber-600" />,
  sistema: <Info size={16} className="text-slate-500" />,
};

const BG_MAP: Record<NotifType, string> = {
  pedido: "bg-blue-50",
  credito: "bg-violet-50",
  devolucion: "bg-amber-50",
  sistema: "bg-slate-50",
};

const INITIAL: NotifItem[] = [
  { id: "n1", titulo: "Nuevo pedido", mensaje: "El cliente Ana Torres realizó un pedido por S/. 120.00", tipo: "pedido", leida: false, fecha: new Date("2024-03-14T10:30:00") },
  { id: "n2", titulo: "Solicitud de crédito", mensaje: "María García solicitó un crédito de S/. 2,000.00 a 6 meses", tipo: "credito", leida: false, fecha: new Date("2024-03-13T09:15:00") },
  { id: "n3", titulo: "Devolución solicitada", mensaje: "El pedido PED-002 tiene una solicitud de devolución pendiente", tipo: "devolucion", leida: false, fecha: new Date("2024-03-12T14:00:00") },
  { id: "n4", titulo: "Stock bajo detectado", mensaje: "El producto Loratadina 10mg tiene solo 5 unidades en stock", tipo: "sistema", leida: true, fecha: new Date("2024-03-11T08:00:00") },
  { id: "n5", titulo: "Pedido entregado", mensaje: "El pedido PED-001 fue marcado como entregado exitosamente", tipo: "pedido", leida: true, fecha: new Date("2024-03-10T16:45:00") },
];

export default function NotificacionesPage() {
  const [items, setItems] = useState(INITIAL);
  const { setNotificationCount } = useAppStore();

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    setNotificationCount(0);
  };

  const markRead = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, leida: true } : n);
      const unread = updated.filter((n) => !n.leida).length;
      setNotificationCount(unread);
      return updated;
    });
  };

  const unread = items.filter((n) => !n.leida).length;

  return (
    <div>
      <PageHeader
        title="Notificaciones"
        description={`${unread} sin leer`}
        actions={unread > 0 ? (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
            <Check size={14} />
            Marcar todas como leídas
          </button>
        ) : undefined}
      />

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => markRead(item.id)}
            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
              item.leida ? "bg-white border-slate-200" : `${BG_MAP[item.tipo]} border-slate-300`
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${BG_MAP[item.tipo]} border border-current/10`}>
              {ICON_MAP[item.tipo]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${item.leida ? "text-slate-600" : "text-slate-800"}`}>
                  {item.titulo}
                </p>
                {!item.leida && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{item.mensaje}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDateTime(item.fecha)}</p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <Bell size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">Sin notificaciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
