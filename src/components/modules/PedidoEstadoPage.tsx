"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Eye } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/Badge";
import Badge from "@/components/ui/Badge";
import { pedidoController } from "@/controllers/PedidoController";
import type { Pedido, EstadoAtencion } from "@/models";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAYMENT_LABELS: Record<string, string> = {
  efectivo: "Efectivo", credito: "Crédito", transferencia: "Transferencia",
};

const NEXT_STATE: Record<string, EstadoAtencion | null> = {
  entrante: "procesado", procesado: "enviado", enviado: "entregado", entregado: null,
};
const NEXT_LABEL: Record<string, string> = {
  entrante: "Procesar", procesado: "Marcar enviado", enviado: "Marcar entregado",
};

interface Props {
  estadoAtencion: EstadoAtencion;
  title: string;
  description: string;
}

export default function PedidoEstadoPage({ estadoAtencion, title, description }: Props) {
  const [data, setData] = useState<Pedido[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await pedidoController.getAll({ estadoAtencion, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [estadoAtencion, page]);

  useEffect(() => { load(); }, [load]);

  const handleAdvance = async (pedido: Pedido) => {
    const next = NEXT_STATE[pedido.estadoAtencion];
    if (!next) return;
    await pedidoController.updateEstado(pedido.id, next);
    load();
  };

  const columns: Column<Pedido>[] = [
    { key: "codPedido", header: "Código", render: (p) => <span className="font-mono text-xs font-semibold text-slate-700">{p.codPedido}</span> },
    { key: "fechaPedido", header: "Fecha pedido", render: (p) => formatDate(p.fechaPedido) },
    { key: "usuarioId", header: "Cliente", render: (p) => <span className="text-xs text-slate-600">{p.usuarioId}</span> },
    { key: "cantidadTotal", header: "Cant.", width: "60px", render: (p) => <span className="font-medium">{p.cantidadTotal}</span> },
    { key: "importeTotal", header: "Total", render: (p) => <span className="font-semibold">{formatCurrency(p.importeTotal)}</span> },
    { key: "saldoRestante", header: "Saldo", render: (p) => (
      <span className={p.saldoRestante > 0 ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
        {formatCurrency(p.saldoRestante)}
      </span>
    )},
    { key: "tipoPago", header: "Pago", render: (p) => <Badge variant="neutral">{PAYMENT_LABELS[p.tipoPago] ?? p.tipoPago}</Badge> },
    { key: "estadoAtencion", header: "Estado", render: (p) => <OrderStatusBadge estado={p.estadoAtencion} /> },
    {
      key: "acciones", header: "Acciones", width: "140px",
      render: (p) => {
        const next = NEXT_STATE[p.estadoAtencion];
        return (
          <div className="flex items-center gap-1">
            {next && (
              <Button size="sm" variant="outline" icon={<ArrowRight size={12} />} onClick={() => handleAdvance(p)}>
                {NEXT_LABEL[p.estadoAtencion]}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} />
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(p) => p.id} emptyMessage="No hay pedidos en este estado." />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />
    </div>
  );
}
