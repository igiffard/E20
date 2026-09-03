export type EquipmentCategory =
  | 'Bombas y Fluidos'
  | 'Filtración y Tratamiento de Agua'
  | 'Tanques y Contenedores'
  | 'Laboratorio e Instrumentación Analítica'
  | 'Cómputo, Redes y Ofimática'
  | 'Climatización y Temperatura'
  | 'Potencia y Suministro Eléctrico'
  | 'Refrigeración y Almacén Frío'
  | 'Bioseguridad y Mobiliario Especial'
  | 'Audiovisual y Herramientas';

export interface EquipmentItem {
  id: string;
  fechaAdquisicion: string;
  noControl: string;
  noResguardo: string;
  rInterno: string;
  descripcion: string;
  marca: string;
  ubicacionCode: string;
  edificioId: string;
  edificioNombre: string;
  espacioDetalle: string;
  // Propiedades canónicas enriquecidas
  edificio: string; // ej. 'EDIF-108'
  salaLaboratorio: string; // ej. 'Laboratorio 11507 (Módulo Principal)'
  nivel: string; // ej. 'Nivel 1 (Planta Baja)'
  serie: string;
  noOrdenCompra: string;
  noPoliza: string;
  importe: number;
  profesor: string;
  noEmpleado: string;
  categoria: EquipmentCategory;
  observaciones?: string;
}

export interface BuildingDetail {
  id: string;
  codigo: string;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  areasPrincipales: string[];
  color: string;
}

export interface ProfessorDetail {
  id?: string;
  nombre: string;
  noEmpleado: string;
  departamento: string;
  cargo?: string;
  areaEspecialidad: string;
  email?: string;
  avatarColor: string;
}

export interface FilterState {
  search: string;
  edificios: string[]; // Códigos de edificio seleccionados, ej: ['EDIF-108', 'EDIF-105']. Vacío significa todos.
  profesores: string[]; // Nombres de profesores seleccionados. Vacío significa todos.
  categoria: string;
  sortBy: 'importe' | 'descripcion' | 'fecha' | 'edificio';
  sortOrder: 'asc' | 'desc';
}

export type BuildingNomenclatureMap = Record<string, string>; // Mapeo de id o código -> nombre personalizado por el usuario

export interface DashboardStats {
  totalEquipos: number;
  valorTotalEstimado: number;
  totalEdificios: number;
  totalProfesores: number;
  porEdificio: Record<string, number>;
  porCategoria: Record<string, number>;
  porProfesor: Record<string, number>;
}
