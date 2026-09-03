import React from 'react';
import { Building2, User, MapPin, Tag, CheckSquare, Square, ChevronRight, Hash } from 'lucide-react';
import { EquipmentItem, BuildingNomenclatureMap } from '../types';
import { getBuildingDisplayName } from '../data/metadata';

interface EquipmentCardProps {
  item: EquipmentItem;
  onSelect: (item: EquipmentItem) => void;
  isSelected?: boolean;
  onToggleSelect?: (item: EquipmentItem, e: React.MouseEvent) => void;
  customNames?: BuildingNomenclatureMap;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  item,
  onSelect,
  isSelected = false,
  onToggleSelect,
  customNames,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Laboratorio e Instrumentación Analítica':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Filtración y Tratamiento de Agua':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      case 'Bombas y Fluidos':
        return 'bg-cyan-100 text-cyan-900 border-cyan-200';
      case 'Climatización y Temperatura':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Tanques y Contenedores':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Potencia y Suministro Eléctrico':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Refrigeración y Almacén Frío':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'Bioseguridad y Mobiliario Especial':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'Cómputo, Redes y Ofimática':
        return 'bg-slate-100 text-slate-900 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const buildingName = getBuildingDisplayName(item.edificio, customNames);

  return (
    <div
      id={`equipment-card-${item.id}`}
      onClick={() => onSelect(item)}
      className={`group rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
          : 'bg-white border-slate-200 hover:shadow-lg hover:border-slate-300'
      }`}
    >
      <div>
        {/* Cabecera de la Tarjeta: Checkbox + Categoría + Edificio */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Checkbox de Selección para Correo */}
            {onToggleSelect && (
              <button
                type="button"
                id={`card-check-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(item, e);
                }}
                className={`p-1 rounded-lg border transition-colors flex items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
                }`}
                title={isSelected ? 'Deseleccionar equipo' : 'Seleccionar para copiar en correo'}
              >
                {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </button>
            )}

            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border ${getCategoryBadgeColor(item.categoria)}`}>
              {item.categoria}
            </span>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold font-mono border border-slate-200"
            title={`${item.edificio} - ${buildingName}`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{item.edificio}</span>
          </div>
        </div>

        {/* Descripción Principal del Equipo - Tamaño de letra suficiente */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors mb-3">
          {item.descripcion}
        </h3>

        {/* Detalles Técnicos Clave */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4">
          {/* Ubicación Exacta con Edificio y Clave */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">
                {buildingName}:
              </span>{' '}
              <span className="text-slate-700">
                {item.salaLaboratorio} ({item.nivel})
              </span>
              <div className="text-[11px] text-slate-500 font-mono">
                Clave Ubicación: <strong className="text-slate-700">{item.ubicacionCode}</strong>
              </div>
            </div>
          </div>

          {/* Profesor Responsable */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-700 flex-shrink-0" />
            <div>
              <span className="text-slate-500">Profesor:</span>{' '}
              <span className="font-bold text-slate-900">
                {item.profesor}
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5 font-mono">
                (Emp. #{item.noEmpleado})
              </span>
            </div>
          </div>

          {/* Marca y Serie */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <div>
              <span className="text-slate-500">Marca:</span>{' '}
              <span className="font-semibold text-slate-800">
                {item.marca}
              </span>
              {item.serie && item.serie !== 'S/N' && (
                <span className="text-slate-500 ml-2 font-mono">
                  S/N: {item.serie}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pie de Tarjeta: Números de Control, Importe e Interacción */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
        <div>
          <div className="text-[11px] font-mono text-slate-500">
            Control: <strong className="text-slate-800">{item.noControl}</strong>
          </div>
          <div className="text-base font-black text-slate-900">
            {formatCurrency(item.importe)}
          </div>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
          <span>Ver Ficha</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
