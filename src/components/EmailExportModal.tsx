import React, { useState, useMemo } from 'react';
import { X, Mail, Copy, Check, FileText, Download, ShieldCheck, DollarSign, Building2, User } from 'lucide-react';
import { EquipmentItem, BuildingNomenclatureMap } from '../types';
import { getBuildingDisplayName } from '../data/metadata';

interface EmailExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: EquipmentItem[];
  customNames: BuildingNomenclatureMap;
}

export const EmailExportModal: React.FC<EmailExportModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  customNames,
}) => {
  const [copiedWith, setCopiedWith] = useState(false);
  const [copiedWithout, setCopiedWithout] = useState(false);
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeLocationCodes, setIncludeLocationCodes] = useState(true);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const totalImporte = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + (item.importe || 0), 0);
  }, [selectedItems]);

  const uniqueBuildings = useMemo(() => {
    const set = new Set<string>();
    selectedItems.forEach((it) => {
      const name = getBuildingDisplayName(it.edificio, customNames);
      set.add(`${it.edificio} (${name})`);
    });
    return Array.from(set);
  }, [selectedItems, customNames]);

  const uniqueProfessors = useMemo(() => {
    const set = new Set<string>();
    selectedItems.forEach((it) => set.add(it.profesor));
    return Array.from(set);
  }, [selectedItems]);

  // Generar texto plano optimizado para correo electrónico
  const emailPlainText = useMemo(() => {
    if (selectedItems.length === 0) return 'No hay equipos seleccionados.';

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines: string[] = [];
    lines.push('========================================================================');
    lines.push('RELACIÓN DE EQUIPOS E INVENTARIO PATRIMONIAL');
    lines.push('FACULTAD DE CIENCIAS MARINAS · UNIVERSIDAD AUTÓNOMA DE BAJA CALIFORNIA');
    lines.push('========================================================================');
    lines.push(`Fecha de Emisión: ${dateFormatted}`);
    lines.push(`Equipos Seleccionados: ${selectedItems.length} equipos`);
    if (includeFinancials) {
      lines.push(`Inversión Patrimonial Total: ${formatCurrency(totalImporte)}`);
    }
    lines.push(`Edificio(s) Involucrado(s): ${uniqueBuildings.join(', ')}`);
    lines.push(`Profesor(es) Responsable(s): ${uniqueProfessors.join('; ')}`);
    lines.push('------------------------------------------------------------------------\n');

    selectedItems.forEach((item, index) => {
      const bName = getBuildingDisplayName(item.edificio, customNames);
      lines.push(`${index + 1}. [No. Control: ${item.noControl}] ${item.descripcion.toUpperCase()}`);
      lines.push(`   • Ubicación: ${item.edificio} - ${bName}`);
      lines.push(`   • Espacio / Sala: ${item.salaLaboratorio} (${item.nivel})`);
      if (includeLocationCodes) {
        lines.push(`   • Clave Oficial de Ubicación: ${item.ubicacionCode}`);
      }
      lines.push(`   • Responsable: ${item.profesor} (Emp. #${item.noEmpleado})`);
      lines.push(`   • No. Resguardo: ${item.noResguardo} | Resguardo Interno: ${item.rInterno}`);
      lines.push(`   • Marca: ${item.marca} | Serie: ${item.serie || 'S/N'}`);
      if (includeFinancials) {
        lines.push(`   • Importe Histórico: ${formatCurrency(item.importe)} (Póliza: ${item.noPoliza || 'S/P'})`);
      }
      lines.push('');
    });

    lines.push('------------------------------------------------------------------------');
    lines.push(`TOTAL: ${selectedItems.length} equipos patrimoniales.`);
    if (includeFinancials) {
      lines.push(`MONTO TOTAL DE INVERSIÓN: ${formatCurrency(totalImporte)}.`);
    }
    lines.push('Información extraída del Sistema de Control Patrimonial FCM UABC.');

    return lines.join('\n');
  }, [selectedItems, totalImporte, uniqueBuildings, uniqueProfessors, customNames, includeFinancials, includeLocationCodes]);

  // Generar HTML enriquecido para que al pegar en Gmail / Outlook se pegue como tabla con estilo
  const emailHtml = useMemo(() => {
    if (selectedItems.length === 0) return '';

    const rows = selectedItems
      .map((item, idx) => {
        const bName = getBuildingDisplayName(item.edificio, customNames);
        return `
        <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">${item.noControl}</td>
          <td style="padding: 8px 10px; color: #1e293b;">
            <strong>${item.descripcion}</strong>
            <div style="font-size: 11px; color: #64748b;">Marca: ${item.marca} | Serie: ${item.serie || 'S/N'}</div>
          </td>
          <td style="padding: 8px 10px; color: #1e293b;">
            <div style="font-weight: 600; color: #047857;">${item.edificio} - ${bName}</div>
            <div style="font-size: 11px; color: #475569;">${item.salaLaboratorio}</div>
            ${includeLocationCodes ? `<div style="font-size: 10px; color: #64748b; font-family: monospace;">Clave: ${item.ubicacionCode}</div>` : ''}
          </td>
          <td style="padding: 8px 10px; color: #334155; font-size: 12px;">
            ${item.profesor}
            <div style="font-size: 10px; color: #64748b;">Emp. #${item.noEmpleado} · Resg. ${item.noResguardo}</div>
          </td>
          ${
            includeFinancials
              ? `<td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: bold; color: #0f172a;">${formatCurrency(item.importe)}</td>`
              : ''
          }
        </tr>`;
      })
      .join('');

    return `
      <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 900px;">
        <div style="border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px;">
          <h2 style="margin: 0; color: #065f46; font-size: 18px;">Inventario Patrimonial · FCM UABC</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">
            Facultad de Ciencias Marinas · Relación de ${selectedItems.length} equipos seleccionados
          </p>
          ${
            includeFinancials
              ? `<p style="margin: 4px 0 0 0; font-weight: bold; color: #047857; font-size: 14px;">
                  Inversión Total Seleccionada: ${formatCurrency(totalImporte)}
                </p>`
              : ''
          }
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
          <thead>
            <tr style="background-color: #065f46; color: #ffffff;">
              <th style="padding: 8px 10px;">No. Control</th>
              <th style="padding: 8px 10px;">Descripción del Equipo</th>
              <th style="padding: 8px 10px;">Edificio y Ubicación</th>
              <th style="padding: 8px 10px;">Profesor Responsable</th>
              ${includeFinancials ? '<th style="padding: 8px 10px; text-align: right;">Importe (MXN)</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          ${
            includeFinancials
              ? `
            <tfoot>
              <tr style="background-color: #ecfdf5; font-weight: bold; border-top: 2px solid #059669;">
                <td colspan="4" style="padding: 10px; text-align: right; color: #065f46;">TOTAL SELECCIONADO:</td>
                <td style="padding: 10px; text-align: right; font-family: monospace; color: #065f46; font-size: 13px;">${formatCurrency(totalImporte)}</td>
              </tr>
            </tfoot>`
              : ''
          }
        </table>
        <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">Generado desde el Sistema de Control Patrimonial FCM UABC.</p>
      </div>
    `;
  }, [selectedItems, totalImporte, customNames, includeFinancials, includeLocationCodes]);

  const handleCopyClipboardWith = async (withFinancials: boolean) => {
    setIncludeFinancials(withFinancials);

    // Compute text and html with the specific financial toggle
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines: string[] = [];
    lines.push('========================================================================');
    lines.push('RELACIÓN DE EQUIPOS E INVENTARIO PATRIMONIAL');
    lines.push('FACULTAD DE CIENCIAS MARINAS · UNIVERSIDAD AUTÓNOMA DE BAJA CALIFORNIA');
    lines.push('========================================================================');
    lines.push(`Fecha de Emisión: ${dateFormatted}`);
    lines.push(`Equipos Seleccionados: ${selectedItems.length} equipos`);
    if (withFinancials) {
      lines.push(`Inversión Patrimonial Total: ${formatCurrency(totalImporte)}`);
    }
    lines.push(`Edificio(s) Involucrado(s): ${uniqueBuildings.join(', ')}`);
    lines.push(`Profesor(es) Responsable(s): ${uniqueProfessors.join('; ')}`);
    lines.push('------------------------------------------------------------------------\n');

    selectedItems.forEach((item, index) => {
      const bName = getBuildingDisplayName(item.edificio, customNames);
      lines.push(`${index + 1}. [No. Control: ${item.noControl}] ${item.descripcion.toUpperCase()}`);
      lines.push(`   • Ubicación: ${item.edificio} - ${bName}`);
      lines.push(`   • Espacio / Sala: ${item.salaLaboratorio} (${item.nivel})`);
      if (includeLocationCodes) {
        lines.push(`   • Clave Oficial de Ubicación: ${item.ubicacionCode}`);
      }
      lines.push(`   • Responsable: ${item.profesor} (Emp. #${item.noEmpleado})`);
      lines.push(`   • No. Resguardo: ${item.noResguardo} | Resguardo Interno: ${item.rInterno}`);
      lines.push(`   • Marca: ${item.marca} | Serie: ${item.serie || 'S/N'}`);
      if (withFinancials) {
        lines.push(`   • Importe Histórico: ${formatCurrency(item.importe)} (Póliza: ${item.noPoliza || 'S/P'})`);
      }
      lines.push('');
    });

    lines.push('------------------------------------------------------------------------');
    lines.push(`TOTAL: ${selectedItems.length} equipos patrimoniales.`);
    if (withFinancials) {
      lines.push(`MONTO TOTAL DE INVERSIÓN: ${formatCurrency(totalImporte)}.`);
    }
    lines.push('Información extraída del Sistema de Control Patrimonial FCM UABC.');
    const plainText = lines.join('\n');

    const rows = selectedItems
      .map((item, idx) => {
        const bName = getBuildingDisplayName(item.edificio, customNames);
        return `
        <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">${item.noControl}</td>
          <td style="padding: 8px 10px; color: #1e293b;">
            <strong>${item.descripcion}</strong>
            <div style="font-size: 11px; color: #64748b;">Marca: ${item.marca} | Serie: ${item.serie || 'S/N'}</div>
          </td>
          <td style="padding: 8px 10px; color: #1e293b;">
            <div style="font-weight: 600; color: #047857;">${item.edificio} - ${bName}</div>
            <div style="font-size: 11px; color: #475569;">${item.salaLaboratorio}</div>
            ${includeLocationCodes ? `<div style="font-size: 10px; color: #64748b; font-family: monospace;">Clave: ${item.ubicacionCode}</div>` : ''}
          </td>
          <td style="padding: 8px 10px; color: #334155; font-size: 12px;">
            ${item.profesor}
            <div style="font-size: 10px; color: #64748b;">Emp. #${item.noEmpleado} · Resg. ${item.noResguardo}</div>
          </td>
          ${
            withFinancials
              ? `<td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: bold; color: #0f172a;">${formatCurrency(item.importe)}</td>`
              : ''
          }
        </tr>`;
      })
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 900px;">
        <div style="border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px;">
          <h2 style="margin: 0; color: #065f46; font-size: 18px;">Inventario Patrimonial · FCM UABC</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">
            Facultad de Ciencias Marinas · Relación de ${selectedItems.length} equipos seleccionados
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background-color: #065f46; color: #ffffff;">
              <th style="padding: 10px; font-weight: bold;">No. Control</th>
              <th style="padding: 10px; font-weight: bold;">Descripción y Marca</th>
              <th style="padding: 10px; font-weight: bold;">Edificio y Sala</th>
              <th style="padding: 10px; font-weight: bold;">Profesor Responsable</th>
              ${withFinancials ? '<th style="padding: 10px; font-weight: bold; text-align: right;">Importe</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          ${
            withFinancials
              ? `
            <tfoot>
              <tr style="background-color: #ecfdf5; font-weight: bold; border-top: 2px solid #059669;">
                <td colspan="4" style="padding: 10px; text-align: right; color: #065f46;">TOTAL SELECCIONADO:</td>
                <td style="padding: 10px; text-align: right; font-family: monospace; color: #065f46; font-size: 13px;">${formatCurrency(totalImporte)}</td>
              </tr>
            </tfoot>`
              : ''
          }
        </table>
        <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">Generado desde el Sistema de Control Patrimonial FCM UABC.</p>
      </div>
    `;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }
    } catch (err) {
      await navigator.clipboard.writeText(plainText);
    }

    if (withFinancials) {
      setCopiedWith(true);
      setTimeout(() => setCopiedWith(false), 2500);
    } else {
      setCopiedWithout(true);
      setTimeout(() => setCopiedWithout(false), 2500);
    }
  };

  const handleCopyClipboard = () => {
    handleCopyClipboardWith(includeFinancials);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([emailPlainText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `equipos_seleccionados_fcm_uabc_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      id="email-export-modal-overlay"
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
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Copiar Equipos para Correo Electrónico</h2>
              <p className="text-xs text-emerald-100">
                Formato listo para pegar directamente en Gmail, Outlook o correo institucional UABC
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

        {/* Resumen de Seleccionados */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{selectedItems.length} equipos seleccionados</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Inversión: {formatCurrency(totalImporte)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeFinancials}
                onChange={(e) => setIncludeFinancials(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Incluir importes ($)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeLocationCodes}
                onChange={(e) => setIncludeLocationCodes(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Incluir claves de ubicación</span>
            </label>
          </div>
        </div>

        {/* Vista previa editable / inspeccionable del texto */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Vista Previa del Contenido:</span>
            <span>Compatible con texto y tablas enriquecidas</span>
          </div>

          <textarea
            readOnly
            value={emailPlainText}
            className="w-full h-80 p-3.5 text-xs font-mono bg-slate-50 text-slate-800 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-none"
          />

          <p className="text-[11px] text-slate-500 italic">
            Al hacer clic en <strong>"Copiar para Correo"</strong>, el sistema copiará automáticamente tanto el texto formateado como una tabla con colores institucionales. Si pega en Gmail o Outlook con <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700 font-bold">Ctrl + V</kbd> (o <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700 font-bold">Cmd + V</kbd>), aparecerá una tabla limpia y legible.
          </p>
        </div>

        {/* Acciones del Modal */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar como Texto (.txt)</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cerrar
            </button>

            {/* Selector directo de Copia con Monto o sin Monto */}
            <div className="inline-flex rounded-xl border border-slate-300 p-0.5 bg-slate-200 shadow-sm">
              <button
                type="button"
                id="copy-email-with-amount-btn"
                onClick={() => handleCopyClipboardWith(true)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  copiedWith
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
                title="Copiar lista y tabla para correo incluyendo montos de inversión"
              >
                {copiedWith ? <Check className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                <span>{copiedWith ? '¡Copiado con Montos!' : 'Copiar con Montos ($)'}</span>
              </button>

              <button
                type="button"
                id="copy-email-without-amount-btn"
                onClick={() => handleCopyClipboardWith(false)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  copiedWithout
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Copiar lista y tabla para correo omitiendo datos financieros"
              >
                {copiedWithout ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWithout ? '¡Copiado sin Montos!' : 'Copiar sin Montos'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
