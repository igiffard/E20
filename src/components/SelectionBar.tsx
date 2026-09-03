import React, { useState } from 'react';
import { CheckSquare, Square, Mail, Copy, Check, Download, X, DollarSign } from 'lucide-react';
import { EquipmentItem } from '../types';

interface SelectionBarProps {
  selectedCount: number;
  totalFiltered: number;
  selectedImporte: number;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
  onOpenEmailModal: () => void;
  onQuickCopyEmail: (includeAmounts: boolean) => void;
  onExportSelectedCSV: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  totalFiltered,
  selectedImporte,
  onSelectAllFiltered,
  onClearSelection,
  onOpenEmailModal,
  onQuickCopyEmail,
  onExportSelectedCSV,
}) => {
  const [copiedWith, setCopiedWith] = useState(false);
  const [copiedWithout, setCopiedWithout] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleQuickCopy = (withAmount: boolean) => {
    onQuickCopyEmail(withAmount);
    if (withAmount) {
      setCopiedWith(true);
      setTimeout(() => setCopiedWith(false), 2000);
    } else {
      setCopiedWithout(true);
      setTimeout(() => setCopiedWithout(false), 2000);
    }
  };

  const isAllSelected = totalFiltered > 0 && selectedCount === totalFiltered;

  return (
    <div
      id="equipment-selection-bar"
      className="sticky bottom-4 z-40 bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3 transition-all duration-300 backdrop-blur-md"
    >
      {/* Información de selección y Monto Dinámico */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 w-full md:w-auto justify-between md:justify-start">
        {/* Checkbox Maestro Seleccionar Todos */}
        <button
          type="button"
          id="btn-toggle-select-all"
          onClick={isAllSelected ? onClearSelection : onSelectAllFiltered}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-600 transition-colors"
        >
          {isAllSelected ? (
            <>
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Deseleccionar todos ({totalFiltered})</span>
            </>
          ) : (
            <>
              <Square className="w-4 h-4 text-slate-400" />
              <span>Seleccionar todos visibles ({totalFiltered})</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-100">
              {selectedCount} {selectedCount === 1 ? 'equipo seleccionado' : 'equipos seleccionados'}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          {/* Monto de Inversión Seleccionada */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-black">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Inversión: {formatCurrency(selectedImporte)} MXN</span>
          </div>
        </div>
      </div>

      {/* Botonera de Acciones: Opciones de copia con/sin monto, Correo, CSV y Limpiar */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        {/* Selector dual de Copia: Con Monto o Sin Monto */}
        <div className="inline-flex rounded-xl bg-slate-800 border border-slate-700 p-0.5 shadow-sm">
          <button
            type="button"
            id="btn-quick-copy-with-amount"
            onClick={() => handleQuickCopy(true)}
            disabled={selectedCount === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCount === 0
                ? 'text-slate-600 cursor-not-allowed'
                : copiedWith
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
            title="Copiar lista para correo incluyendo los importes monetarios ($)"
          >
            {copiedWith ? <Check className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
            <span>{copiedWith ? '¡Copiado con Monto!' : 'Copiar con Monto ($)'}</span>
          </button>

          <button
            type="button"
            id="btn-quick-copy-without-amount"
            onClick={() => handleQuickCopy(false)}
            disabled={selectedCount === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCount === 0
                ? 'text-slate-600 cursor-not-allowed'
                : copiedWithout
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Copiar lista para correo omitiendo los importes monetarios"
          >
            {copiedWithout ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWithout ? '¡Copiado sin Monto!' : 'Copiar sin Monto'}</span>
          </button>
        </div>

        {/* Botón Ver y Configurar Formato de Correo */}
        <button
          type="button"
          id="btn-open-email-preview"
          onClick={onOpenEmailModal}
          disabled={selectedCount === 0}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
            selectedCount > 0
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
              : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
          }`}
          title="Ver formato, opciones de tabla y vista previa de correo"
        >
          <Mail className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Vista Previa Correo</span>
        </button>

        {/* Botón Exportar CSV de Seleccionados */}
        <button
          type="button"
          onClick={onExportSelectedCSV}
          disabled={selectedCount === 0}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
            selectedCount > 0
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
              : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
          }`}
          title="Exportar sólo los equipos seleccionados a CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Exportar CSV</span>
        </button>

        {/* Botón Deseleccionar */}
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onClearSelection}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Deseleccionar todo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
