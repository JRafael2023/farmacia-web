"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import { CreditStatusBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { creditoController } from "@/controllers/CreditoController";
import type { SolicitudCredito } from "@/models";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SolicitudesCreditoPage() {
  const [data, setData] = useState<SolicitudCredito[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{ id: string; tipo: "aprobar" | "rechazar" } | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await creditoController.getAllSolicitudes({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async () => {
    if (!actionModal) return;
    setSaving(true);
    if (actionModal.tipo === "aprobar") {
      await creditoController.aprobarSolicitud(actionModal.id, mensaje || "Solicitud aprobada");
    } else {
      await creditoController.rechazarSolicitud(actionModal.id, mensaje || "Solicitud rechazada");
    }
    setSaving(false);
    setActionModal(null);
    setMensaje("");
    load();
  };

  const columns: Column<SolicitudCredito>[] = [
    { key: "nombreCliente", header: "Cliente", render: (s) => <span className="font-medium text-slate-800">{s.nombreCliente}</span> },
    { key: "dni", header: "DNI / RUC", render: (s) => <div><p className="text-xs">{s.dni}</p><p className="text-xs text-slate-400">{s.ruc}</p></div> },
    { key: "saldo", header: "Saldo solicitado", render: (s) => <span className="font-semibold">{formatCurrency(s.saldo)}</span> },
    { key: "cuota", header: "Cuotas", render: (s) => `${s.cuota} meses` },
    { key: "ventasMensuales", header: "Ventas mens.", render: (s) => formatCurrency(Number(s.ventasMensuales)) },
    { key: "fechaSolicitud", header: "Fecha", render: (s) => formatDate(s.fechaSolicitud) },
    { key: "estadoAprobacion", header: "Estado", render: (s) => <CreditStatusBadge estado={s.estadoAprobacion} /> },
    {
      key: "acciones", header: "Acciones", width: "120px",
      render: (s) => s.estadoAprobacion === "PENDIENTE" ? (
        <div className="flex items-center gap-1">
          <button onClick={() => { setActionModal({ id: s.id, tipo: "aprobar" }); setMensaje(""); }}
            className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600" title="Aprobar">
            <CheckCircle size={16} />
          </button>
          <button onClick={() => { setActionModal({ id: s.id, tipo: "rechazar" }); setMensaje(""); }}
            className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Rechazar">
            <XCircle size={16} />
          </button>
        </div>
      ) : (
        <span className="text-xs text-slate-400">{s.mensaje ?? "—"}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Solicitudes de Crédito" description="Revisión y aprobación de solicitudes" />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por cliente, DNI, RUC..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(s) => s.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal
        open={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal?.tipo === "aprobar" ? "Aprobar solicitud" : "Rechazar solicitud"}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancelar</Button>
            <Button
              variant={actionModal?.tipo === "aprobar" ? "primary" : "danger"}
              loading={saving}
              onClick={handleAction}
            >
              {actionModal?.tipo === "aprobar" ? "Aprobar" : "Rechazar"}
            </Button>
          </>
        }
      >
        <Textarea
          label="Mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          placeholder={actionModal?.tipo === "aprobar" ? "Motivo de aprobación..." : "Motivo de rechazo..."}
        />
      </Modal>
    </div>
  );
}
