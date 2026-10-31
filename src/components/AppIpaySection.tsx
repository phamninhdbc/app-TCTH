import React from 'react';
import { Smartphone, Apple, Play, ArrowLeft, MessageSquareX, CheckCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import contentData from '../data/contentData.json';

interface AppIpaySectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

export const AppIpaySection: React.FC<AppIpaySectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const { appIpay } = contentData;

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
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
          Cấu phần 2 • VietinBank iPay Mobile
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-blue-700/60 border border-blue-400/30 text-blue-200 text-xs px-3 py-1 rounded-full font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            Ứng dụng Ngân hàng số thế hệ mới
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {appIpay.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {appIpay.subtitle}. Quý khách vui lòng dùng camera điện thoại quét mã QR bên dưới để tải và kích hoạt nhanh chóng ngay tại quầy giao dịch.
          </p>
        </div>
      </div>

      {/* QR Codes & Download Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-lg transition-all flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
            <Apple className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
            Hệ điều hành iOS
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            VietinBank iPay trên iPhone / iPad
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Dành cho thiết bị Apple iOS từ App Store Việt Nam
          </p>

          {/* QR Code Container */}
          <div className="relative p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner mb-6">
            <img
              src={appIpay.ios.qrUrl}
              alt="Mã QR tải App VietinBank iPay trên iOS"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
            />
            <div className="absolute inset-x-0 bottom-1 flex justify-center">
              <span className="bg-slate-900/80 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Quét bằng Camera iPhone
              </span>
            </div>
          </div>

          <a
            href={appIpay.ios.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
          >
            <Apple className="w-5 h-5" />
            <span>Mở App Store tải ngay</span>
          </a>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
            <Play className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            Hệ điều hành Android
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            VietinBank iPay trên Android
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Dành cho điện thoại Samsung, Xiaomi, Oppo,... trên Google Play
          </p>

          {/* QR Code Container */}
          <div className="relative p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner mb-6">
            <img
              src={appIpay.android.qrUrl}
              alt="Mã QR tải App VietinBank iPay trên Android"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
            />
            <div className="absolute inset-x-0 bottom-1 flex justify-center">
              <span className="bg-emerald-800/80 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Quét bằng Camera Android
              </span>
            </div>
          </div>

          <a
            href={appIpay.android.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Mở Google Play tải ngay</span>
          </a>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Đặc quyền và tiện ích nổi bật trên VietinBank iPay Mobile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {appIpay.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Counter Assistance Callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm sm:text-base">
              Cần hỗ trợ kích hoạt trực tiếp tại quầy?
            </h4>
            <p className="text-xs sm:text-sm text-blue-700">
              Giao dịch viên VietinBank sẽ hướng dẫn Quý khách đăng ký dịch vụ, xác thực sinh trắc học chỉ trong 2 phút!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToHome}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition"
          >
            Quay lại menu chính
          </button>
          <button
            onClick={onOpenEndDialog}
            className="px-5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <MessageSquareX className="w-4 h-4 text-rose-600" />
            Kết thúc cuộc trò chuyện
          </button>
        </div>
      </div>
    </div>
  );
};
