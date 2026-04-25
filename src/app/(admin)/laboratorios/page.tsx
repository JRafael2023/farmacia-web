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
import { laboratorioController } from "@/controllers/LaboratorioController";
import { categoriaController } from "@/controllers/CategoriaController";
import type { Laboratorio, Categoria } from "@/models";
import { formatDate } from "@/lib/utils";

const EMPTY = { nombre: "", categoriaId: "", estado: true };

export default function LaboratoriosPage() {
  const [data, setData] = useState<Laboratorio[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await laboratorioController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoriaController.getActivas().then(setCategorias); }, []);

  const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (l: Laboratorio) => {
    setEditId(l.id);
    setForm({ nombre: l.nombre, categoriaId: l.categoriaId, estado: l.estado });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) await laboratorioController.update(editId, form);
    else await laboratorioController.create(form as Omit<Laboratorio, "id" | "createdAt" | "updatedAt">);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    await laboratorioController.delete(deleteId);
    setSaving(false);
    setDeleteModal(false);
    setDeleteId(null);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<Laboratorio>[] = [
    { key: "nombre", header: "Laboratorio", render: (l) => <span className="font-medium text-slate-800">{l.nombre}</span> },
    { key: "categoriaId", header: "Categoría", render: (l) => categorias.find((c) => c.id === l.categoriaId)?.nombre ?? "—" },
    { key: "createdAt", header: "Registrado", render: (l) => formatDate(l.createdAt) },
    { key: "estado", header: "Estado", render: (l) => <EstadoBadge estado={l.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "100px",
      render: (l) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(l)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Pencil size={14} /></button>
          <button onClick={() => laboratorioController.toggleEstado(l.id, !l.estado).then(load)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            {l.estado ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
          </button>
          <button onClick={() => { setDeleteId(l.id); setDeleteModal(true); }} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Laboratorios"
        description="Proveedores y laboratorios farmacéuticos"
        actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Nuevo laboratorio</Button>}
      />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar laboratorio..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(l) => l.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Editar laboratorio" : "Nuevo laboratorio"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar" : "Crear"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Nombre del laboratorio" value={form.nombre} onChange={(e) => f("nombre", e.target.value)} required />
          <Select
            label="Categoría"
            value={form.categoriaId}
            onChange={(e) => f("categoriaId", e.target.value)}
            options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
            placeholder="Seleccionar categoría"
            required
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="est-lab" checked={form.estado} onChange={(e) => f("estado", e.target.checked)} className="accent-blue-600" />
            <label htmlFor="est-lab" className="text-xs font-medium text-slate-700">Laboratorio activo</label>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete}
        title="Eliminar laboratorio" description="Esta acción no se puede deshacer." confirmLabel="Eliminar" danger loading={saving} />
    </div>
  );
}
