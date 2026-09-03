import React, { useState, useRef } from 'react';
import {
  X,
  Building2,
  Save,
  RotateCcw,
  Check,
  HelpCircle,
  Info,
  Download,
  Upload,
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { BUILDINGS_INFO, DEFAULT_BUILDING_NAMES } from '../data/metadata';
import { BuildingNomenclatureMap } from '../types';

interface BuildingNomenclatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  customNames: BuildingNomenclatureMap;
  onSave: (newNames: BuildingNomenclatureMap) => void;
  userRole?: 'investigador' | 'auditor' | 'administrativo';
}

export const BuildingNomenclatureModal: React.FC<BuildingNomenclatureModalProps> = ({
  isOpen,
  onClose,
  customNames,
  onSave,
  userRole = 'administrativo',
}) => {
  const [draftNames, setDraftNames] = useState<BuildingNomenclatureMap>(() => ({
    ...customNames,
  }));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleChange = (code: string, val: string) => {
    setDraftNames((prev) => ({
      ...prev,
      [code]: val,
      [code.replace('EDIF-', '')]: val,
    }));
  };

  const handleSave = () => {
    onSave(draftNames);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Desea restablecer todos los nombres de los edificios a las especificaciones originales predeterminadas?')) {
      setDraftNames({ ...DEFAULT_BUILDING_NAMES });
    }
  };

  // Exportar archivo JSON para compartir entre profesores y computadoras
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draftNames, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nomenclatura_edificios_fcm_uabc_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar archivo JSON compartido por otro usuario o departamento
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === 'object' && parsed !== null) {
          setDraftNames((prev) => ({ ...prev, ...parsed }));
          setImportNotice('¡Nomenclatura importada con éxito! Haga clic en "Guardar Nomenclatura" para aplicarla permanentemente.');
          setTimeout(() => setImportNotice(null), 4000);
        } else {
          setImportNotice('El archivo JSON no tiene un formato válido de nomenclatura.');
        }
      } catch (err) {
        setImportNotice('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    // Limpiar input
    e.target.value = '';
  };

  return (
    <div
      id="nomenclature-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Encabezado */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Personalizar Nomenclatura de Edificios</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-700 border border-emerald-500 text-emerald-100">
                  Perfil: {userRole === 'administrativo' ? 'Patrimonio / Administrativo' : userRole === 'auditor' ? 'Auditoría' : 'Investigador'}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Ajuste el nombre de cada edificio para que coincida exactamente con su nomenclatura interna en la FCM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido / Formulario */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Tarjeta Explicativa Institucional: Roles, Guardado y Compartición */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>¿Cómo funciona la modificación y guardado de nombres?</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-slate-600">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¿Quién puede modificar y en qué perfiles?</span>
                </div>
                <p className="leading-relaxed">
                  El perfil <strong>Patrimonio / Administrativo</strong> es el responsable de homologar los nombres oficiales. Sin embargo, para mayor flexibilidad, cualquier usuario en su equipo de trabajo puede ajustar los nombres para que sus reportes y correos coincidan con su jerga departamental.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¿Queda guardado al cerrar sesión?</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Sí.</strong> La nomenclatura se guarda de forma segura en la memoria local (<code>localStorage</code>) de su navegador. Si cierra sesión, apaga la computadora o recarga la página, los cambios se mantienen vigentes en su equipo.
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-emerald-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>¿Cómo ven el cambio los demás usuarios en otras computadoras?</span>
              </div>
              <p className="leading-relaxed">
                Al ser una aplicación web estática (publicada en GitHub Pages o Google Sites sin base de datos central), los cambios en el navegador son locales a ese equipo. Para que todos los profesores de la FCM tengan exactamente la misma nomenclatura sin teclearla, utilice el botón <strong>"Exportar Nomenclatura (.json)"</strong> y comparta el archivo. Cualquier usuario puede pulsar <strong>"Importar Nomenclatura (.json)"</strong> y quedará sincronizado al instante.
              </p>
            </div>
          </div>

          {importNotice && (
            <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl text-xs font-semibold text-blue-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-700 flex-shrink-0" />
              <span>{importNotice}</span>
            </div>
          )}

          {/* Lista detallada de Edificios con sus especificaciones completas */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Especificaciones Oficiales y Nomenclatura Personalizada:</span>
              <span className="text-slate-500 font-normal">{BUILDINGS_INFO.length} Edificios Registrados</span>
            </div>

            {BUILDINGS_INFO.map((b) => {
              const currentVal = draftNames[b.codigo] || draftNames[b.id] || b.nombre;
              return (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {b.codigo}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold font-mono">
                        (Claves patrimoniales {b.id}XXXXX)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium">
                      Especificación oficial: <strong className="text-slate-800">{b.nombre}</strong>
                    </div>
                  </div>

                  {/* Descripción y Áreas de la especificación original */}
                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                    <span className="font-semibold text-slate-800">Descripción y Áreas: </span>
                    {b.descripcion}
                  </div>

                  {/* Input para modificar el nombre */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleChange(b.codigo, e.target.value)}
                        placeholder={`Nombre personalizado para ${b.codigo}...`}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold shadow-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange(b.codigo, DEFAULT_BUILDING_NAMES[b.codigo] || b.nombre)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 bg-white border border-slate-300 rounded-xl transition-colors"
                      title="Restablecer este edificio a su especificación original"
                    >
                      Restablecer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acciones del Modal: Exportar, Importar, Restablecer y Guardar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {/* Herramientas de Compartición y Respaldo */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
              title="Descargar archivo JSON para compartir su nomenclatura con otros usuarios"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Exportar (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
              title="Cargar un archivo JSON de nomenclatura configurado por otro profesor o administrador"
            >
              <Upload className="w-3.5 h-3.5 text-blue-700" />
              <span>Importar (.json)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json,application/json"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              title="Restablecer todos los edificios a las especificaciones originales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Todos</span>
            </button>
          </div>

          {/* Botones de Cierre y Guardado */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="save-nomenclature-btn"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡Nomenclatura Guardada!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  <span>Guardar Nomenclatura</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
