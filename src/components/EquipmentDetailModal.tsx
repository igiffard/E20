import React, { useState } from 'react';
import { X, Building2, User, MapPin, Tag, Calendar, DollarSign, Copy, Check, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EquipmentItem, BuildingNomenclatureMap } from '../types';
import { getBuildingDisplayName } from '../data/metadata';

interface EquipmentDetailModalProps {
  item: EquipmentItem | null;
  onClose: () => void;
  customNames?: BuildingNomenclatureMap;
  isSelected?: boolean;
  onToggleSelect?: (item: EquipmentItem) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  item,
  onClose,
  customNames,
  isSelected = false,
  onToggleSelect,
}) => {
  const [copied, setCopied] = useState(false);

  const [copiedType, setCopiedType] = useState<'with' | 'without' | null>(null);

  if (!item) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const buildingName = getBuildingDisplayName(item.edificio, customNames);

  const handleCopyDetails = (includeAmount: boolean) => {
    const lines: string[] = [
      'FICHA DE CONTROL PATRIMONIAL - UABC FCM',
      '----------------------------------------',
      `No. Control: ${item.noControl}`,
      `No. Resguardo: ${item.noResguardo} (R. Interno: ${item.rInterno})`,
      `Descripción: ${item.descripcion}`,
      `Categoría: ${item.categoria}`,
      `Marca: ${item.marca}`,
      `Serie: ${item.serie || 'S/N'}`,
      `Edificio: ${item.edificio} - ${buildingName}`,
      `Ubicación Exacta: ${item.salaLaboratorio} (${item.nivel}) - Clave: ${item.ubicacionCode}`,
      `Profesor Responsable: ${item.profesor} (No. Empleado: ${item.noEmpleado})`,
      `Fecha Adquisición: ${item.fechaAdquisicion}`,
    ];

    if (includeAmount) {
      lines.push(`Orden de Compra: ${item.noOrdenCompra}`);
      lines.push(`Póliza Contable: ${item.noPoliza}`);
      lines.push(`Importe: ${formatCurrency(item.importe)}`);
    } else {
      lines.push('Importe: [Omitido en copia]');
    }

    lines.push('----------------------------------------');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setCopiedType(includeAmount ? 'with' : 'without');
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div
        id="equipment-modal-overlay"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        >
          {/* Encabezado de la Ficha */}
          <div className="bg-emerald-800 text-white p-5 sm:p-6 relative">
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Ficha Técnica de Resguardo Patrimonial · FCM UABC</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {item.descripcion}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-medium border border-white/20">
                {item.categoria}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 font-bold font-mono">
                {item.edificio} - {buildingName}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-emerald-100 font-mono">
                Clave Oficial: {item.ubicacionCode}
              </span>
            </div>
          </div>

          {/* Cuerpo de la Ficha */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Claves de Control Patrimonial */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Identificadores Oficiales de Inventario
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <span className="text-[11px] text-slate-400 block">No. de Control:</span>
                  <span className="text-sm font-bold text-slate-900 break-all">
                    {item.noControl}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">No. de Resguardo:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {item.noResguardo}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Resguardo Interno:</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {item.rInterno}
                  </span>
                </div>
              </div>
            </div>

            {/* Ubicación Exacta en el Campus */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Ubicación Física Exacta en la Facultad</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Edificio:</span>
                  <span className="font-bold text-slate-900">
                    {item.edificio} - {buildingName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Nivel / Piso:</span>
                  <span className="font-bold text-slate-900">
                    {item.nivel}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Laboratorio o Espacio Específico:</span>
                  <span className="font-bold text-emerald-800 text-base">
                    {item.salaLaboratorio}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Clave Oficial de Catálogo:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {item.ubicacionCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Investigador Responsable y Datos del Resguardo */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-700" />
                <span>Profesor / Investigador Resguardante</span>
              </h4>
              <div className="flex items-center justify-between bg-indigo-50/70 p-4 rounded-xl border border-indigo-200">
                <div>
                  <div className="font-extrabold text-base text-slate-900">
                    {item.profesor}
                  </div>
                  <div className="text-xs text-slate-600">
                    Facultad de Ciencias Marinas · UABC
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[11px] text-slate-500 block">No. de Empleado</span>
                  <span className="text-sm font-bold text-indigo-800">
                    #{item.noEmpleado}
                  </span>
                </div>
              </div>
            </div>

            {/* Ficha Técnica y Contable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Datos Técnicos */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Datos Técnicos
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500">Marca:</span>{' '}
                    <strong className="text-slate-900">{item.marca}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Número de Serie:</span>{' '}
                    <strong className="text-slate-900 font-mono">
                      {item.serie || 'S/N'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Datos Contables y Adquisición */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Datos Contables
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500">Fecha Adquisición:</span>{' '}
                    <strong className="text-slate-900">{item.fechaAdquisicion}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Orden de Compra:</span>{' '}
                    <strong className="text-slate-900 font-mono">{item.noOrdenCompra}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Póliza:</span>{' '}
                    <strong className="text-slate-900 font-mono">{item.noPoliza}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Importe Total de Adquisición */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-300 rounded-xl">
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Valor Histórico de Adquisición
                </span>
                <span className="text-xs text-emerald-700">
                  Registrado en control patrimonial FCM UABC
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-900 font-mono">
                {formatCurrency(item.importe)}
              </div>
            </div>
          </div>

          {/* Pie de Ficha con Acciones */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Botones de copia: Con Monto o Sin Monto */}
              <div className="inline-flex rounded-xl border border-slate-300 p-0.5 bg-slate-100 shadow-sm">
                <button
                  type="button"
                  id="copy-record-with-amount-btn"
                  onClick={() => handleCopyDetails(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied && copiedType === 'with'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-800 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                  title="Copiar ficha técnica completa incluyendo monto e información contable"
                >
                  {copied && copiedType === 'with' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>{copied && copiedType === 'with' ? '¡Copiada con Monto!' : 'Copiar con Monto ($)'}</span>
                </button>

                <button
                  type="button"
                  id="copy-record-without-amount-btn"
                  onClick={() => handleCopyDetails(false)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied && copiedType === 'without'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                  title="Copiar ficha técnica omitiendo datos financieros"
                >
                  {copied && copiedType === 'without' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{copied && copiedType === 'without' ? '¡Copiada sin Monto!' : 'Copiar sin Monto'}</span>
                </button>
              </div>

              {onToggleSelect && (
                <button
                  type="button"
                  onClick={() => onToggleSelect(item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-emerald-700" />
                      <span>Seleccionado</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>Seleccionar</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <button
              id="close-modal-footer-btn"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-sm"
            >
              Cerrar Ficha
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
