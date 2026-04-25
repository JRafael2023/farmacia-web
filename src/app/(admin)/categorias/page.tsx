"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { EstadoBadge } from "@/components/ui/Badge";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input, { Textarea } from "@/components/ui/Input";
import { categoriaController } from "@/controllers/CategoriaController";
import type { Categoria } from "@/models";
import { formatDate } from "@/lib/utils";

const EMPTY = { nombre: "", descripcion: "", img: "", estado: true };

export default function CategoriasPage() {
  const [data, setData] = useState<Categoria[]>([]);
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
    const result = await categoriaController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (c: Categoria) => {
    setEditId(c.id);
    setForm({ nombre: c.nombre, descripcion: c.descripcion, img: c.img ?? "", estado: c.estado });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) await categoriaController.update(editId, form);
    else await categoriaController.create(form as Omit<Categoria, "id" | "createdAt" | "updatedAt">);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    await categoriaController.delete(deleteId);
    setSaving(false);
    setDeleteModal(false);
    setDeleteId(null);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<Categoria>[] = [
    { key: "nombre", header: "Nombre", render: (c) => <span className="font-medium text-slate-800">{c.nombre}</span> },
    { key: "descripcion", header: "Descripción", render: (c) => <span className="text-slate-500 truncate max-w-[240px] block">{c.descripcion}</span> },
    { key: "createdAt", header: "Creada", render: (c) => formatDate(c.createdAt) },
    { key: "estado", header: "Estado", render: (c) => <EstadoBadge estado={c.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "100px",
      render: (c) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Pencil size={14} /></button>
          <button onClick={() => categoriaController.toggleEstado(c.id, !c.estado).then(load)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            {c.estado ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
          </button>
          <button onClick={() => { setDeleteId(c.id); setDeleteModal(true); }} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Clasificación de productos por categoría"
        actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Nueva categoría</Button>}
      />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar categoría..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(c) => c.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Editar categoría" : "Nueva categoría"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar" : "Crear"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Nombre" value={form.nombre} onChange={(e) => f("nombre", e.target.value)} required />
          <Textarea label="Descripción" value={form.descripcion} onChange={(e) => f("descripcion", e.target.value)} rows={3} />
          <Input label="URL de imagen" value={form.img} onChange={(e) => f("img", e.target.value)} placeholder="https://..." />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="est-cat" checked={form.estado} onChange={(e) => f("estado", e.target.checked)} className="accent-blue-600" />
            <label htmlFor="est-cat" className="text-xs font-medium text-slate-700">Categoría activa</label>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete}
        title="Eliminar categoría" description="Esta acción eliminará la categoría permanentemente." confirmLabel="Eliminar" danger loading={saving} />
    </div>
  );
}
