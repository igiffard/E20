import React, { useState } from 'react';
import { X, Globe, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoogleSitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSitesModal: React.FC<GoogleSitesModalProps> = ({ isOpen, onClose }) => {
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const defaultGithubPagesUrl = 'https://igiffard.github.io/E20/';
  const currentUrl = typeof window !== 'undefined' && window.location.origin.includes('github.io')
    ? window.location.href
    : defaultGithubPagesUrl;

  const iframeCode = `<iframe src="${currentUrl}" width="100%" height="950px" style="border:none; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, isUrl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUrl) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="google-sites-modal-overlay"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative">
            <button
              id="close-sites-modal-btn"
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4" />
              <span>Publicación en Google Sites y GitHub</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Integración con URL Única para Google Sites
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Esta aplicación está diseñada como una Single-Page App (SPA) cliente, 100% compatible con GitHub Pages y Google Sites.
            </p>
          </div>

          {/* Contenido */}
          <div className="p-5 sm:p-6 space-y-5 text-slate-700 text-sm max-h-[75vh] overflow-y-auto">
            {/* Paso 1: Exportar a GitHub */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Exportar el código a tu repositorio de GitHub</span>
              </div>
              <p className="text-xs text-slate-600 pl-8">
                En el menú de Google AI Studio, usa la opción <strong>Export to GitHub</strong> para crear un repositorio en tu cuenta. Luego en GitHub, ve a <em>Settings → Pages</em> y activa <strong>GitHub Pages</strong> con fuente en <em>GitHub Actions</em> o la rama <em>gh-pages</em>. Obtendrás una <strong>URL única pública</strong>.
              </p>
            </div>

            {/* Paso 2: Incrustar en Google Sites */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Incrustar en tu página de Google Sites</span>
              </div>
              <p className="text-xs text-slate-600 pl-8 mb-3">
                En el editor de tu Google Sites, en la barra derecha haz clic en <strong>Insertar → Incorporar</strong> (o <em>Embed</em>), selecciona la pestaña <strong>Código de inserción</strong> y pega el siguiente bloque:
              </p>

              <div className="relative pl-8">
                <pre className="p-3 bg-slate-900 text-emerald-300 text-xs font-mono rounded-lg overflow-x-auto border border-slate-800">
                  {iframeCode}
                </pre>
                <button
                  id="copy-iframe-btn"
                  onClick={() => copyToClipboard(iframeCode, false)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  {copiedIframe ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIframe ? '¡Código Copiado!' : 'Copiar Código de Inserción'}</span>
                </button>
              </div>
            </div>

            {/* Capa de Seguridad y Código de Acceso: Pública vs Privada */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Configuración de Privacidad y Seguridad (GitHub vs. Google Sites)</span>
              </div>
              
              <div className="text-xs text-emerald-900 space-y-2 leading-relaxed">
                <p>
                  <strong>1. ¿El repositorio en GitHub debe ser público o privado?</strong><br />
                  Debe ser <strong>PÚBLICO</strong> para que GitHub Pages funcione de forma gratuita y permita que Google Sites cargue el contenido dentro del marco (iframe) sin exigir credenciales de GitHub a los profesores.
                </p>
                <p>
                  <strong>2. ¿Google Sites puede ser privado?</strong><br />
                  <strong>SÍ, absolutamente.</strong> En la configuración de su Google Sites (botón <em>Compartir</em> con el ícono de persona), configure el acceso como <strong>Restringido</strong> a personas con correo institucional <em>@uabc.edu.mx</em> o a usuarios específicos. De este modo, nadie fuera de la universidad puede abrir el sitio.
                </p>
                <p>
                  <strong>3. ¿Los códigos de acceso están visibles en la pantalla?</strong><br />
                  <strong>NO.</strong> Los códigos no se muestran en pantalla ni hay botones de autollenado. La pantalla de inicio solicita el PIN o código de acceso en un campo protegido (<code>••••••</code>), por lo que <strong>únicamente las personas a quienes usted se los proporcione directamente</strong> podrán desbloquear y consultar el inventario.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
            <button
              id="close-sites-modal-footer-btn"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
