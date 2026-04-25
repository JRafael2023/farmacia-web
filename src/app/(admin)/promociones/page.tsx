"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { EstadoBadge } from "@/components/ui/Badge";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input, { Select } from "@/components/ui/Input";
import { promocionController } from "@/controllers/PromocionController";
import type { Promocion } from "@/models";
import { formatDate } from "@/lib/utils";

const TIPOS = [
  { value: "porcentaje", label: "Porcentaje" },
  { value: "combo", label: "Combo" },
  { value: "descuento_fijo", label: "Descuento fijo" },
];

const EMPTY = { nombre: "", fechaInicio: "", fechaFin: "", tipoPromocion: "", estado: true };

export default function PromocionesPage() {
  const [data, setData] = useState<Promocion[]>([]);
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
    const result = await promocionController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p: Promocion) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      fechaInicio: p.fechaInicio.toISOString().split("T")[0],
      fechaFin: p.fechaFin.toISOString().split("T")[0],
      tipoPromocion: p.tipoPromocion, estado: p.estado,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, fechaInicio: new Date(form.fechaInicio), fechaFin: new Date(form.fechaFin) };
    if (editId) await promocionController.update(editId, payload);
    else await promocionController.create(payload as Omit<Promocion, "id" | "createdAt" | "updatedAt">);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const now = new Date();
  const isActive = (p: Promocion) => p.estado && p.fechaInicio <= now && p.fechaFin >= now;

  const columns: Column<Promocion>[] = [
    { key: "nombre", header: "Promoción", render: (p) => <span className="font-medium text-slate-800">{p.nombre}</span> },
    { key: "tipoPromocion", header: "Tipo", render: (p) => TIPOS.find((t) => t.value === p.tipoPromocion)?.label ?? p.tipoPromocion },
    { key: "fechaInicio", header: "Inicio", render: (p) => formatDate(p.fechaInicio) },
    { key: "fechaFin", header: "Fin", render: (p) => formatDate(p.fechaFin) },
    {
      key: "vigente", header: "Vigente",
      render: (p) => (
        <span className={`badge ${isActive(p) ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {isActive(p) ? "Vigente" : "Inactiva"}
        </span>
      ),
    },
    { key: "estado", header: "Estado", render: (p) => <EstadoBadge estado={p.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "100px",
      render: (p) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Pencil size={14} /></button>
          <button onClick={() => promocionController.toggleEstado(p.id, !p.estado).then(load)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            {p.estado ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
          </button>
          <button onClick={() => { setDeleteId(p.id); setDeleteModal(true); }} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Promociones" description="Gestión de promociones y descuentos" actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Nueva promoción</Button>} />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar promoción..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(p) => p.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Editar promoción" : "Nueva promoción"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar" : "Crear"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Nombre" value={form.nombre} onChange={(e) => f("nombre", e.target.value)} required />
          <Select label="Tipo de promoción" value={form.tipoPromocion} onChange={(e) => f("tipoPromocion", e.target.value)} options={TIPOS} placeholder="Seleccionar tipo" required />
          <Input label="Fecha inicio" type="date" value={form.fechaInicio} onChange={(e) => f("fechaInicio", e.target.value)} required />
          <Input label="Fecha fin" type="date" value={form.fechaFin} onChange={(e) => f("fechaFin", e.target.value)} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="est-promo" checked={form.estado} onChange={(e) => f("estado", e.target.checked)} className="accent-blue-600" />
            <label htmlFor="est-promo" className="text-xs font-medium text-slate-700">Promoción activa</label>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={async () => {
        if (!deleteId) return;
        setSaving(true);
        await promocionController.delete(deleteId);
        setSaving(false);
        setDeleteModal(false);
        setDeleteId(null);
        load();
      }} title="Eliminar promoción" description="Esta promoción será eliminada permanentemente." confirmLabel="Eliminar" danger loading={saving} />
    </div>
  );
}
