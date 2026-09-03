import React from 'react';
import { Share2, Compass, Building2 } from 'lucide-react';
import { SecurityAuth } from './SecurityAuth';

interface HeaderProps {
  onOpenEmbedGuide: () => void;
  onOpenNomenclature: () => void;
  isAuthenticated: boolean;
  onLogin: (token: string, role?: 'investigador' | 'auditor' | 'administrativo') => void;
  onLogout: () => void;
  totalItems: number;
  userRole?: 'investigador' | 'auditor' | 'administrativo';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmbedGuide,
  onOpenNomenclature,
  isAuthenticated,
  onLogin,
  onLogout,
  totalItems,
  userRole = 'administrativo',
}) => {
  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Identidad Institucional UABC FCM */}
          <div className="flex items-center gap-3">
            {/* Escudo / Icono Institucional */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-md border border-emerald-500/30 flex-shrink-0">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Control Patrimonial <span className="text-emerald-700">FCM UABC</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {totalItems} Equipos Activos
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Facultad de Ciencias Marinas · Inventario, Ubicación y Resguardatarios
              </p>
            </div>
          </div>

          {/* Acciones del Encabezado */}
          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
            {/* Personalizar Nomenclatura de Edificios */}
            <button
              id="open-nomenclature-btn"
              onClick={onOpenNomenclature}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-colors"
              title="Ajustar o personalizar los nombres de los edificios"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Nomenclatura Edificios</span>
            </button>

            {/* Modal de Integración / Google Sites */}
            <button
              id="open-google-sites-guide-btn"
              onClick={onOpenEmbedGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Obtener enlace y guía de publicación para Google Sites"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xs:inline">Google Sites / GitHub</span>
            </button>

            {/* Capa de Seguridad / Auth */}
            <SecurityAuth
              isAuthenticated={isAuthenticated}
              onLogin={onLogin}
              onLogout={onLogout}
              currentRole={userRole}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

