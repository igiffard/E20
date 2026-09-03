import React, { useState } from 'react';
import { Search, Filter, X, ArrowUpDown, LayoutGrid, Table as TableIcon, Download, RefreshCw, Users, Building2, Check, UserCheck, Plus } from 'lucide-react';
import { ALL_CATEGORIES } from '../data/allData';
import { BUILDINGS_INFO, PROFESSORS_INFO, getBuildingDisplayName } from '../data/metadata';
import { FilterState, BuildingNomenclatureMap } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
  viewMode: 'grid' | 'table';
  onToggleViewMode: (mode: 'grid' | 'table') => void;
  onExportCSV: () => void;
  customNames: BuildingNomenclatureMap;
  onSelectEquipmentByProfessor?: (profName: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  totalAll,
  viewMode,
  onToggleViewMode,
  onExportCSV,
  customNames,
  onSelectEquipmentByProfessor,
}) => {
  const [showProfessorsPanel, setShowProfessorsPanel] = useState(true);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.edificios.length > 0 ||
    filters.profesores.length > 0 ||
    filters.categoria !== 'ALL';

  const toggleProfessor = (profName: string) => {
    const current = [...filters.profesores];
    const index = current.indexOf(profName);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(profName);
    }
    onFilterChange({ profesores: current });
  };

  const handleSelectAllProfessors = () => {
    onFilterChange({ profesores: [] });
  };

  const handleClearProfessors = () => {
    onFilterChange({ profesores: [] });
  };

  return (
    <div
      id="filter-controls-container"
      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6"
    >
      {/* Fila 1: Barra de Búsqueda Rápida y Modos de Vista */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="main-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Buscar por descripción, No. control, No. resguardo, marca, serie, ubicación o profesor..."
            className="w-full pl-11 pr-10 py-3 text-sm sm:text-base rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controles de Vista y Exportación */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Alternar Grid / Tabla */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="view-mode-grid-btn"
              onClick={() => onToggleViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de Tarjetas Detalladas"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Tarjetas</span>
            </button>
            <button
              id="view-mode-table-btn"
              onClick={() => onToggleViewMode('table')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de Tabla Completa"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden md:inline">Tabla</span>
            </button>
          </div>

          {/* Exportar CSV */}
          <button
            id="export-csv-btn"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-colors"
            title="Exportar todos los resultados visibles a Excel / CSV"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Fila 2: Filtro Multi-Selección de Profesores / Investigadores */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Profesores / Investigadores Resguardatarios (Selección Múltiple)
            </span>
            {filters.profesores.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                {filters.profesores.length} seleccionados
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAllProfessors}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                filters.profesores.length === 0
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos los Profesores
            </button>
            {filters.profesores.length > 0 && (
              <button
                type="button"
                onClick={handleClearProfessors}
                className="text-slate-500 hover:text-slate-800"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Chips de Profesores con Toggle simultáneo */}
        <div className="flex flex-wrap gap-2 pt-1">
          {PROFESSORS_INFO.map((prof) => {
            const isSelected = filters.profesores.includes(prof.nombre);
            return (
              <div
                key={prof.nombre}
                className={`inline-flex items-center rounded-xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleProfessor(prof.nombre)}
                  className="px-3 py-1.5 text-xs font-semibold flex items-center gap-2"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span>{prof.nombre}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    (Emp. #{prof.noEmpleado})
                  </span>
                </button>

                {onSelectEquipmentByProfessor && (
                  <button
                    type="button"
                    onClick={() => onSelectEquipmentByProfessor(prof.nombre)}
                    className="px-2 py-1.5 border-l border-slate-200 hover:bg-indigo-600 hover:text-white text-slate-500 text-[11px] font-bold transition-colors"
                    title={`Seleccionar todos los equipos de ${prof.nombre} para correo`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fila 3: Categoría y Ordenamiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        {/* Filtro Categoría de Equipo */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Categoría de Equipo
          </label>
          <select
            id="filter-categoria-select"
            value={filters.categoria}
            onChange={(e) => onFilterChange({ categoria: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="ALL">Todas las Categorías de Equipos</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar Por */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Ordenar Resultados
          </label>
          <div className="flex gap-1.5">
            <select
              id="sort-by-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="importe">Mayor Importe ($ MXN)</option>
              <option value="descripcion">Por Descripción (A-Z)</option>
              <option value="fecha">Por Fecha Adquisición</option>
              <option value="edificio">Por Edificio</option>
            </select>
            <button
              type="button"
              id="sort-order-toggle-btn"
              onClick={() => onFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              title={`Orden: ${filters.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Resultados y Botón de Limpiar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            Mostrando <strong>{totalFiltered}</strong> de <strong>{totalAll}</strong> equipos
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              Filtro Activo
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer Todos los Filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
