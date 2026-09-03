import { BuildingDetail, ProfessorDetail, BuildingNomenclatureMap } from '../types';

export const DEFAULT_BUILDING_NAMES: Record<string, string> = {
  'EDIF-108': 'Edificio 108 - Unidad de Piscicultura Marina y Acuacultura',
  'EDIF-105': 'Edificio 105 - Laboratorios Centrales de Docencia e Investigación Marina',
  'EDIF-200': 'Edificio 200 - Posgrado e Investigación Científica Marina',
  'EDIF-107': 'Edificio 107 - Aulas y Servicios Académicos',
  'EDIF-103': 'Edificio 103 - Gabinetes Técnicos y de Apoyo',
  'EDIF-100': 'Edificio 100 - Infraestructura Externa y Servicios de Campo',
  '108': 'Edificio 108 - Unidad de Piscicultura Marina y Acuacultura',
  '105': 'Edificio 105 - Laboratorios Centrales de Docencia e Investigación Marina',
  '200': 'Edificio 200 - Posgrado e Investigación Científica Marina',
  '107': 'Edificio 107 - Aulas y Servicios Académicos',
  '103': 'Edificio 103 - Gabinetes Técnicos y de Apoyo',
  '100': 'Edificio 100 - Infraestructura Externa y Servicios de Campo',
};

export const BUILDINGS_INFO: BuildingDetail[] = [
  {
    id: '108',
    codigo: 'EDIF-108',
    nombre: 'Edificio 108 - Unidad de Piscicultura Marina y Acuacultura',
    nombreCorto: 'Unidad de Piscicultura Marina (Edif. 108)',
    descripcion: 'Complejo principal de acuacultura marina, biotecnología de cultivo de totoaba, naves de acondicionamiento de reproductores, sistemas de recirculación acuícola (RAS), laboratorios de larvicultura y microalgas (Claves oficiales 10811507, 10811506, 10811504, 10811502, 10821001, 10821003, 10821501).',
    areasPrincipales: [
      'Lab 11507 (Cultivo Larvario y Mantenimiento de Totoaba)',
      'Lab 11506 (Reproducción, Desove y Acondicionamiento)',
      'Lab 11504 (Bioquímica Nutricional y Análisis de Alimento)',
      'Lab 11502 (Producción de Microalgas y Alimento Vivo)',
      'Lab 21001 (Microbiología Acuática y Sanidad)',
      'Sala 21003 (Sistemas de Recirculación y Filtros RAS)',
      'Módulo 21501 (Supervisión Técnica y Monitoreo)',
    ],
    color: 'emerald',
  },
  {
    id: '105',
    codigo: 'EDIF-105',
    nombre: 'Edificio 105 - Laboratorios Centrales de Docencia e Investigación Marina',
    nombreCorto: 'Laboratorios Centrales (Edif. 105)',
    descripcion: 'Laboratorios de docencia experimental, química oceanográfica, biología pesquera, ecología marina y análisis instrumental avanzado (Claves oficiales 10511501, 10511502, 10511504).',
    areasPrincipales: [
      'Lab 11501 (Biología y Oceanografía Experimental)',
      'Lab 11502 (Fisiología de Organismos Marinos)',
      'Lab 11504 (Preparación de Muestras y Análisis Instrumental)',
    ],
    color: 'blue',
  },
  {
    id: '200',
    codigo: 'EDIF-200',
    nombre: 'Edificio 200 - Posgrado e Investigación Científica Marina',
    nombreCorto: 'Posgrado FCM (Edif. 200)',
    descripcion: 'Instalaciones de investigación de posgrado, cubículos de investigadores, módulos de biotecnología molecular marina, genética y análisis físico-químico (Claves oficiales 20014001, 20014002, 20011504, 20014201).',
    areasPrincipales: [
      'Módulo 11504 (Biotecnología Molecular y Genética Marina)',
      'Lab 14001 (Microscopía Electrónica y Diagnóstico)',
      'Lab 14002 (Cromatografía y Espectrometría)',
      'Módulo 14201 (Modelación Marina y Computación Científica)',
    ],
    color: 'purple',
  },
  {
    id: '107',
    codigo: 'EDIF-107',
    nombre: 'Edificio 107 - Aulas y Servicios Académicos',
    nombreCorto: 'Aulas Académicas (Edif. 107)',
    descripcion: 'Aulas de clases para licenciatura y posgrado, salas de seminarios, conferencias y cómputo académico (Clave oficial 10711005).',
    areasPrincipales: ['Aula 11005 (Seminarios y Conferencias Académicas)'],
    color: 'amber',
  },
  {
    id: '103',
    codigo: 'EDIF-103',
    nombre: 'Edificio 103 - Gabinetes Técnicos y de Apoyo',
    nombreCorto: 'Gabinetes Técnicos (Edif. 103)',
    descripcion: 'Áreas de apoyo técnico a la investigación oceanográfica, gabinetes de muestreo y resguardo de instrumental oceanográfico de campo (Clave oficial 10311201).',
    areasPrincipales: ['Gabinete 11201 (Mantenimiento Técnico y Equipos de Muestreo)'],
    color: 'rose',
  },
  {
    id: '100',
    codigo: 'EDIF-100',
    nombre: 'Edificio 100 - Infraestructura Externa y Servicios de Campo',
    nombreCorto: 'Infraestructura Externa (Edif. 100)',
    descripcion: 'Instalaciones exteriores, patio de maniobras de embarcaciones oceanográficas, estación de bombas de agua marina y tanques exteriores de cultivo (Clave oficial 10011202).',
    areasPrincipales: ['Área Exterior 11202 (Patio de Muestreo, Bombas de Agua Marina y Maniobras)'],
    color: 'slate',
  },
];

export function getBuildingDisplayName(codigoOrId: string, customNames?: BuildingNomenclatureMap): string {
  const code = (codigoOrId || '').trim();
  if (customNames && customNames[code]) {
    return customNames[code];
  }
  const idOnly = code.replace('EDIF-', '');
  if (customNames && customNames[idOnly]) {
    return customNames[idOnly];
  }
  if (DEFAULT_BUILDING_NAMES[code]) {
    return DEFAULT_BUILDING_NAMES[code];
  }
  return code.startsWith('EDIF-') ? `Edificio ${idOnly}` : code;
}

export function getStoredBuildingNomenclature(): BuildingNomenclatureMap {
  try {
    const raw = localStorage.getItem('fcm_building_custom_names');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return { ...DEFAULT_BUILDING_NAMES };
}

export function saveStoredBuildingNomenclature(map: BuildingNomenclatureMap): void {
  try {
    localStorage.setItem('fcm_building_custom_names', JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}

export const PROFESSORS_INFO: ProfessorDetail[] = [
  {
    id: 'CONAL DAVID TRUE',
    nombre: 'CONAL DAVID TRUE',
    noEmpleado: '10695',
    departamento: 'Facultad de Ciencias Marinas',
    cargo: 'Investigador Titular · Responsable Laboratorio de Piscicultura Marina',
    areaEspecialidad: 'Biotecnología y Cultivo de Totoaba (RAS, Larvicultura y Nutrición)',
    email: 'conal@uabc.edu.mx',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'MARIO ALBERTO GALAVIZ ESPINOZA',
    nombre: 'MARIO ALBERTO GALAVIZ ESPINOZA',
    noEmpleado: '24835',
    departamento: 'Facultad de Ciencias Marinas',
    cargo: 'Investigador · Lab. de Nutrición y Fisiología Digestiva',
    areaEspecialidad: 'Bioquímica Nutricional Marina y Fisiología Digestiva de Organismos Acuáticos',
    email: 'mgalaviz@uabc.edu.mx',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'FERNANDO BARRETO CURIEL',
    nombre: 'FERNANDO BARRETO CURIEL',
    noEmpleado: '27709',
    departamento: 'Facultad de Ciencias Marinas',
    cargo: 'Profesor Investigador · Fisiología Marina',
    areaEspecialidad: 'Fisiología de Organismos Marinos, Espectrometría y Termorregulación',
    email: 'fbarreto@uabc.edu.mx',
    avatarColor: 'bg-cyan-600',
  },
  {
    id: 'GERARDO SANDOVAL GARIBALDI',
    nombre: 'GERARDO SANDOVAL GARIBALDI',
    noEmpleado: '19752',
    departamento: 'Facultad de Ciencias Marinas',
    cargo: 'Profesor Investigador · Acuacultura Experimental',
    areaEspecialidad: 'Acuacultura Experimental, Digestibilidad y Calidad de Agua',
    email: 'gsandoval@uabc.edu.mx',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'ANGEL RAUL HERRERA GUTIERREZ',
    nombre: 'ANGEL RAUL HERRERA GUTIERREZ',
    noEmpleado: '27992',
    departamento: 'Facultad de Ciencias Marinas',
    cargo: 'Profesor Investigador · Oceanología',
    areaEspecialidad: 'Oceanología, Proyección Audiovisual y Sistemas de Fotoperiodo',
    email: 'aherrera@uabc.edu.mx',
    avatarColor: 'bg-rose-600',
  },
];

export function getEdificioInfo(ubicacionCode: string): {
  edificioId: string;
  edificio: string;
  edificioNombre: string;
  espacioDetalle: string;
  salaLaboratorio: string;
  nivel: string;
} {
  const code = (ubicacionCode || '').trim();
  const prefix3 = code.slice(0, 3);
  const nivel = code.length > 3 && code[3] === '2' ? 'Nivel 2 (Planta Alta)' : 'Nivel 1 (Planta Baja)';
  
  if (prefix3 === '108') {
    const sala = code.slice(3);
    let detalle = `Sala/Lab ${sala}`;
    if (code === '10811507') detalle = 'Laboratorio 11507 (Módulo Principal Acuacultura y Naves)';
    else if (code === '10811506') detalle = 'Laboratorio 11506 (Filtración UV y Desinfección)';
    else if (code === '10811504') detalle = 'Laboratorio 11504 (Módulo Húmedo)';
    else if (code === '10811502') detalle = 'Laboratorio 11502 (Control Fisicoquímico)';
    else if (code === '10811501') detalle = 'Laboratorio 11501 (Área de Bombas y Aire)';
    else if (code === '10821001') detalle = 'Planta Alta - Lab 21001 (Microbiología y Almacén)';
    else if (code === '10821002') detalle = 'Planta Alta - Sala 21002';
    else if (code === '10821003') detalle = 'Planta Alta - Sala 21003 (Sistemas Ozono y Compresor)';
    else if (code === '10821501') detalle = 'Planta Alta - Módulo 21501 (Vaciado y Muestreo)';
    else if (code === '10817401') detalle = 'Área Externa - Módulo 17401 (Bombeo)';
    return {
      edificioId: '108',
      edificio: 'EDIF-108',
      edificioNombre: 'Edificio 108',
      espacioDetalle: detalle,
      salaLaboratorio: detalle,
      nivel,
    };
  }
  
  if (prefix3 === '105') {
    const sala = code.slice(3);
    let detalle = `Laboratorio ${sala}`;
    if (code === '10511501') detalle = 'Laboratorio 11501 (Bioquímica)';
    else if (code === '10511502') detalle = 'Laboratorio 11502 (Cromatografía)';
    else if (code === '10511504') detalle = 'Laboratorio 11504 (Sala de Análisis)';
    return {
      edificioId: '105',
      edificio: 'EDIF-105',
      edificioNombre: 'Edificio 105',
      espacioDetalle: detalle,
      salaLaboratorio: detalle,
      nivel,
    };
  }

  if (prefix3 === '200') {
    const sala = code.slice(3);
    let detalle = `Espacio ${sala}`;
    if (code === '20011504') detalle = 'Módulo 11504 (A/C y Fuerza)';
    else if (code === '20014001') detalle = 'Laboratorio 14001 (Nutrición)';
    else if (code === '20014002') detalle = 'Laboratorio 14002 (Cultivo Experimental)';
    else if (code === '20014201') detalle = 'Módulo 14201 (Filtración)';
    return {
      edificioId: '200',
      edificio: 'EDIF-200',
      edificioNombre: 'Edificio 200',
      espacioDetalle: detalle,
      salaLaboratorio: detalle,
      nivel,
    };
  }

  if (prefix3 === '107') {
    return {
      edificioId: '107',
      edificio: 'EDIF-107',
      edificioNombre: 'Edificio 107',
      espacioDetalle: 'Aula de Cómputo 11005',
      salaLaboratorio: 'Aula de Cómputo 11005',
      nivel: 'Nivel 1 (Planta Baja)',
    };
  }

  if (prefix3 === '103') {
    return {
      edificioId: '103',
      edificio: 'EDIF-103',
      edificioNombre: 'Edificio 103',
      espacioDetalle: 'Gabinete de Microscopía 11201',
      salaLaboratorio: 'Gabinete de Microscopía 11201',
      nivel: 'Nivel 1 (Planta Baja)',
    };
  }

  if (prefix3 === '100') {
    return {
      edificioId: '100',
      edificio: 'EDIF-100',
      edificioNombre: 'Edificio 100',
      espacioDetalle: 'Área Exterior 11202 (Tanque Gas LP)',
      salaLaboratorio: 'Área Exterior 11202 (Tanque Gas LP)',
      nivel: 'Exterior',
    };
  }

  return {
    edificioId: prefix3 || 'Desconocido',
    edificio: `EDIF-${prefix3 || 'Desconocido'}`,
    edificioNombre: `Edificio ${prefix3 || 'Desconocido'}`,
    espacioDetalle: `Ubicación ${code}`,
    salaLaboratorio: `Espacio ${code}`,
    nivel: 'Nivel 1 (Planta Baja)',
  };
}
