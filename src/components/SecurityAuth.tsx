import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SecurityAuthProps {
  isAuthenticated: boolean;
  onLogin: (token: string, role?: 'investigador' | 'auditor' | 'administrativo') => void;
  onLogout: () => void;
  currentRole?: 'investigador' | 'auditor' | 'administrativo';
}

// Claves de acceso válidas autorizadas
const VALID_PASSCODES = [
  'UABC2025',
  'FCM-PATRIMONIO',
  'UABC-FCM',
  'CONAL-TRUE',
  'INVESTIGACION',
  '10695', // No. Empleado Conal True
  '12087', // No. Empleado Raquel Silveira
];

export const SecurityAuth: React.FC<SecurityAuthProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
  currentRole = 'investigador',
}) => {
  const [showModal, setShowModal] = useState(!isAuthenticated);
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'auditor' | 'investigador' | 'administrativo'>(currentRole);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim().toUpperCase();

    if (VALID_PASSCODES.includes(cleanCode) || cleanCode.startsWith('UABC')) {
      setError(null);
      onLogin(cleanCode, role);
      setShowModal(false);
    } else {
      setError('Código de acceso no válido. Utilice uno de los códigos autorizados del sistema FCM.');
    }
  };

  const handleQuickAccess = (code: string) => {
    setPasscode(code);
    setError(null);
    onLogin(code, role);
    setShowModal(false);
  };

  return (
    <>
      {/* Botón de estado de autenticación en la barra superior */}
      <button
        id="auth-status-btn"
        onClick={() => {
          if (isAuthenticated) {
            if (window.confirm('¿Desea cerrar la sesión de consulta patrimonial?')) {
              onLogout();
              setShowModal(true);
            }
          } else {
            setShowModal(true);
          }
        }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
          isAuthenticated
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
            : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
        }`}
        title={isAuthenticated ? 'Haga clic para cambiar perfil o cerrar sesión' : 'Haga clic para autenticarse'}
      >
        {isAuthenticated ? (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              {currentRole === 'administrativo'
                ? 'Perfil: Patrimonio'
                : currentRole === 'auditor'
                ? 'Perfil: Auditoría'
                : 'Perfil: Investigador'}
            </span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Autenticación Requerida</span>
          </>
        )}
      </button>

      {/* Modal de Acceso Seguro */}
      <AnimatePresence>
        {showModal && !isAuthenticated && (
          <div
            id="auth-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Encabezado UABC */}
              <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 text-center relative">
                <div className="mx-auto w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-3 border border-white/20">
                  <Key className="w-7 h-7 text-emerald-200" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Control Patrimonial FCM</h3>
                <p className="text-xs text-emerald-100/90 mt-1 font-medium">
                  Facultad de Ciencias Marinas · UABC Campus Ensenada
                </p>
                <div className="inline-block mt-3 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20 text-emerald-100">
                  Capa de Seguridad Institucional
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleVerify} className="p-6 space-y-4">
                <div className="text-sm text-slate-700">
                  Ingrese su <strong>Código de Acceso Único</strong> o credencial institucional para desbloquear la consulta de inventario y datos de resguardo:
                </div>

                {/* Perfil de Consulta */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Perfil de Consulta
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'investigador', label: 'Investigador' },
                      { id: 'auditor', label: 'Auditoría' },
                      { id: 'administrativo', label: 'Patrimonio' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setRole(item.id as any)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                          role === item.id
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input de Código */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Código de Acceso / PIN
                  </label>
                  <div className="relative">
                    <input
                      id="security-passcode-input"
                      type={showPassword ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Ingrese el código o PIN proporcionado..."
                      className="w-full pl-4 pr-11 py-3 text-base font-mono rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showPassword ? 'Ocultar código' : 'Mostrar código'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Solicite su código de acceso al administrador de control patrimonial o resguardo de la FCM.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  id="submit-auth-btn"
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Validar Código y Desbloquear Inventario</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
