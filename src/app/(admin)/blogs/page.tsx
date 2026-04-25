"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { EstadoBadge } from "@/components/ui/Badge";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input, { Select } from "@/components/ui/Input";
import { blogController } from "@/controllers/BlogController";
import { categoriaController } from "@/controllers/CategoriaController";
import type { Blog, Categoria } from "@/models";
import { formatDate } from "@/lib/utils";

const EMPTY = { titulo: "", urlImg: "", urlVideo: "", categoriaId: "", estado: true };

export default function BlogsPage() {
  const [data, setData] = useState<Blog[]>([]);
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
    const result = await blogController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoriaController.getActivas().then(setCategorias); }, []);

  const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (b: Blog) => {
    setEditId(b.id);
    setForm({ titulo: b.titulo, urlImg: b.urlImg ?? "", urlVideo: b.urlVideo ?? "", categoriaId: b.categoriaId, estado: b.estado });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) await blogController.update(editId, form);
    else await blogController.create(form as Omit<Blog, "id" | "createdAt" | "updatedAt">);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<Blog>[] = [
    {
      key: "titulo", header: "Blog",
      render: (b) => (
        <div className="flex items-center gap-3">
          {b.urlImg ? (
            <img src={b.urlImg} alt={b.titulo} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Image size={16} className="text-slate-400" />
            </div>
          )}
          <p className="font-medium text-slate-800 max-w-[240px] truncate">{b.titulo}</p>
        </div>
      ),
    },
    { key: "categoriaId", header: "Categoría", render: (b) => categorias.find((c) => c.id === b.categoriaId)?.nombre ?? "—" },
    { key: "createdAt", header: "Publicado", render: (b) => formatDate(b.createdAt) },
    { key: "estado", header: "Estado", render: (b) => <EstadoBadge estado={b.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "100px",
      render: (b) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Pencil size={14} /></button>
          <button onClick={() => blogController.toggleEstado(b.id, !b.estado).then(load)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
            {b.estado ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
          </button>
          <button onClick={() => { setDeleteId(b.id); setDeleteModal(true); }} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Blogs" description="Gestión de contenido del blog" actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Nuevo blog</Button>} />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar blog..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(b) => b.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Editar blog" : "Nuevo blog"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar" : "Crear"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Título" value={form.titulo} onChange={(e) => f("titulo", e.target.value)} required />
          <Input label="URL de imagen" value={form.urlImg} onChange={(e) => f("urlImg", e.target.value)} placeholder="https://..." />
          <Input label="URL de video" value={form.urlVideo} onChange={(e) => f("urlVideo", e.target.value)} placeholder="https://youtube.com/..." />
          <Select label="Categoría" value={form.categoriaId} onChange={(e) => f("categoriaId", e.target.value)} options={categorias.map((c) => ({ value: c.id, label: c.nombre }))} placeholder="Seleccionar categoría" required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="est-blog" checked={form.estado} onChange={(e) => f("estado", e.target.checked)} className="accent-blue-600" />
            <label htmlFor="est-blog" className="text-xs font-medium text-slate-700">Blog activo</label>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={async () => {
        if (!deleteId) return;
        setSaving(true);
        await blogController.delete(deleteId);
        setSaving(false);
        setDeleteModal(false);
        setDeleteId(null);
        load();
      }} title="Eliminar blog" description="Esta entrada del blog será eliminada permanentemente." confirmLabel="Eliminar" danger loading={saving} />
    </div>
  );
}
