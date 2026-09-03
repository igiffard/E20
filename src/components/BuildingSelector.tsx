import React from 'react';
import { Building2, CheckSquare, Square, Plus, Check, Edit3 } from 'lucide-react';
import { BUILDINGS_INFO, getBuildingDisplayName } from '../data/metadata';
import { BuildingNomenclatureMap } from '../types';

interface BuildingSelectorProps {
  selectedBuildings: string[];
  onToggleBuilding: (buildingCode: string) => void;
  onSelectAllBuildings: () => void;
  onClearBuildings: () => void;
  buildingCounts: Record<string, number>;
  totalCount: number;
  customNames: BuildingNomenclatureMap;
  onOpenNomenclature: () => void;
  onSelectEquipmentByBuilding?: (buildingCode: string) => void;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({
  selectedBuildings,
  onToggleBuilding,
  onSelectAllBuildings,
  onClearBuildings,
  buildingCounts,
  totalCount,
  customNames,
  onOpenNomenclature,
  onSelectEquipmentByBuilding,
}) => {
  const isAll = selectedBuildings.length === 0 || selectedBuildings.length === BUILDINGS_INFO.length;

  return (
    <div id="building-multi-selector" className="mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Filtro de Edificios (Selección Múltiple Simultánea)
          </h2>
          {selectedBuildings.length > 0 && selectedBuildings.length < BUILDINGS_INFO.length && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {selectedBuildings.length} seleccionados
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onSelectAllBuildings}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              isAll
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            Todos
          </button>
          {selectedBuildings.length > 0 && (
            <button
              type="button"
              onClick={onClearBuildings}
              className="px-2.5 py-1 rounded-lg font-semibold bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300"
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={onOpenNomenclature}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
            title="Cambiar nombres de edificios según su nomenclatura"
          >
            <Edit3 className="w-3 h-3 text-amber-700" />
            <span>Editar Nomenclatura</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Haga clic en uno o varios edificios para ver sus equipos combinados. Use el botón "+ Equipos" para seleccionar todos los bienes de ese edificio y copiarlos a un correo.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {BUILDINGS_INFO.map((b) => {
          const isSelected = selectedBuildings.includes(b.codigo);
          const count = buildingCounts[b.codigo] || 0;
          const displayName = getBuildingDisplayName(b.codigo, customNames);

          return (
            <div
              key={b.id}
              className={`relative rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {/* Botón principal de selección del edificio */}
              <button
                type="button"
                id={`btn-toggle-building-${b.id}`}
                onClick={() => onToggleBuilding(b.codigo)}
                className="w-full text-left p-3 flex flex-col justify-between flex-1"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-mono font-bold text-slate-800 tracking-tight">
                    {b.codigo}
                  </span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>

                <div className="my-1">
                  <div className="text-xl font-black text-slate-900">{count}</div>
                  <div className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug min-h-[2rem]" title={displayName}>
                    {displayName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Claves: {b.id}XXXXX
                  </div>
                </div>
              </button>

              {/* Botón rápido para seleccionar equipos de este edificio */}
              {onSelectEquipmentByBuilding && count > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectEquipmentByBuilding(b.codigo)}
                  className="w-full py-1.5 px-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-[11px] font-bold border-t border-slate-200 transition-colors flex items-center justify-center gap-1"
                  title={`Seleccionar los ${count} equipos de ${b.codigo} para correo o exportación`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Seleccionar {count} equipos</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
