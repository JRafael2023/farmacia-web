"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Package } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { EstadoBadge } from "@/components/ui/Badge";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input, { Select, Textarea } from "@/components/ui/Input";
import { productoController } from "@/controllers/ProductoController";
import { categoriaController } from "@/controllers/CategoriaController";
import { laboratorioController } from "@/controllers/LaboratorioController";
import type { Producto, Categoria, Laboratorio } from "@/models";
import { formatCurrency } from "@/lib/utils";

const EMPTY_FORM = {
  codigo: "", codigoBarras: "", nombre: "", descripcion: "", marca: "",
  unidad: "", precio: "", precioCompra: "", precioVenta: "", descuento: "0",
  categoriaId: "", laboratorioId: "", estado: true,
};

export default function ProductosPage() {
  const [data, setData] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await productoController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    categoriaController.getActivas().then(setCategorias);
    laboratorioController.getActivos().then(setLaboratorios);
  }, []);

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p: Producto) => {
    setEditId(p.id);
    setForm({
      codigo: p.codigo, codigoBarras: String(p.codigoBarras ?? ""), nombre: p.nombre,
      descripcion: p.descripcion, marca: p.marca, unidad: p.unidad,
      precio: String(p.precio), precioCompra: String(p.precioCompra),
      precioVenta: String(p.precioVenta), descuento: String(p.descuento),
      categoriaId: p.categoriaId, laboratorioId: p.laboratorioId ?? "", estado: p.estado,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      codigoBarras: form.codigoBarras ? Number(form.codigoBarras) : undefined,
      precio: Number(form.precio),
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
      descuento: Number(form.descuento),
    };
    if (editId) {
      await productoController.update(editId, payload);
    } else {
      await productoController.create(payload as Omit<Producto, "id" | "createdAt" | "updatedAt">);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    await productoController.delete(deleteId);
    setSaving(false);
    setDeleteModal(false);
    setDeleteId(null);
    load();
  };

  const handleToggle = async (p: Producto) => {
    await productoController.toggleEstado(p.id, !p.estado);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<Producto>[] = [
    { key: "codigo", header: "Código", width: "100px" },
    {
      key: "nombre", header: "Producto",
      render: (p) => (
        <div>
          <p className="font-medium text-slate-800">{p.nombre}</p>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">{p.descripcion}</p>
        </div>
      ),
    },
    { key: "marca", header: "Marca" },
    { key: "unidad", header: "Unidad", width: "80px" },
    { key: "precioVenta", header: "Precio venta", render: (p) => formatCurrency(p.precioVenta) },
    { key: "descuento", header: "Descuento", render: (p) => `${p.descuento}%` },
    { key: "estado", header: "Estado", render: (p) => <EstadoBadge estado={p.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "120px",
      render: (p) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Editar">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleToggle(p)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Cambiar estado">
            {p.estado ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
          </button>
          <button onClick={() => { setDeleteId(p.id); setDeleteModal(true); }} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600" title="Eliminar">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Gestión del catálogo de productos"
        actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Nuevo producto</Button>}
      />

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Buscar por nombre, código, marca..."
          className="max-w-sm"
        />
      </div>

      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(p) => p.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Editar producto" : "Nuevo producto"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar cambios" : "Crear producto"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Input label="Código" value={form.codigo} onChange={(e) => f("codigo", e.target.value)} required />
          <Input label="Código de barras" value={form.codigoBarras} onChange={(e) => f("codigoBarras", e.target.value)} type="number" />
          <Input label="Nombre" value={form.nombre} onChange={(e) => f("nombre", e.target.value)} required className="col-span-2" />
          <Input label="Marca" value={form.marca} onChange={(e) => f("marca", e.target.value)} />
          <Input label="Unidad" value={form.unidad} onChange={(e) => f("unidad", e.target.value)} placeholder="Tableta, Cápsula..." />
          <Textarea label="Descripción" value={form.descripcion} onChange={(e) => f("descripcion", e.target.value)} rows={2} className="col-span-2" />
          <Input label="Precio" value={form.precio} onChange={(e) => f("precio", e.target.value)} type="number" step="0.01" required />
          <Input label="Precio compra" value={form.precioCompra} onChange={(e) => f("precioCompra", e.target.value)} type="number" step="0.01" />
          <Input label="Precio venta" value={form.precioVenta} onChange={(e) => f("precioVenta", e.target.value)} type="number" step="0.01" />
          <Input label="Descuento (%)" value={form.descuento} onChange={(e) => f("descuento", e.target.value)} type="number" min="0" max="100" />
          <Select
            label="Categoría"
            value={form.categoriaId}
            onChange={(e) => f("categoriaId", e.target.value)}
            options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
            placeholder="Seleccionar categoría"
            required
          />
          <Select
            label="Laboratorio"
            value={form.laboratorioId}
            onChange={(e) => f("laboratorioId", e.target.value)}
            options={laboratorios.map((l) => ({ value: l.id, label: l.nombre }))}
            placeholder="Seleccionar laboratorio"
          />
          <div className="col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="estado-prod"
              checked={form.estado}
              onChange={(e) => f("estado", e.target.checked)}
              className="accent-blue-600"
            />
            <label htmlFor="estado-prod" className="text-xs font-medium text-slate-700">Producto activo</label>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        description="Esta acción es irreversible. El producto será eliminado permanentemente."
        confirmLabel="Eliminar"
        danger
        loading={saving}
      />
    </div>
  );
}
