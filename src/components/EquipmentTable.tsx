import React from 'react';
import { Building2, User, MapPin, ExternalLink, CheckSquare, Square } from 'lucide-react';
import { EquipmentItem, BuildingNomenclatureMap } from '../types';
import { getBuildingDisplayName } from '../data/metadata';

interface EquipmentTableProps {
  items: EquipmentItem[];
  onSelect: (item: EquipmentItem) => void;
  selectedIds: Set<string>;
  onToggleSelect: (item: EquipmentItem) => void;
  onSelectAllFiltered?: () => void;
  onClearSelection?: () => void;
  customNames?: BuildingNomenclatureMap;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  items,
  onSelect,
  selectedIds,
  onToggleSelect,
  onSelectAllFiltered,
  onClearSelection,
  customNames,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isAllSelected = items.length > 0 && items.every((it) => selectedIds.has(it.id));
  const someSelected = items.some((it) => selectedIds.has(it.id));

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium">
          No se encontraron equipos que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div
      id="equipment-table-container"
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              {/* Checkbox Maestro */}
              <th className="py-3.5 px-3 text-center w-12">
                <button
                  type="button"
                  onClick={isAllSelected ? onClearSelection : onSelectAllFiltered}
                  className="p-1 rounded border border-slate-300 bg-white hover:border-slate-400 text-slate-600 transition-colors"
                  title={isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos los visibles'}
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="py-3.5 px-4">No. Control / Resguardo</th>
              <th className="py-3.5 px-4">Descripción del Equipo</th>
              <th className="py-3.5 px-4">Marca / Serie</th>
              <th className="py-3.5 px-4">Edificio y Ubicación Exacta</th>
              <th className="py-3.5 px-4">Profesor Responsable</th>
              <th className="py-3.5 px-4 text-right">Importe (MXN)</th>
              <th className="py-3.5 px-3 text-center">Ficha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const buildingName = getBuildingDisplayName(item.edificio, customNames);

              return (
                <tr
                  key={item.id}
                  id={`table-row-${item.id}`}
                  onClick={() => onSelect(item)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected ? 'bg-emerald-50/70 hover:bg-emerald-100/70' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Checkbox de fila */}
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(item);
                    }}
                  >
                    <button
                      type="button"
                      className={`p-1 rounded border transition-colors flex items-center justify-center mx-auto ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
                      }`}
                      title={isSelected ? 'Deseleccionar' : 'Seleccionar para correo'}
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* No. Control y Resguardo */}
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-900">
                      {item.noControl}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Resg: {item.noResguardo} · Int: {item.rInterno}
                    </div>
                  </td>

                  {/* Descripción */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 group-hover:text-emerald-700 line-clamp-2">
                      {item.descripcion}
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {item.categoria}
                    </span>
                  </td>

                  {/* Marca / Serie */}
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-semibold text-slate-800">{item.marca}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {item.serie && item.serie !== 'S/N' ? `S/N: ${item.serie}` : 'Sin serie reg.'}
                    </div>
                  </td>

                  {/* Edificio y Ubicación */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item.edificio} - {buildingName}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {item.salaLaboratorio} ({item.nivel})
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Clave: {item.ubicacionCode}
                    </div>
                  </td>

                  {/* Profesor */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">
                      {item.profesor}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      No. Emp: {item.noEmpleado}
                    </div>
                  </td>

                  {/* Importe */}
                  <td className="py-3 px-4 text-right font-mono">
                    <div className="font-black text-slate-900 text-sm">
                      {formatCurrency(item.importe)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Póliza: {item.noPoliza || 'S/P'}
                    </div>
                  </td>

                  {/* Botón Acción */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                      title="Ver detalles completos"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
