import React, { useState, useEffect, useMemo } from 'react';
import { ALL_EQUIPMENT_ITEMS, calculateDashboardStats } from './data/allData';
import { getStoredBuildingNomenclature, saveStoredBuildingNomenclature, getBuildingDisplayName } from './data/metadata';
import { EquipmentItem, FilterState, BuildingNomenclatureMap } from './types';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { BuildingSelector } from './components/BuildingSelector';
import { FilterBar } from './components/FilterBar';
import { EquipmentCard } from './components/EquipmentCard';
import { EquipmentTable } from './components/EquipmentTable';
import { EquipmentDetailModal } from './components/EquipmentDetailModal';
import { GoogleSitesModal } from './components/GoogleSitesModal';
import { BuildingNomenclatureModal } from './components/BuildingNomenclatureModal';
import { EmailExportModal } from './components/EmailExportModal';
import { SelectionBar } from './components/SelectionBar';
import { Lock, ShieldAlert, ChevronDown, RefreshCw } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  edificios: [], // Vacío = todos los edificios
  profesores: [], // Vacío = todos los profesores
  categoria: 'ALL',
  sortBy: 'importe',
  sortOrder: 'desc',
};

const ITEMS_PER_PAGE = 24;

export default function App() {
  // Capa de autenticación y seguridad
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('fcm_patrimonio_auth') === 'true';
  });
  const [authToken, setAuthToken] = useState<string>(() => {
    return sessionStorage.getItem('fcm_patrimonio_token') || '';
  });

  // Nomenclatura personalizada de edificios (almacenada en localStorage)
  const [customBuildingNames, setCustomBuildingNames] = useState<BuildingNomenclatureMap>(() => {
    return getStoredBuildingNomenclature();
  });

  // Filtros y modo de vista
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Equipos seleccionados para copia en correo / acciones masivas
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modales
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [showEmbedGuide, setShowEmbedGuide] = useState<boolean>(false);
  const [showNomenclatureModal, setShowNomenclatureModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Modo Blanco Forzado: Eliminar modo oscuro permanentemente conforme a requerimiento
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('fcm_theme');
  }, []);

  const [userRole, setUserRole] = useState<'investigador' | 'auditor' | 'administrativo'>(() => {
    return (localStorage.getItem('fcm_user_role') as any) || 'administrativo';
  });

  const handleLogin = (token: string, role: 'investigador' | 'auditor' | 'administrativo' = 'administrativo') => {
    setIsAuthenticated(true);
    setAuthToken(token);
    setUserRole(role);
    localStorage.setItem('fcm_user_role', role);
    sessionStorage.setItem('fcm_patrimonio_auth', 'true');
    sessionStorage.setItem('fcm_patrimonio_token', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    sessionStorage.removeItem('fcm_patrimonio_auth');
    sessionStorage.removeItem('fcm_patrimonio_token');
  };

  const handleSaveNomenclature = (newNames: BuildingNomenclatureMap) => {
    setCustomBuildingNames(newNames);
    saveStoredBuildingNomenclature(newNames);
  };

  // Gestión de filtros multi-edificio
  const handleToggleBuilding = (buildingCode: string) => {
    setFilters((prev) => {
      const exists = prev.edificios.includes(buildingCode);
      const updated = exists
        ? prev.edificios.filter((b) => b !== buildingCode)
        : [...prev.edificios, buildingCode];
      return { ...prev, edificios: updated };
    });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSelectAllBuildings = () => {
    setFilters((prev) => ({ ...prev, edificios: [] }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleClearBuildings = () => {
    setFilters((prev) => ({ ...prev, edificios: [] }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Resetear paginación al cambiar filtros
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Filtrado y ordenamiento computado
  const filteredItems = useMemo(() => {
    return ALL_EQUIPMENT_ITEMS.filter((item) => {
      // Filtro por texto de búsqueda libre
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const bCustomName = getBuildingDisplayName(item.edificio, customBuildingNames).toLowerCase();
        const matchesSearch =
          item.descripcion.toLowerCase().includes(query) ||
          item.noControl.toLowerCase().includes(query) ||
          item.noResguardo.toLowerCase().includes(query) ||
          item.rInterno.toLowerCase().includes(query) ||
          item.marca.toLowerCase().includes(query) ||
          item.serie.toLowerCase().includes(query) ||
          item.edificio.toLowerCase().includes(query) ||
          bCustomName.includes(query) ||
          item.salaLaboratorio.toLowerCase().includes(query) ||
          item.profesor.toLowerCase().includes(query) ||
          item.categoria.toLowerCase().includes(query) ||
          item.ubicacionCode.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Filtro multi-edificio simultáneo (si el arreglo tiene elementos, debe coincidir con alguno)
      if (filters.edificios.length > 0 && !filters.edificios.includes(item.edificio)) {
        return false;
      }

      // Filtro multi-profesor simultáneo
      if (filters.profesores.length > 0 && !filters.profesores.includes(item.profesor)) {
        return false;
      }

      // Filtro por categoría
      if (filters.categoria !== 'ALL' && item.categoria !== filters.categoria) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'importe') {
        comparison = a.importe - b.importe;
      } else if (filters.sortBy === 'descripcion') {
        comparison = a.descripcion.localeCompare(b.descripcion);
      } else if (filters.sortBy === 'edificio') {
        comparison = a.edificio.localeCompare(b.edificio);
      } else if (filters.sortBy === 'fecha') {
        const parseDate = (d: string) => {
          const parts = d.split('/');
          if (parts.length === 3) {
            return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
          }
          return 0;
        };
        comparison = parseDate(a.fechaAdquisicion) - parseDate(b.fechaAdquisicion);
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filters, customBuildingNames]);

  // Selección individual de equipos
  const handleToggleItemSelect = (item: EquipmentItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  // Seleccionar todos los equipos visibles en el filtro
  const handleSelectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredItems.forEach((it) => next.add(it.id));
      return next;
    });
  };

  // Deseleccionar todos
  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Seleccionar todos los equipos de un edificio con 1 clic
  const handleSelectEquipmentByBuilding = (buildingCode: string) => {
    const buildingItems = ALL_EQUIPMENT_ITEMS.filter((it) => it.edificio === buildingCode);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      buildingItems.forEach((it) => next.add(it.id));
      return next;
    });
  };

  // Seleccionar todos los equipos de un profesor con 1 clic
  const handleSelectEquipmentByProfessor = (profName: string) => {
    const profItems = ALL_EQUIPMENT_ITEMS.filter((it) => it.profesor === profName);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      profItems.forEach((it) => next.add(it.id));
      return next;
    });
  };

  // Objetos de equipos seleccionados
  const selectedEquipmentItems = useMemo(() => {
    if (selectedIds.size === 0) return [];
    return ALL_EQUIPMENT_ITEMS.filter((it) => selectedIds.has(it.id));
  }, [selectedIds]);

  // Monto dinámico de inversión según selección
  const selectedImporte = useMemo(() => {
    return selectedEquipmentItems.reduce((acc, it) => acc + (it.importe || 0), 0);
  }, [selectedEquipmentItems]);

  // Estadísticas calculadas sobre los elementos visibles/filtrados
  const currentStats = useMemo(() => {
    return calculateDashboardStats(filteredItems);
  }, [filteredItems]);

  // Conteo global para el selector de edificios
  const allBuildingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_EQUIPMENT_ITEMS.forEach((it) => {
      counts[it.edificio] = (counts[it.edificio] || 0) + 1;
    });
    return counts;
  }, []);

  // Items mostrados para renderizado eficiente con paginación progresiva
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Exportar a CSV (respeta si hay selección activa o exporta filtrados)
  const handleExportCSV = (onlySelected: boolean = false) => {
    const itemsToExport = onlySelected ? selectedEquipmentItems : filteredItems;
    if (itemsToExport.length === 0) return;

    const headers = [
      'No. Control',
      'No. Resguardo',
      'Resguardo Interno',
      'Descripción',
      'Categoría',
      'Marca',
      'Serie',
      'Edificio',
      'Nombre Edificio Personalizado',
      'Ubicación Exacta',
      'Nivel',
      'Clave Ubicación',
      'Profesor Responsable',
      'No. Empleado',
      'Fecha Adquisición',
      'Orden de Compra',
      'Póliza',
      'Importe (MXN)',
    ];

    const rows = itemsToExport.map((item) => [
      `"${item.noControl}"`,
      `"${item.noResguardo}"`,
      `"${item.rInterno}"`,
      `"${item.descripcion.replace(/"/g, '""')}"`,
      `"${item.categoria}"`,
      `"${item.marca.replace(/"/g, '""')}"`,
      `"${item.serie.replace(/"/g, '""')}"`,
      `"${item.edificio}"`,
      `"${getBuildingDisplayName(item.edificio, customBuildingNames).replace(/"/g, '""')}"`,
      `"${item.salaLaboratorio}"`,
      `"${item.nivel}"`,
      `"${item.ubicacionCode}"`,
      `"${item.profesor}"`,
      `"${item.noEmpleado}"`,
      `"${item.fechaAdquisicion}"`,
      `"${item.noOrdenCompra}"`,
      `"${item.noPoliza}"`,
      item.importe.toFixed(2),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `inventario_patrimonial_fcm_uabc_${onlySelected ? 'seleccion_' : ''}${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copia rápida para correo de todos los seleccionados
  const handleQuickCopyEmail = async () => {
    if (selectedEquipmentItems.length === 0) return;

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 2,
      }).format(val);
    };

    const lines: string[] = [];
    lines.push('RELACIÓN DE EQUIPOS PATRIMONIALES · FCM UABC');
    lines.push(`Equipos: ${selectedEquipmentItems.length} | Inversión: ${formatCurrency(selectedImporte)}`);
    lines.push('----------------------------------------------------');
    selectedEquipmentItems.forEach((it, idx) => {
      const bName = getBuildingDisplayName(it.edificio, customBuildingNames);
      lines.push(`${idx + 1}. [${it.noControl}] ${it.descripcion}`);
      lines.push(`   • Ubicación: ${it.edificio} (${bName}) - ${it.salaLaboratorio} (Clave: ${it.ubicacionCode})`);
      lines.push(`   • Responsable: ${it.profesor} (Emp. #${it.noEmpleado}) | Resg. #${it.noResguardo}`);
      lines.push(`   • Marca: ${it.marca} | Serie: ${it.serie || 'S/N'} | Importe: ${formatCurrency(it.importe)}`);
      lines.push('');
    });
    lines.push(`TOTAL INVERSIÓN: ${formatCurrency(selectedImporte)}`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Encabezado Superior con Identidad Institucional */}
      <Header
        onOpenEmbedGuide={() => setShowEmbedGuide(true)}
        onOpenNomenclature={() => setShowNomenclatureModal(true)}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        totalItems={ALL_EQUIPMENT_ITEMS.length}
        userRole={userRole}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isAuthenticated ? (
          /* Pantalla de Bloqueo Seguro Inicial */
          <div className="max-w-xl mx-auto my-12 text-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-4 border border-amber-300">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Capa de Seguridad Patrimonial FCM
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              El inventario institucional de la Facultad de Ciencias Marinas UABC requiere autenticación mediante código de acceso autorizado para su consulta.
            </p>

            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-slate-800">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>Acceso Restringido a Personal Autorizado</span>
              </div>
              <p className="leading-relaxed">
                Este sistema contiene información patrimonial interna y resguardos de equipo científico. Para consultar el catálogo, ingrese el código o PIN proporcionado por la jefatura administrativa o coordinación de investigación de la FCM.
              </p>
            </div>

            <button
              id="unlock-direct-btn"
              onClick={() => {
                // Forzar apertura del modal de autenticación
                const statusBtn = document.getElementById('auth-status-btn');
                if (statusBtn) statusBtn.click();
              }}
              className="mt-6 w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Ingresar Código de Acceso Autorizado</span>
            </button>
          </div>
        ) : (
          /* Vista Completa del Panel de Control */
          <>
            {/* Resumen Cuantitativo de Estadísticas con Inversión Dinámica */}
            <StatsOverview
              stats={currentStats}
              selectedCount={selectedIds.size}
              selectedImporte={selectedImporte}
              totalFiltered={filteredItems.length}
              totalAll={ALL_EQUIPMENT_ITEMS.length}
            />

            {/* Selector Multi-Edificio con Selección Simultánea y Edición de Nomenclatura */}
            <BuildingSelector
              selectedBuildings={filters.edificios}
              onToggleBuilding={handleToggleBuilding}
              onSelectAllBuildings={handleSelectAllBuildings}
              onClearBuildings={handleClearBuildings}
              buildingCounts={allBuildingCounts}
              totalCount={ALL_EQUIPMENT_ITEMS.length}
              customNames={customBuildingNames}
              onOpenNomenclature={() => setShowNomenclatureModal(true)}
              onSelectEquipmentByBuilding={handleSelectEquipmentByBuilding}
            />

            {/* Barra de Filtros (Multi-profesores, búsqueda, categorías) */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalFiltered={filteredItems.length}
              totalAll={ALL_EQUIPMENT_ITEMS.length}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              onExportCSV={() => handleExportCSV(false)}
              customNames={customBuildingNames}
              onSelectEquipmentByProfessor={handleSelectEquipmentByProfessor}
            />

            {/* Visualización de Equipos: Grid de Tarjetas o Tabla Completa */}
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {displayedItems.length > 0 ? (
                  <div
                    id="equipment-grid-view"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                  >
                    {displayedItems.map((item) => (
                      <EquipmentCard
                        key={item.id}
                        item={item}
                        onSelect={(it) => setSelectedItem(it)}
                        isSelected={selectedIds.has(item.id)}
                        onToggleSelect={(it) => handleToggleItemSelect(it)}
                        customNames={customBuildingNames}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <p className="text-base font-medium text-slate-500">
                      No se encontraron equipos registrados con los criterios seleccionados.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Limpiar todos los filtros</span>
                    </button>
                  </div>
                )}

                {/* Botón Cargar Más para Rendimiento Fluido */}
                {visibleCount < filteredItems.length && (
                  <div className="text-center pt-4">
                    <button
                      id="load-more-items-btn"
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 shadow-sm text-sm font-bold text-slate-800 hover:border-emerald-500 hover:bg-slate-50 transition-colors"
                    >
                      <span>
                        Cargar más equipos ({filteredItems.length - visibleCount} restantes)
                      </span>
                      <ChevronDown className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EquipmentTable
                items={displayedItems}
                onSelect={(it) => setSelectedItem(it)}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleItemSelect}
                onSelectAllFiltered={handleSelectAllFiltered}
                onClearSelection={handleClearSelection}
                customNames={customBuildingNames}
              />
            )}

            {/* Barra Flotante de Acciones de Selección para Correo */}
            {selectedIds.size > 0 && (
              <SelectionBar
                selectedCount={selectedIds.size}
                totalFiltered={filteredItems.length}
                selectedImporte={selectedImporte}
                onSelectAllFiltered={handleSelectAllFiltered}
                onClearSelection={handleClearSelection}
                onOpenEmailModal={() => setShowEmailModal(true)}
                onQuickCopyEmail={handleQuickCopyEmail}
                onExportSelectedCSV={() => handleExportCSV(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Modal de Ficha Detallada de Resguardo */}
      <EquipmentDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        customNames={customBuildingNames}
        isSelected={selectedItem ? selectedIds.has(selectedItem.id) : false}
        onToggleSelect={handleToggleItemSelect}
      />

      {/* Modal de Personalización de Nomenclatura de Edificios */}
      <BuildingNomenclatureModal
        isOpen={showNomenclatureModal}
        onClose={() => setShowNomenclatureModal(false)}
        customNames={customBuildingNames}
        onSave={handleSaveNomenclature}
        userRole={userRole}
      />

      {/* Modal para Copiar Lista en Formato Correo Electrónico */}
      <EmailExportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        selectedItems={selectedEquipmentItems}
        customNames={customBuildingNames}
      />

      {/* Modal de Guía de Publicación en Google Sites */}
      <GoogleSitesModal
        isOpen={showEmbedGuide}
        onClose={() => setShowEmbedGuide(false)}
      />

      {/* Pie de Página Institucional */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-slate-700">
            Facultad de Ciencias Marinas · Universidad Autónoma de Baja California
          </div>
          <div>
            Carretera Tijuana-Ensenada Km. 103, Pedregal Playitas, C.P. 22860 Ensenada, B.C.
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Control Patrimonial FCM · Modo Claro Institucional
          </div>
        </div>
      </footer>
    </div>
  );
}
