import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  Calculator,
  ExternalLink,
  ArrowLeft,
  MessageSquareX,
  AlertCircle,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Video,
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface DepositSectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

export const DepositSection: React.FC<DepositSectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const { deposit } = contentData;

  // Form states
  const [amountStr, setAmountStr] = useState<string>('100.000.000');
  const [termMonths, setTermMonths] = useState<number>(12);
  const [interestRateStr, setInterestRateStr] = useState<string>('4.7');

  // Parse raw amount
  const parseAmount = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const amount = useMemo(() => parseAmount(amountStr), [amountStr]);
  const rate = useMemo(() => {
    const parsed = parseFloat(interestRateStr.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  }, [interestRateStr]);

  // Validation rules
  const amountError = useMemo(() => {
    if (!amountStr.trim() || amount <= 0) {
      return 'Vui lòng nhập số tiền gửi hợp lệ.';
    }
    if (amount < deposit.minAmount) {
      return `Mức tiền gửi tối thiểu là ${deposit.minAmountFormatted}.`;
    }
    return null;
  }, [amountStr, amount, deposit]);

  const termError = useMemo(() => {
    if (!termMonths || termMonths <= 0) {
      return 'Vui lòng chọn kỳ hạn gửi.';
    }
    return null;
  }, [termMonths]);

  const rateError = useMemo(() => {
    if (rate <= 0) {
      return 'Vui lòng nhập lãi suất hợp lệ.';
    }
    if (rate > deposit.maxRate) {
      return `Lãi suất không được vượt quá ${deposit.maxRate}%/năm.`;
    }
    return null;
  }, [rate, deposit]);

  // Handle Amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setAmountStr('');
      return;
    }
    const num = parseInt(raw, 10);
    setAmountStr(num.toLocaleString('vi-VN'));
  };

  // Add quick amount preset
  const addQuickAmount = (delta: number) => {
    const newTotal = amount + delta;
    setAmountStr(newTotal.toLocaleString('vi-VN'));
  };

  // Change Term -> update default recommended rate
  const handleTermChange = (months: number) => {
    setTermMonths(months);
    const matched = deposit.terms.find((t) => t.months === months);
    if (matched) {
      setInterestRateStr(matched.rate.toString());
    }
  };

  // Calculation: Formula: Tiền lãi = (Số tiền gửi × Lãi suất %/năm × Số tháng) / 12
  const calculatedInterest = useMemo(() => {
    if (amountError || termError || rateError) return 0;
    return Math.round((amount * (rate / 100) * termMonths) / 12);
  }, [amount, rate, termMonths, amountError, termError, rateError]);

  const totalMaturity = useMemo(() => {
    return amount + calculatedInterest;
  }, [amount, calculatedInterest]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Về menu chính
        </button>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Cấu phần 4 • Tiết kiệm VietinBank
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          <PiggyBank className="w-4 h-4 text-emerald-600" />
          Tiết kiệm thông minh
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {deposit.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {deposit.subtitle} • Minh bạch - Chính xác - Tối đa lợi nhuận
        </p>
      </div>

      {/* Main Two-Column Layout strictly per PDF 2 Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tiền gửi dự tính */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Tiền gửi dự tính
            </h2>
            <span className="text-xs text-slate-400 font-medium">Đơn vị: VND</span>
          </div>

          {/* 1. Tổng tiền gửi */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Tổng tiền gửi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (ví dụ: 100.000.000)"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-slate-900 font-bold text-base sm:text-lg pr-16 focus:bg-white focus:outline-hidden transition ${
                  amountError ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-blue-200'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                VND
              </span>
            </div>

            {/* Error or validation tip */}
            {amountError && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {amountError}
              </p>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 self-center">Chọn nhanh:</span>
              {[
                { label: '+10 Tr', value: 10000000 },
                { label: '+50 Tr', value: 50000000 },
                { label: '+100 Tr', value: 100000000 },
                { label: '+500 Tr', value: 500000000 },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addQuickAmount(btn.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition"
                >
                  {btn.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountStr('0')}
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 text-xs underline"
              >
                Đặt lại
              </button>
            </div>
          </div>

          {/* 2. Kỳ hạn gửi */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Kỳ hạn gửi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {deposit.terms.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleTermChange(t.months)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                    termMonths === t.months
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className={`text-[10px] font-normal ${termMonths === t.months ? 'text-blue-100' : 'text-slate-400'}`}>
                    {t.rate}%/năm
                  </span>
                </button>
              ))}
            </div>

            {termError && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {termError}
              </p>
            )}
          </div>

          {/* 3. Lãi suất */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                Biểu lãi suất niêm yết VietinBank
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={interestRateStr}
                onChange={(e) => setInterestRateStr(e.target.value)}
                placeholder="4.7"
                className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-slate-900 font-bold text-base pr-16 focus:bg-white focus:outline-hidden transition ${
                  rateError ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-blue-200'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                %/năm
              </span>
            </div>

            {rateError && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {rateError}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Tiền lãi dự tính & Tổng kết */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="border-b border-blue-800/80 pb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300">
                Kết quả ước tính
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Trả lãi cuối kỳ
              </span>
            </div>

            {/* Interest Profit */}
            <div className="space-y-1">
              <span className="text-xs text-blue-200 font-medium">Tiền lãi dự tính</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                {calculatedInterest.toLocaleString('vi-VN')}
                <span className="text-lg font-normal text-amber-200 ml-1.5">VND</span>
              </div>
            </div>

            {/* Total Balance at Maturity */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-1">
              <span className="text-xs text-blue-200 font-medium">
                Tổng tiền nhận khi đáo hạn (Gốc + Lãi)
              </span>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {totalMaturity.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-normal text-blue-200">VND</span>
              </div>
            </div>

            {/* Terms Summary Breakdown */}
            <div className="text-xs space-y-2 text-blue-100 pt-2 border-t border-blue-800/60">
              <div className="flex justify-between">
                <span>Số tiền gửi gốc:</span>
                <span className="font-semibold">{amount.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Kỳ hạn tiết kiệm:</span>
                <span className="font-semibold">{termMonths} tháng</span>
              </div>
              <div className="flex justify-between">
                <span>Lãi suất áp dụng:</span>
                <span className="font-semibold text-amber-300">{rate}%/năm</span>
              </div>
              <div className="flex justify-between">
                <span>Công thức tính:</span>
                <span className="text-[11px] text-blue-200">(Gốc × Lãi suất × Số tháng)/12</span>
              </div>
            </div>
          </div>

          {/* Link Video TikTok hướng dẫn gửi tiết kiệm (Strictly per PDF 2) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Video hướng dẫn gửi tiết kiệm
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mẹo gửi tiết kiệm sinh lời tối đa trên TikTok
                </p>
              </div>
            </div>

            <a
              href={deposit.tiktokVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shrink-0 transition"
            >
              <span>Xem Video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Kiosk Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
        >
          Quay lại menu chính
        </button>
        <button
          onClick={onOpenEndDialog}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition flex items-center justify-center gap-1.5"
        >
          <MessageSquareX className="w-4 h-4 text-rose-600" />
          Kết thúc cuộc trò chuyện
        </button>
      </div>
    </div>
  );
};
