import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Barcode,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Badge } from './ui/Badge';
import { PageHeader } from './ui/PageHeader';
import { formatCurrency, cn } from '../lib/utils';

export function QuickOperation({ products, onAddProduct, onSellProduct, templates }) {
  const [mode, setMode] = useState('entrada');
  const [imei, setImei] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [lastOperation, setLastOperation] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);
  const lastBeepTime = useRef(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Troca de modo (entrada/saída) limpando o estado da operação atual
  const changeMode = (nextMode) => {
    setMode(nextMode);
    setImei('');
    setSelectedTemplate('');
    setLastOperation(null);
    setFeedback(null);
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const templateOptions = templates.map(t => ({
    value: t.id,
    label: `${t.name} - ${formatCurrency(t.salePrice)}`
  }));

  const getSelectedTemplateData = () => {
    return templates.find(t => t.id === selectedTemplate);
  };

  const findProductByImei = useCallback((searchImei) => {
    return products.find(p => 
      p.imei.toLowerCase() === searchImei.toLowerCase().trim()
    );
  }, [products]);

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch { /* AudioContext indisponível neste contexto */ }
  };

  const playErrorSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 220;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch { /* AudioContext indisponível neste contexto */ }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && imei.trim()) {
      e.preventDefault();
      processBarcode(imei.trim());
    }
  };

  const processBarcode = async (scannedImei) => {
    // Debounce de bipe — só é chamado a partir de event handlers, nunca no render.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    if (now - lastBeepTime.current < 500) return;
    lastBeepTime.current = now;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (mode === 'entrada') {
      handleEntrance(scannedImei);
    } else {
      handleExit(scannedImei);
    }
    setIsProcessing(false);
  };

  const handleEntrance = (scannedImei) => {
    const existingProduct = findProductByImei(scannedImei);
    if (existingProduct) {
      playErrorSound();
      showFeedback('error', `IMEI já cadastrado! Produto: ${existingProduct.name}`);
      setLastOperation({ type: 'error', product: existingProduct });
      return;
    }

    const template = getSelectedTemplateData();
    if (!template) {
      playErrorSound();
      showFeedback('error', 'Selecione um modelo base para cadastro!');
      return;
    }

    const newProduct = {
      name: template.name,
      brand: template.brand,
      category: template.category,
      condition: template.condition,
      costPrice: template.costPrice,
      salePrice: template.salePrice,
      imei: scannedImei,
      quantity: 1,
      minQuantity: template.minQuantity,
      status: 'disponivel'
    };

    onAddProduct(newProduct);

    playSuccessSound();
    const profit = template.salePrice - template.costPrice;
    const margin = ((profit / template.salePrice) * 100).toFixed(1);
    
    showFeedback('success', `${template.name} cadastrado com sucesso!`);
    setLastOperation({
      type: 'success',
      product: { ...newProduct, profit, margin }
    });
    setImei('');
  };

  const handleExit = (scannedImei) => {
    const product = findProductByImei(scannedImei);

    if (!product) {
      playErrorSound();
      showFeedback('error', 'Produto não encontrado no estoque!');
      setLastOperation({ type: 'error', message: 'Produto não encontrado' });
      return;
    }

    if (product.status === 'vendido') {
      playErrorSound();
      showFeedback('error', 'Este produto já foi vendido!');
      setLastOperation({ type: 'error', product });
      return;
    }

    if (product.status === 'reservado') {
      playErrorSound();
      showFeedback('error', 'Este produto está reservado!');
      return;
    }

    const profit = product.salePrice - product.costPrice;
    const margin = ((profit / product.salePrice) * 100).toFixed(1);

    onSellProduct(product);

    playSuccessSound();
    showFeedback('success', `Venda registrada! ${product.name}`);
    setLastOperation({
      type: 'success',
      product: { ...product, profit, margin }
    });
    setImei('');
  };

  const clearLastOperation = () => {
    setLastOperation(null);
    setImei('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        eyebrow="Operações"
        title="Operação Rápida (Bipe)"
        subtitle="Fluxo otimizado para leitor de código de barras / IMEI"
      />

      {/* Mode Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => changeMode('entrada')}
          className={cn(
            'flex items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200',
            mode === 'entrada'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
          )}
        >
          <ArrowDownToLine className="w-8 h-8" />
          <div className="text-left">
            <div className="font-semibold text-lg">Entrada</div>
            <div className="text-sm opacity-75">Cadastrar produto</div>
          </div>
        </button>

        <button
          onClick={() => changeMode('saida')}
          className={cn(
            'flex items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200',
            mode === 'saida'
              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
          )}
        >
          <ArrowUpFromLine className="w-8 h-8" />
          <div className="text-left">
            <div className="font-semibold text-lg">Saída</div>
            <div className="text-sm opacity-75">Registrar venda</div>
          </div>
        </button>
      </div>

      {/* Main Operation Card */}
      <Card className="relative overflow-hidden">
        <div className={cn(
          'absolute inset-0 opacity-5 transition-colors duration-500',
          mode === 'entrada' ? 'bg-emerald-500' : 'bg-blue-500'
        )} />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-3 h-3 rounded-full animate-pulse',
                mode === 'entrada' ? 'bg-emerald-500' : 'bg-blue-500'
              )} />
              <span className="text-sm font-medium text-slate-300">
                {mode === 'entrada' ? 'Modo Entrada - Cadastro' : 'Modo Saída - Venda'}
              </span>
            </div>
            <Badge variant={mode === 'entrada' ? 'success' : 'info'}>
              <Barcode className="w-3 h-3 mr-1" />
              Lector Ativo
            </Badge>
          </div>

          {/* Template Selection */}
          {mode === 'entrada' && (
            <div className="mb-6">
              <Select
                label="Modelo Base do Aparelho"
                placeholder="Selecione o modelo para cadastro rápido"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                options={[
                  { value: '', label: 'Selecione um modelo...' },
                  ...templateOptions
                ]}
              />
              
              {getSelectedTemplateData() && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Custo:</span>
                      <span className="text-slate-200 ml-2">
                        {formatCurrency(getSelectedTemplateData().costPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Venda:</span>
                      <span className="text-emerald-400 ml-2">
                        {formatCurrency(getSelectedTemplateData().salePrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Lucro:</span>
                      <span className="text-emerald-400 ml-2">
                        {formatCurrency(getSelectedTemplateData().salePrice - getSelectedTemplateData().costPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Barcode Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {mode === 'entrada' ? 'Bipe o IMEI do aparelho' : 'Bipe o IMEI para venda'}
            </label>
            <div className="relative">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Aguardando leitura do IMEI..."
                value={imei}
                onChange={(e) => setImei(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                className={cn(
                  'h-16 pl-12 pr-12 text-xl font-mono tracking-[0.15em] placeholder:tracking-normal placeholder:font-sans placeholder:text-base',
                  feedback?.type === 'success' && 'success-flash',
                  feedback?.type === 'error' && 'error-flash'
                )}
                autoFocus
              />
              {isProcessing && (
                <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin pointer-events-none" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Pressione Enter ou utilize o leitor de código de barras
            </p>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div className={cn(
              'p-4 rounded-lg flex items-center gap-3 animate-fade-in',
              feedback.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            )}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{feedback.message}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Last Operation Summary */}
      {lastOperation && (
        <Card className="animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-50">
              Última Operação
            </h3>
            <Button variant="ghost" size="sm" onClick={clearLastOperation}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {lastOperation.type === 'success' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-50">{lastOperation.product.name}</p>
                  <p className="text-sm text-slate-400">IMEI: {lastOperation.product.imei}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Preço de Venda</p>
                  <p className="text-lg font-semibold text-slate-50">
                    {formatCurrency(lastOperation.product.salePrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Custo</p>
                  <p className="text-lg font-semibold text-slate-50">
                    {formatCurrency(lastOperation.product.costPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Lucro / Margem</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {formatCurrency(lastOperation.product.profit)} ({lastOperation.product.margin}%)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="font-medium text-rose-400">Operação não realizada</p>
                <p className="text-sm text-slate-400">{lastOperation.message || lastOperation.product?.name}</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">Disponíveis</div>
          <div className="text-3xl font-bold text-emerald-400 tabular-nums">
            {products.filter(p => p.status === 'disponivel').length}
          </div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">Reservados</div>
          <div className="text-3xl font-bold text-amber-400 tabular-nums">
            {products.filter(p => p.status === 'reservado').length}
          </div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">Vendidos</div>
          <div className="text-3xl font-bold text-slate-300 tabular-nums">
            {products.filter(p => p.status === 'vendido').length}
          </div>
        </Card>
      </div>
    </div>
  );
}