"use client";
import { User, Mail, Phone, Shield } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function PerfilPage() {
  const [form, setForm] = useState({ displayName: "Administrador", email: "admin@farmacia.com", phoneNumber: "", currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-2xl">
      <PageHeader title="Mi perfil" description="Configuración de la cuenta administrador" />

      <div className="space-y-4">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800">{form.displayName}</p>
            <p className="text-sm text-slate-500">{form.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Shield size={12} className="text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">Administrador</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Información personal</h2>
          <div className="space-y-3">
            <Input label="Nombre completo" value={form.displayName} onChange={(e) => f("displayName", e.target.value)} leftIcon={<User size={14} />} />
            <Input label="Correo electrónico" type="email" value={form.email} onChange={(e) => f("email", e.target.value)} leftIcon={<Mail size={14} />} />
            <Input label="Teléfono" type="tel" value={form.phoneNumber} onChange={(e) => f("phoneNumber", e.target.value)} leftIcon={<Phone size={14} />} />
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Cambiar contraseña</h2>
          <div className="space-y-3">
            <Input label="Contraseña actual" type="password" value={form.currentPassword} onChange={(e) => f("currentPassword", e.target.value)} />
            <Input label="Nueva contraseña" type="password" value={form.newPassword} onChange={(e) => f("newPassword", e.target.value)} hint="Mínimo 8 caracteres" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button loading={saving} onClick={handleSave}>Guardar cambios</Button>
        </div>
      </div>
    </div>
  );
}
