"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { EstadoBadge, ExpirationBadge } from "@/components/ui/Badge";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input, { Select } from "@/components/ui/Input";
import { inventarioController } from "@/controllers/InventarioController";
import type { Lote } from "@/models";
import { formatDate, getDaysUntilExpiration } from "@/lib/utils";

const EMPTY = { numLote: "", fechaElaboracion: "", fechaVencimiento: "", stockBD: "", productoId: "", categoriaId: "", estado: true };

export default function LotesPage() {
  const [data, setData] = useState<Lote[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await inventarioController.getAllLotes({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (l: Lote) => {
    setEditId(l.id);
    setForm({
      numLote: l.numLote,
      fechaElaboracion: l.fechaElaboracion.toISOString().split("T")[0],
      fechaVencimiento: l.fechaVencimiento.toISOString().split("T")[0],
      stockBD: String(l.stockBD),
      productoId: l.productoId, categoriaId: l.categoriaId, estado: l.estado,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      fechaElaboracion: new Date(form.fechaElaboracion),
      fechaVencimiento: new Date(form.fechaVencimiento),
      stockBD: Number(form.stockBD),
    };
    if (editId) await inventarioController.updateLote(editId, payload);
    else await inventarioController.createLote(payload as Omit<Lote, "id" | "createdAt" | "updatedAt">);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<Lote>[] = [
    { key: "numLote", header: "Nro. Lote", render: (l) => <span className="font-mono text-xs font-semibold text-slate-700">{l.numLote}</span> },
    { key: "productoId", header: "Producto ref.", render: (l) => <span className="text-xs text-slate-600">{l.productoId}</span> },
    { key: "stockBD", header: "Stock", render: (l) => <span className="font-semibold text-slate-800">{l.stockBD} uds.</span> },
    { key: "fechaElaboracion", header: "Elaboración", render: (l) => formatDate(l.fechaElaboracion) },
    { key: "fechaVencimiento", header: "Vencimiento", render: (l) => (
      <div>
        <p className="text-xs">{formatDate(l.fechaVencimiento)}</p>
        <ExpirationBadge days={getDaysUntilExpiration(l.fechaVencimiento)} />
      </div>
    )},
    { key: "estado", header: "Estado", render: (l) => <EstadoBadge estado={l.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "80px",
      render: (l) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(l)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Pencil size={14} /></button>
          <button onClick={() => { setDeleteId(l.id); setDeleteModal(true); }} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Lotes"
        description="Control de lotes y fechas de vencimiento"
        actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Nuevo lote</Button>}
      />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por número de lote..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(l) => l.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Editar lote" : "Nuevo lote"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar" : "Crear"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Input label="Número de lote" value={form.numLote} onChange={(e) => f("numLote", e.target.value)} required className="col-span-2" />
          <Input label="Fecha elaboración" type="date" value={form.fechaElaboracion} onChange={(e) => f("fechaElaboracion", e.target.value)} required />
          <Input label="Fecha vencimiento" type="date" value={form.fechaVencimiento} onChange={(e) => f("fechaVencimiento", e.target.value)} required />
          <Input label="Stock" type="number" min="0" value={form.stockBD} onChange={(e) => f("stockBD", e.target.value)} required />
          <Input label="ID de producto" value={form.productoId} onChange={(e) => f("productoId", e.target.value)} required />
          <Input label="ID de categoría" value={form.categoriaId} onChange={(e) => f("categoriaId", e.target.value)} required />
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="est-lote" checked={form.estado} onChange={(e) => f("estado", e.target.checked)} className="accent-blue-600" />
            <label htmlFor="est-lote" className="text-xs font-medium text-slate-700">Lote activo</label>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={async () => {
        if (!deleteId) return;
        setSaving(true);
        await inventarioController.deleteLote(deleteId);
        setSaving(false);
        setDeleteModal(false);
        setDeleteId(null);
        load();
      }} title="Eliminar lote" description="Esta acción no se puede deshacer." confirmLabel="Eliminar" danger loading={saving} />
    </div>
  );
}
