import { EquipmentItem, EquipmentCategory, DashboardStats } from '../types';
import { ITEMS_OTHERS } from './itemsOthers';
import { ITEMS_GALAVIZ } from './itemsGalaviz';
import { ITEMS_CONAL } from './itemsConal';
import { BUILDINGS_INFO, PROFESSORS_INFO } from './metadata';

// Catálogo consolidado de todos los equipos del patrimonio FCM UABC
export const ALL_EQUIPMENT_ITEMS: EquipmentItem[] = [
  ...ITEMS_OTHERS,
  ...ITEMS_GALAVIZ,
  ...ITEMS_CONAL,
];

// Estadísticas globales calculadas
export function calculateDashboardStats(items: EquipmentItem[] = ALL_EQUIPMENT_ITEMS): DashboardStats {
  const totalEquipos = items.length;
  const valorTotalEstimado = items.reduce((acc, curr) => acc + (curr.importe || 0), 0);

  const porEdificio: Record<string, number> = {};
  const porCategoria: Record<string, number> = {};
  const porProfesor: Record<string, number> = {};

  items.forEach((item) => {
    // Edificio
    porEdificio[item.edificio] = (porEdificio[item.edificio] || 0) + 1;

    // Categoría
    porCategoria[item.categoria] = (porCategoria[item.categoria] || 0) + 1;

    // Profesor
    porProfesor[item.profesor] = (porProfesor[item.profesor] || 0) + 1;
  });

  return {
    totalEquipos,
    valorTotalEstimado,
    totalEdificios: Object.keys(porEdificio).length,
    totalProfesores: Object.keys(porProfesor).length,
    porEdificio,
    porCategoria,
    porProfesor,
  };
}

// Lista única de categorías ordenadas por frecuencia
export const ALL_CATEGORIES: EquipmentCategory[] = [
  'Laboratorio e Instrumentación Analítica',
  'Filtración y Tratamiento de Agua',
  'Bombas y Fluidos',
  'Climatización y Temperatura',
  'Tanques y Contenedores',
  'Potencia y Suministro Eléctrico',
  'Refrigeración y Almacén Frío',
  'Bioseguridad y Mobiliario Especial',
  'Cómputo, Redes y Ofimática',
  'Audiovisual y Herramientas',
];

export { BUILDINGS_INFO, PROFESSORS_INFO };
