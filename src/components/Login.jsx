import { useState, useRef, useEffect } from 'react';
import { Smartphone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { login } from '../lib/auth';
import { cn } from '../lib/utils';

export function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      onSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-50">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-blue-500/10 rounded-2xl ring-1 ring-blue-400/20 mb-4">
            <Smartphone className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">GestaoPhone</h1>
          <p className="text-sm text-slate-500 mt-1">Controle de Estoque</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-1">Acesso</p>
            <h2 className="text-lg font-semibold text-slate-50">Entrar no sistema</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Senha da loja</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                ref={inputRef}
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Digite a senha de acesso"
                className={cn(
                  'w-full pl-11 pr-11 py-3 rounded-xl border transition-all duration-200',
                  'bg-slate-950 border-slate-800 text-slate-50 placeholder:text-slate-600',
                  'focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus:outline-none',
                  error && 'border-rose-500 focus:border-rose-500 focus-visible:ring-rose-500/20'
                )}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full">
            Entrar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Acesso restrito · GestaoPhone © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
