"use client";
import {
  Package, ShoppingCart, Users, CreditCard, TrendingUp,
  Clock, Send, CheckCircle, AlertCircle, Warehouse,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTHLY_SALES = [
  { mes: "Ene", ventas: 12400, pedidos: 48 },
  { mes: "Feb", ventas: 15800, pedidos: 63 },
  { mes: "Mar", ventas: 14200, pedidos: 57 },
  { mes: "Abr", ventas: 18900, pedidos: 74 },
  { mes: "May", ventas: 16500, pedidos: 66 },
  { mes: "Jun", ventas: 21000, pedidos: 82 },
];

const ORDER_STATUS_DATA = [
  { name: "Entregados", value: 58, color: "#10b981" },
  { name: "Enviados", value: 22, color: "#06b6d4" },
  { name: "Procesados", value: 12, color: "#f59e0b" },
  { name: "Entrantes", value: 8, color: "#3b82f6" },
];

const RECENT_ORDERS = [
  { cod: "PED-005", cliente: "Ana Torres", total: 120.0, estado: "entrante", fecha: "14/03/2024" },
  { cod: "PED-004", cliente: "Juan Ríos", total: 15.0, estado: "entrante", fecha: "12/03/2024" },
  { cod: "PED-003", cliente: "Luis Méndez", total: 92.0, estado: "procesado", fecha: "10/03/2024" },
  { cod: "PED-002", cliente: "María García", total: 28.5, estado: "enviado", fecha: "05/03/2024" },
  { cod: "PED-001", cliente: "Juan Ríos", total: 45.0, estado: "entregado", fecha: "01/03/2024" },
];

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  entrante: { label: "Entrante", className: "bg-blue-100 text-blue-700" },
  procesado: { label: "Procesado", className: "bg-amber-100 text-amber-700" },
  enviado: { label: "Enviado", className: "bg-cyan-100 text-cyan-700" },
  entregado: { label: "Entregado", className: "bg-emerald-100 text-emerald-700" },
};

const LOW_STOCK = [
  { nombre: "Amoxicilina 500mg", stock: 12, lote: "LOT-2024-003" },
  { nombre: "Ibuprofeno 400mg", stock: 18, lote: "LOT-2024-002" },
  { nombre: "Loratadina 10mg", stock: 5, lote: "LOT-2024-005" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumen general del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Productos activos" value="142" icon={<Package size={22} />} color="blue" change={8} changeLabel="este mes" />
        <StatCard title="Pedidos hoy" value="14" icon={<ShoppingCart size={22} />} color="emerald" change={12} changeLabel="vs ayer" />
        <StatCard title="Clientes registrados" value="5" icon={<Users size={22} />} color="violet" change={3} changeLabel="este mes" />
        <StatCard title="Ventas del mes" value={formatCurrency(21000)} icon={<TrendingUp size={22} />} color="amber" change={27} changeLabel="vs mes ant." />
      </div>

      {/* Order status counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Entrantes", count: 2, icon: Clock, color: "text-blue-500", bg: "bg-blue-50 border-blue-200" },
          { label: "Procesados", count: 1, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
          { label: "Enviados", count: 1, icon: Send, color: "text-cyan-500", bg: "bg-cyan-50 border-cyan-200" },
          { label: "Entregados", count: 1, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-xl border ${bg}`}>
            <Icon size={22} className={color} />
            <div>
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Ventas mensuales (S/.)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_SALES} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/.${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} labelStyle={{ color: "#334155" }} />
              <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Estado de pedidos</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ORDER_STATUS_DATA} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {ORDER_STATUS_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Pedidos recientes</h2>
            <a href="/pedidos" className="text-xs text-blue-600 hover:underline font-medium">Ver todos</a>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_ORDERS.map((o) => {
              const s = STATUS_STYLE[o.estado];
              return (
                <div key={o.cod} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{o.cod}</p>
                    <p className="text-xs text-slate-500">{o.cliente} · {o.fecha}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">{formatCurrency(o.total)}</span>
                    <span className={`badge ${s.className}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Warehouse size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-slate-700">Stock bajo</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {LOW_STOCK.map((item) => (
              <div key={item.lote} className="px-5 py-3">
                <p className="text-xs font-medium text-slate-700 truncate">{item.nombre}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-400">{item.lote}</p>
                  <span className="badge bg-red-100 text-red-700">{item.stock} uds.</span>
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{ width: `${Math.min((item.stock / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="px-5 py-3">
              <a href="/inventario" className="text-xs text-blue-600 hover:underline font-medium">
                Ver inventario completo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
