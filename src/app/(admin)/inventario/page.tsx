"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Warehouse } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { EstadoBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input, { Select } from "@/components/ui/Input";
import { inventarioController } from "@/controllers/InventarioController";
import type { Inventario } from "@/models";

const SUCURSALES = [
  { value: "s1", label: "Sucursal Central" },
  { value: "s2", label: "Sucursal Norte" },
  { value: "s3", label: "Sucursal Sur" },
];

const EMPTY = { codInventario: "", stockSucursal: "", loteId: "", sucursalId: "", estado: true };

export default function InventarioPage() {
  const [data, setData] = useState<Inventario[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await inventarioController.getAllInventario({ page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (i: Inventario) => {
    setEditId(i.id);
    setForm({ codInventario: i.codInventario, stockSucursal: String(i.stockSucursal), loteId: i.loteId, sucursalId: i.sucursalId, estado: i.estado });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, stockSucursal: Number(form.stockSucursal) };
    if (editId) await inventarioController.updateInventario(editId, payload);
    else await inventarioController.createInventario(payload as Omit<Inventario, "id" | "createdAt" | "updatedAt">);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const f = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const getStockColor = (stock: number) => {
    if (stock <= 20) return "text-red-600 font-bold";
    if (stock <= 50) return "text-amber-600 font-semibold";
    return "text-emerald-600 font-semibold";
  };

  const columns: Column<Inventario>[] = [
    { key: "codInventario", header: "Código" },
    { key: "loteId", header: "Lote ref.", render: (i) => <span className="font-mono text-xs text-slate-600">{i.loteId}</span> },
    { key: "sucursalId", header: "Sucursal", render: (i) => SUCURSALES.find((s) => s.value === i.sucursalId)?.label ?? i.sucursalId },
    {
      key: "stockSucursal", header: "Stock",
      render: (i) => (
        <div>
          <span className={getStockColor(i.stockSucursal)}>{i.stockSucursal} uds.</span>
          <div className="mt-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${i.stockSucursal <= 20 ? "bg-red-400" : i.stockSucursal <= 50 ? "bg-amber-400" : "bg-emerald-400"}`}
              style={{ width: `${Math.min((i.stockSucursal / 200) * 100, 100)}%` }} />
          </div>
        </div>
      ),
    },
    { key: "estado", header: "Estado", render: (i) => <EstadoBadge estado={i.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "80px",
      render: (i) => (
        <button onClick={() => openEdit(i)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Pencil size={14} /></button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Inventario"
        description="Control de stock por sucursal"
        actions={<Button icon={<Plus size={14} />} onClick={openCreate}>Registrar inventario</Button>}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Stock total", value: `${inventarioController.getTotalStock()} uds.`, color: "text-blue-600" },
          { label: "Registros activos", value: data.filter((i) => i.estado).length, color: "text-emerald-600" },
          { label: "Stock bajo (<20)", value: data.filter((i) => i.stockSucursal <= 20).length, color: "text-red-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(i) => i.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Editar inventario" : "Registrar inventario"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>{editId ? "Guardar" : "Registrar"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Código de inventario" value={form.codInventario} onChange={(e) => f("codInventario", e.target.value)} required />
          <Input label="Stock" value={form.stockSucursal} onChange={(e) => f("stockSucursal", e.target.value)} type="number" min="0" required />
          <Input label="ID del lote" value={form.loteId} onChange={(e) => f("loteId", e.target.value)} required />
          <Select label="Sucursal" value={form.sucursalId} onChange={(e) => f("sucursalId", e.target.value)} options={SUCURSALES} placeholder="Seleccionar sucursal" required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="est-inv" checked={form.estado} onChange={(e) => f("estado", e.target.checked)} className="accent-blue-600" />
            <label htmlFor="est-inv" className="text-xs font-medium text-slate-700">Activo</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
