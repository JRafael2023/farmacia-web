"use client";
import { useState, useEffect, useCallback } from "react";
import { ToggleLeft, ToggleRight, Mail, Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable, Pagination, Column } from "@/components/ui/DataTable";
import { EstadoBadge } from "@/components/ui/Badge";
import { clienteController } from "@/controllers/ClienteController";
import type { Usuario } from "@/models";
import { formatDate } from "@/lib/utils";

export default function ClientesPage() {
  const [data, setData] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await clienteController.getAll({ search, page, pageSize: 10 });
    setData(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (u: Usuario) => {
    await clienteController.toggleEstado(u.id, !u.estado);
    load();
  };

  const columns: Column<Usuario>[] = [
    {
      key: "displayName", header: "Cliente",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-blue-600">{u.displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm">{u.displayName}</p>
            <p className="text-xs text-slate-400">ID: {u.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email", header: "Contacto",
      render: (u) => (
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Mail size={11} className="text-slate-400" />
            {u.email}
          </div>
          {u.phoneNumber && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <Phone size={11} />
              {u.phoneNumber}
            </div>
          )}
        </div>
      ),
    },
    { key: "createdAt", header: "Registrado", render: (u) => formatDate(u.createdAt) },
    { key: "estado", header: "Estado", render: (u) => <EstadoBadge estado={u.estado} /> },
    {
      key: "acciones", header: "Acciones", width: "80px",
      render: (u) => (
        <button onClick={() => handleToggle(u)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Cambiar estado">
          {u.estado ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Clientes" description={`${clienteController.getTotal()} clientes registrados`} />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por nombre, email, teléfono..." className="max-w-sm" />
      </div>
      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(u) => u.id} />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={10} onPageChange={setPage} />
    </div>
  );
}
