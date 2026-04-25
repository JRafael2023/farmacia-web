"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, FlaskConical, Warehouse,
  ShoppingCart, Users, CreditCard, FileText, Percent, Bell,
  ChevronDown, ChevronRight, X, Boxes, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

const ICON_MAP = {
  LayoutDashboard, Package, Tag, FlaskConical, Warehouse,
  ShoppingCart, Users, CreditCard, FileText, Percent, Bell,
  Boxes, ClipboardList,
};

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof ICON_MAP;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Productos", href: "/productos", icon: "Package" },
  { label: "Categorías", href: "/categorias", icon: "Tag" },
  { label: "Laboratorios", href: "/laboratorios", icon: "FlaskConical" },
  {
    label: "Inventario", href: "/inventario", icon: "Warehouse",
    children: [
      { label: "Stock", href: "/inventario" },
      { label: "Lotes", href: "/lotes" },
      { label: "Almacén", href: "/almacen" },
    ],
  },
  {
    label: "Pedidos", href: "/pedidos", icon: "ShoppingCart",
    children: [
      { label: "Todos", href: "/pedidos" },
      { label: "Entrantes", href: "/pedidos/entrantes" },
      { label: "Procesados", href: "/pedidos/procesados" },
      { label: "Enviados", href: "/pedidos/enviados" },
      { label: "Entregados", href: "/pedidos/entregados" },
    ],
  },
  { label: "Clientes", href: "/clientes", icon: "Users" },
  {
    label: "Créditos", href: "/creditos", icon: "CreditCard",
    children: [
      { label: "Activos", href: "/creditos" },
      { label: "Solicitudes", href: "/creditos/solicitudes" },
    ],
  },
  { label: "Blogs", href: "/blogs", icon: "FileText" },
  { label: "Promociones", href: "/promociones", icon: "Percent" },
  { label: "Notificaciones", href: "/notificaciones", icon: "Bell" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const [openGroups, setOpenGroups] = useState<string[]>(["Inventario", "Pedidos", "Créditos"]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    pathname === item.href || item.children?.some((c) => pathname === c.href);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-slate-900 text-white z-30 flex flex-col transition-sidebar",
          sidebarOpen ? "w-64" : "w-0 lg:w-16 overflow-hidden"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/60 shrink-0">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "lg:justify-center lg:w-full")}>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <Package size={18} className="text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-sm tracking-wide truncate">FarmaciaAdmin</span>
            )}
          </div>
          {sidebarOpen && (
            <button
              className="lg:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const hasChildren = !!item.children?.length;
            const isOpen = openGroups.includes(item.label);
            const groupActive = isGroupActive(item);

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      groupActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Icon size={18} className="shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </>
                    )}
                  </button>
                  {sidebarOpen && isOpen && (
                    <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block py-1.5 px-2 rounded text-xs transition-colors",
                            isActive(child.href)
                              ? "text-blue-400 bg-blue-600/10 font-medium"
                              : "text-slate-400 hover:text-white"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom version */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-slate-700/60 shrink-0">
            <p className="text-xs text-slate-500">v1.0.0 — FarmaciaAdmin</p>
          </div>
        )}
      </aside>
    </>
  );
}
