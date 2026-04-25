"use client";
import { useState, useEffect, useCallback } from "react";
import { Eye, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/ui/Badge";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { pedidoController } from "@/controllers/PedidoController";
import type { Pedido } from "@/models";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAYMENT_LABELS: Record<string, string> = {
  efectivo: "Efectivo", credito: "Crédito", transferencia: "Transferencia",
};

export default function PedidosPage() {
  const [data, setData] = useState<Pedido[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const counts = pedidoController.getCountByEstado();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await pedidoController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const columns: Column<Pedido>[] = [
    { key: "codPedido", header: "Código", render: (p) => <span className="font-mono text-xs font-semibold text-slate-700">{p.codPedido}</span> },
    { key: "fechaPedido", header: "Fecha", render: (p) => formatDate(p.fechaPedido) },
    { key: "usuarioId", header: "Cliente", render: (p) => <span className="text-xs text-slate-600">{p.usuarioId}</span> },
    { key: "importeTotal", header: "Total", render: (p) => <span className="font-semibold">{formatCurrency(p.importeTotal)}</span> },
    { key: "tipoPago", header: "Pago", render: (p) => <Badge variant="neutral">{PAYMENT_LABELS[p.tipoPago] ?? p.tipoPago}</Badge> },
    { key: "estadoAtencion", header: "Estado", render: (p) => <OrderStatusBadge estado={p.estadoAtencion} /> },
    {
      key: "acciones", header: "", width: "60px",
      render: (p) => (
        <Link href={`/pedidos/${p.id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 inline-flex items-center" title="Ver detalle">
          <Eye size={14} />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Pedidos" description="Todos los pedidos del sistema" />

      {/* Status quick-links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Entrantes", href: "/pedidos/entrantes", count: counts.entrante, color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Procesados", href: "/pedidos/procesados", count: counts.procesado, color: "text-amber-600 bg-amber-50 border-amber-200" },
          { label: "Enviados", href: "/pedidos/enviados", count: counts.enviado, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
          { label: "Entregados", href: "/pedidos/entregados", count: counts.entregado, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center justify-between p-4 rounded-xl border transition-colors hover:shadow-sm ${item.color}`}>
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-2xl font-bold">{item.count}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por código de pedido..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(p) => p.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />
    </div>
  );
}
