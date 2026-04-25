"use client";
import { create } from "zustand";
import type { Usuario, DetallePedidoTemporal } from "@/models";

interface AppState {
  // Auth
  currentUser: Usuario | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: Usuario | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  incrementNotifications: () => void;

  // Cart (temporary order details)
  cart: DetallePedidoTemporal[];
  addToCart: (item: DetallePedidoTemporal) => void;
  removeFromCart: (codigoDetalle: string) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // Page name
  currentPage: string;
  setCurrentPage: (name: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (user) =>
    set({ currentUser: user, isAuthenticated: user !== null }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Notifications
  notificationCount: 3,
  setNotificationCount: (count) => set({ notificationCount: count }),
  incrementNotifications: () =>
    set((state) => ({ notificationCount: state.notificationCount + 1 })),

  // Cart
  cart: [],
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart.filter((c) => c.codigoDetalle !== item.codigoDetalle), item],
    })),
  removeFromCart: (codigoDetalle) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.codigoDetalle !== codigoDetalle),
    })),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((acc, item) => acc + item.subtotal, 0),

  // Page name
  currentPage: "Dashboard",
  setCurrentPage: (name) => set({ currentPage: name }),
}));
