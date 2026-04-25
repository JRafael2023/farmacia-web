"use client";
import { useState, useEffect, useCallback } from "react";
import { Lock, Unlock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import { CreditStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { creditoController } from "@/controllers/CreditoController";
import type { Credito } from "@/models";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CreditosPage() {
  const [data, setData] = useState<Credito[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pending = creditoController.getPendingCount();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await creditoController.getAllCreditos({ page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleToggleBloqueo = async (c: Credito) => {
    await creditoController.bloquearCredito(c.id, !c.estadoBloqueo);
    load();
  };

  const columns: Column<Credito>[] = [
    { key: "id", header: "ID", render: (c) => <span className="font-mono text-xs text-slate-600">{c.id}</span> },
    { key: "usuarioId", header: "Cliente", render: (c) => <span className="text-xs text-slate-700">{c.usuarioId}</span> },
    { key: "saldoInicial", header: "Saldo inicial", render: (c) => formatCurrency(c.saldoInicial) },
    { key: "saldoCredito", header: "Saldo restante", render: (c) => (
      <span className={c.saldoCredito > 0 ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
        {formatCurrency(c.saldoCredito)}
      </span>
    )},
    { key: "cuota", header: "Cuotas", render: (c) => `${c.cuota} meses` },
    { key: "fechaFinal", header: "Vence", render: (c) => formatDate(c.fechaFinal) },
    { key: "estadoCredito", header: "Estado", render: (c) => <CreditStatusBadge estado={c.estadoCredito} /> },
    {
      key: "bloqueo", header: "Bloqueo",
      render: (c) => (
        <button
          onClick={() => handleToggleBloqueo(c)}
          className={`p-1.5 rounded transition-colors ${c.estadoBloqueo ? "text-red-500 hover:bg-red-50" : "text-slate-400 hover:bg-slate-100"}`}
          title={c.estadoBloqueo ? "Desbloquear crédito" : "Bloquear crédito"}
        >
          {c.estadoBloqueo ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Créditos" description="Créditos activos de clientes"
        actions={
          <Link href="/creditos/solicitudes">
            <Button variant="outline">
              Solicitudes {pending > 0 && <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">{pending}</span>}
            </Button>
          </Link>
        }
      />
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(c) => c.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />
    </div>
  );
}
