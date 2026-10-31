import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Table,
  CheckCircle2,
  ArrowLeft,
  MessageSquareX,
  FileSpreadsheet,
  X,
  Printer,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { LoanScheduleRow } from '../types';

interface LoanSectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

export const LoanSection: React.FC<LoanSectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const { loan } = contentData;

  // Form states
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500.000.000');
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [annualRateStr, setAnnualRateStr] = useState<string>('8.5');
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-10-31');
  const [repaymentCycle, setRepaymentCycle] = useState<string>('monthly');
  const [dueDay, setDueDay] = useState<number>(25);
  const [roundToThousand, setRoundToThousand] = useState<boolean>(true);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Parse Amount
  const loanAmount = useMemo(() => {
    const clean = loanAmountStr.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  }, [loanAmountStr]);

  const annualRate = useMemo(() => {
    const val = parseFloat(annualRateStr.replace(',', '.'));
    return isNaN(val) ? 0 : val;
  }, [annualRateStr]);

  // Handle Amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setLoanAmountStr('');
      return;
    }
    const num = parseInt(raw, 10);
    setLoanAmountStr(num.toLocaleString('vi-VN'));
  };

  // Quick Amount preset buttons
  const setQuickAmount = (val: number) => {
    setLoanAmountStr(val.toLocaleString('vi-VN'));
  };

  // Get active cycle configuration
  const activeCycle = useMemo(() => {
    return loan.cycles.find((c) => c.id === repaymentCycle) || loan.cycles[0];
  }, [loan.cycles, repaymentCycle]);

  // Total periods
  const totalPeriods = useMemo(() => {
    if (!tenureMonths || !activeCycle.monthsStep) return 0;
    return Math.max(1, Math.round(tenureMonths / activeCycle.monthsStep));
  }, [tenureMonths, activeCycle]);

  // Generate repayment schedule per PDF 3 rules
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || totalPeriods <= 0 || annualRate < 0) {
      return { rows: [], totalPrincipal: 0, totalInterest: 0, totalPayment: 0 };
    }

    // Rate per period: annualRate / divisor / 100
    const periodRate = annualRate / activeCycle.divisor / 100;

    // Base principal per period
    const rawPrincipalPerPeriod = loanAmount / totalPeriods;
    const basePrincipal = roundToThousand
      ? Math.round(rawPrincipalPerPeriod / 1000) * 1000
      : Math.round(rawPrincipalPerPeriod);

    let remainingBalance = loanAmount;
    let accumulatedPrincipalPaid = 0;
    let totalInterest = 0;

    const rows: LoanScheduleRow[] = [];

    // Parse disbursement date
    const [disbYear, disbMonth, disbDay] = disbursementDate.split('-').map(Number);
    const disbDateObj = new Date(disbYear || 2026, (disbMonth || 1) - 1, disbDay || 1);

    for (let p = 1; p <= totalPeriods; p++) {
      const beginningBalance = remainingBalance;

      // Calculate Period Interest = Dư nợ đầu kỳ × Lãi suất kỳ
      let periodInterest = beginningBalance * periodRate;
      periodInterest = roundToThousand
        ? Math.round(periodInterest / 1000) * 1000
        : Math.round(periodInterest);

      // Principal for this period
      let periodPrincipal = basePrincipal;

      // Adjust rounding discrepancies in the final period (strictly per PDF 3 rule 2.3)
      if (p === totalPeriods) {
        periodPrincipal = loanAmount - accumulatedPrincipalPaid;
      }

      const totalPayment = periodPrincipal + periodInterest;
      remainingBalance = Math.max(0, beginningBalance - periodPrincipal);
      accumulatedPrincipalPaid += periodPrincipal;
      totalInterest += periodInterest;

      // Calculate Payment Date: Starting after disbursement month, on the user selected due day
      const targetMonthDate = new Date(
        disbDateObj.getFullYear(),
        disbDateObj.getMonth() + p * activeCycle.monthsStep,
        1
      );
      // Clamp day to max days of month
      const maxDaysInMonth = new Date(
        targetMonthDate.getFullYear(),
        targetMonthDate.getMonth() + 1,
        0
      ).getDate();
      const actualDay = Math.min(dueDay, maxDaysInMonth);
      const paymentDate = new Date(
        targetMonthDate.getFullYear(),
        targetMonthDate.getMonth(),
        actualDay
      );

      const formattedDueDate = `${String(paymentDate.getDate()).padStart(2, '0')}/${String(
        paymentDate.getMonth() + 1
      ).padStart(2, '0')}/${paymentDate.getFullYear()}`;

      rows.push({
        period: p,
        dueDate: formattedDueDate,
        beginningBalance,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment,
        endingBalance: remainingBalance,
      });
    }

    return {
      rows,
      totalPrincipal: loanAmount,
      totalInterest,
      totalPayment: loanAmount + totalInterest,
    };
  }, [
    loanAmount,
    totalPeriods,
    annualRate,
    activeCycle,
    roundToThousand,
    disbursementDate,
    dueDay,
  ]);

  const firstPeriod = scheduleData.rows[0];

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
        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          Cấu phần 5 • Lịch trả nợ VietinBank
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
          <Calculator className="w-4 h-4 text-indigo-600" />
          Dư nợ giảm dần
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {loan.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {loan.subtitle} • Trả gốc đều đặn, lãi giảm dần theo thời gian
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (strictly input type per PDF 3) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Thông tin khoản vay
            </h2>
            <span className="text-xs text-slate-400 font-medium">Nhập số trực tiếp</span>
          </div>

          {/* 1. Số tiền vay - strictly NOT a slider, per user prompt: "phần số tiền vay thiết kế lại, không để dạng kéo thả, mà để dạng nhập." */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Số tiền vay (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={loanAmountStr}
                onChange={handleAmountChange}
                placeholder="500.000.000"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base sm:text-lg pr-16 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-200 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                VND
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 self-center">Chọn nhanh:</span>
              {[
                { label: '100 Tr', val: 100000000 },
                { label: '300 Tr', val: 300000000 },
                { label: '500 Tr', val: 500000000 },
                { label: '1 Tỷ', val: 1000000000 },
                { label: '2 Tỷ', val: 2000000000 },
                { label: '5 Tỷ', val: 5000000000 },
              ].map((b, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuickAmount(b.val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Thời gian vay (tháng) & Lãi suất (%/năm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Thời gian vay (tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base pr-16 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-200 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  Tháng
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  placeholder="8.5"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base pr-16 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-200 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  %/Năm
                </span>
              </div>
            </div>
          </div>

          {/* 3. Chu kỳ trả nợ & Ngày trả nợ định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Chu kỳ trả nợ
              </label>
              <select
                value={repaymentCycle}
                onChange={(e) => setRepaymentCycle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-200 transition"
              >
                {loan.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Lãi suất/{c.divisor})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Ngày trả nợ định kỳ
              </label>
              <div className="relative">
                <select
                  value={dueDay}
                  onChange={(e) => setDueDay(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-200 transition"
                >
                  {[5, 10, 15, 20, 25, 28].map((d) => (
                    <option key={d} value={d}>
                      Ngày {d} hằng tháng
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Ngày giải ngân & Quy tắc làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Ngày giải ngân
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={disbursementDate}
                  onChange={(e) => setDisbursementDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">
                Quy tắc làm tròn
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="roundThousand"
                  checked={roundToThousand}
                  onChange={(e) => setRoundToThousand(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="roundThousand" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Làm tròn đến 1.000 đồng (điều chỉnh kỳ cuối)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tổng quan kỳ đầu & Nút "Xem chi tiết" (PDF 3 step 2) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="border-b border-indigo-800/80 pb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-300">
                Ước tính thanh toán
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                {totalPeriods} kỳ trả nợ
              </span>
            </div>

            {/* First period payment */}
            {firstPeriod && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-200 font-medium">
                    Số tiền trả kỳ đầu ({firstPeriod.dueDate})
                  </span>
                  <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                    Kỳ trả cao nhất
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                  {firstPeriod.totalPayment.toLocaleString('vi-VN')}
                  <span className="text-lg font-normal text-amber-200 ml-1.5">VND</span>
                </div>
                <div className="text-[11px] text-indigo-200 flex items-center gap-2 pt-1">
                  <span>Gốc: {firstPeriod.principal.toLocaleString('vi-VN')} đ</span>
                  <span>+</span>
                  <span>Lãi: {firstPeriod.interest.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            )}

            {/* Total Interest & Total Balance */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-200">Tổng lãi phải trả:</span>
                <span className="font-bold text-amber-300 text-sm">
                  {scheduleData.totalInterest.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-white/10">
                <span className="text-indigo-200">Tổng gốc + lãi:</span>
                <span className="font-extrabold text-white text-base">
                  {scheduleData.totalPayment.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>

            {/* Button "Xem chi tiết" (Strictly required in Step 2 of PDF 3) */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-extrabold text-sm sm:text-base shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-98"
            >
              <Table className="w-5 h-5 text-amber-950" />
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Principle Note card */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 space-y-2.5 text-xs text-blue-900">
            <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
              <Info className="w-4 h-4 text-blue-600" />
              Quy tắc tính toán theo quy chuẩn ngân hàng
            </h4>
            <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
              <li>Lãi tính trên dư nợ thực tế đầu mỗi kỳ</li>
              <li>Số tiền trả giảm dần theo thời gian, giảm áp lực tài chính</li>
              <li>Chênh lệch làm tròn được tự động bù trừ vào kỳ cuối</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL: Bảng tính lịch trả nợ với dư nợ giảm dần (Strictly per Step 2 PDF 3) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Khoản vay: {loanAmount.toLocaleString('vi-VN')} VND • Lãi suất: {annualRate}%/năm • {tenureMonths} tháng
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 text-xs flex items-center gap-1 transition"
                  title="In lịch trả nợ"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">In lịch</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Table */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs sm:text-sm text-left text-slate-700">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-3 text-center">Kỳ</th>
                      <th className="px-3.5 py-3">Ngày trả nợ</th>
                      <th className="px-3.5 py-3 text-right">Dư nợ đầu kỳ</th>
                      <th className="px-3.5 py-3 text-right">Gốc trả</th>
                      <th className="px-3.5 py-3 text-right">Lãi trả</th>
                      <th className="px-3.5 py-3 text-right">Tổng thanh toán</th>
                      <th className="px-3.5 py-3 text-right">Dư nợ còn lại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduleData.rows.map((row) => (
                      <tr
                        key={row.period}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          row.period % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="px-3.5 py-2.5 text-center font-bold text-slate-500">
                          {row.period}
                        </td>
                        <td className="px-3.5 py-2.5 font-medium whitespace-nowrap">
                          {row.dueDate}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-slate-600">
                          {row.beginningBalance.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-blue-700">
                          {row.principal.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-amber-700">
                          {row.interest.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-900">
                          {row.totalPayment.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-slate-500">
                          {row.endingBalance.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Summary Totals Footer Row strictly per PDF 3 */}
                  <tfoot className="bg-slate-900 text-white font-bold text-xs sm:text-sm">
                    <tr>
                      <td colSpan={3} className="px-3.5 py-3 text-center uppercase tracking-wider">
                        TỔNG CỘNG
                      </td>
                      <td className="px-3.5 py-3 text-right font-mono text-cyan-300">
                        {scheduleData.totalPrincipal.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-3.5 py-3 text-right font-mono text-amber-400">
                        {scheduleData.totalInterest.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-3.5 py-3 text-right font-mono text-emerald-400 font-extrabold">
                        {scheduleData.totalPayment.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-3.5 py-3 text-right font-mono text-slate-400">
                        0 VND
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}

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
