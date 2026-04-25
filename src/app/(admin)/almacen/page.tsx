"use client";
import { Warehouse, Package, AlertTriangle, CheckCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { ExpirationBadge } from "@/components/ui/Badge";
import { getDaysUntilExpiration, formatDate, formatCurrency } from "@/lib/utils";

const WAREHOUSE_DATA = [
  {
    sucursal: "Sucursal Central", codigo: "S001",
    productos: [
      { nombre: "Paracetamol 500mg", lote: "LOT-2024-001", stock: 120, vencimiento: new Date("2026-01-01"), precio: 0.5 },
      { nombre: "Ibuprofeno 400mg", lote: "LOT-2024-002", stock: 18, vencimiento: new Date("2024-07-15"), precio: 0.8 },
      { nombre: "Omeprazol 20mg", lote: "LOT-2024-004", stock: 200, vencimiento: new Date("2026-02-20"), precio: 0.6 },
    ],
  },
  {
    sucursal: "Sucursal Norte", codigo: "S002",
    productos: [
      { nombre: "Amoxicilina 500mg", lote: "LOT-2024-003", stock: 45, vencimiento: new Date("2024-05-01"), precio: 1.2 },
      { nombre: "Loratadina 10mg", lote: "LOT-2024-005", stock: 5, vencimiento: new Date("2025-08-01"), precio: 0.4 },
    ],
  },
];

export default function AlmacenPage() {
  const totalStock = WAREHOUSE_DATA.flatMap((s) => s.productos).reduce((acc, p) => acc + p.stock, 0);
  const criticalItems = WAREHOUSE_DATA.flatMap((s) => s.productos).filter((p) => getDaysUntilExpiration(p.vencimiento) <= 90);
  const lowStockItems = WAREHOUSE_DATA.flatMap((s) => s.productos).filter((p) => p.stock <= 20);

  return (
    <div>
      <PageHeader title="Almacén" description="Vista general del almacén por sucursal" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Warehouse size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Stock total</p>
            <p className="text-xl font-bold text-slate-800">{totalStock} uds.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Próx. vencer (&lt;90d)</p>
            <p className="text-xl font-bold text-red-600">{criticalItems.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Package size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Stock bajo (&lt;20)</p>
            <p className="text-xl font-bold text-amber-600">{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      {/* By branch */}
      <div className="space-y-4">
        {WAREHOUSE_DATA.map((sucursal) => (
          <div key={sucursal.codigo} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Warehouse size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{sucursal.sucursal}</p>
                <p className="text-xs text-slate-500">Código: {sucursal.codigo}</p>
              </div>
              <div className="ml-auto">
                <span className="text-sm font-bold text-blue-600">
                  {sucursal.productos.reduce((acc, p) => acc + p.stock, 0)} uds.
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Producto</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Lote</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Stock</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Vencimiento</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">P. Venta</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sucursal.productos.map((p, i) => {
                    const days = getDaysUntilExpiration(p.vencimiento);
                    return (
                      <tr key={i} className={`hover:bg-slate-50/60 ${days <= 90 ? "bg-red-50/30" : ""}`}>
                        <td className="px-4 py-3 font-medium text-slate-800">{p.nombre}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.lote}</td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${p.stock <= 20 ? "text-red-600" : p.stock <= 50 ? "text-amber-600" : "text-emerald-600"}`}>
                            {p.stock} uds.
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">{formatDate(p.vencimiento)}</td>
                        <td className="px-4 py-3 text-slate-700">{formatCurrency(p.precio)}</td>
                        <td className="px-4 py-3"><ExpirationBadge days={days} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
