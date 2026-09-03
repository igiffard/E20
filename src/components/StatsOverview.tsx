import React from 'react';
import { Package, Building2, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsOverviewProps {
  stats: DashboardStats;
  selectedCount: number;
  selectedImporte: number;
  totalFiltered: number;
  totalAll: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  selectedCount,
  selectedImporte,
  totalFiltered,
  totalAll,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasSelection = selectedCount > 0;
  const currentInvestment = hasSelection ? selectedImporte : stats.valorTotalEstimado;

  const statCards = [
    {
      id: 'stat-equipos',
      label: hasSelection ? 'Equipos Seleccionados' : 'Equipos en Vista',
      value: hasSelection ? `${selectedCount}` : `${totalFiltered}`,
      helper: hasSelection
        ? `de ${totalFiltered} visibles (${totalAll} total)`
        : totalFiltered === totalAll
        ? 'Total en inventario FCM'
        : `Filtrados de ${totalAll} totales`,
      icon: hasSelection ? CheckCircle2 : Package,
      color: hasSelection ? 'text-emerald-700' : 'text-emerald-700',
      bgColor: hasSelection ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200',
      isHighlighted: hasSelection,
    },
    {
      id: 'stat-edificios',
      label: 'Edificios con Equipos',
      value: stats.totalEdificios.toString(),
      helper: 'Edificios en consulta activa',
      icon: Building2,
      color: 'text-sky-700',
      bgColor: 'bg-white border-slate-200',
      isHighlighted: false,
    },
    {
      id: 'stat-profesores',
      label: 'Investigadores',
      value: stats.totalProfesores.toString(),
      helper: 'Resguardatarios activos en consulta',
      icon: Users,
      color: 'text-indigo-700',
      bgColor: 'bg-white border-slate-200',
      isHighlighted: false,
    },
    {
      id: 'stat-inversion',
      label: hasSelection ? 'Inversión Patrimonial Seleccionada' : 'Inversión Patrimonial (Vista)',
      value: formatCurrency(currentInvestment),
      helper: hasSelection
        ? `Suma de los ${selectedCount} equipos marcados`
        : totalFiltered === totalAll
        ? 'Costo histórico total de adquisición'
        : `Suma de los ${totalFiltered} equipos filtrados`,
      icon: DollarSign,
      color: 'text-emerald-700',
      bgColor: hasSelection ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-500/20' : 'bg-white border-slate-200',
      isHighlighted: true,
    },
  ];

  return (
    <div id="stats-overview-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {statCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`p-4 rounded-xl border ${card.bgColor} shadow-sm transition-all flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg bg-slate-100 ${card.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {card.helper}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
