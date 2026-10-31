import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  Phone,
  ShieldCheck,
  Star,
  Gift,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { AppModuleItem } from '../types';

interface HomeHeroProps {
  onSelectModule: (moduleId: string) => void;
  onOpenEndDialog: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectModule,
  onOpenEndDialog,
}) => {
  const { bank, modules } = contentData;
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // GSAP entrance stagger animation for cards
    if (cardsContainerRef.current) {
      gsap.fromTo(
        cardsContainerRef.current.children,
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return <HelpCircle className="w-7 h-7 text-blue-600" />;
      case 'app-ipay':
        return <Smartphone className="w-7 h-7 text-sky-600" />;
      case 'game':
        return <Gamepad2 className="w-7 h-7 text-amber-500" />;
      case 'deposit':
        return <PiggyBank className="w-7 h-7 text-emerald-600" />;
      case 'loan':
        return <Calculator className="w-7 h-7 text-indigo-600" />;
      case 'featured':
        return <Sparkles className="w-7 h-7 text-rose-600" />;
      case 'branches':
        return <MapPin className="w-7 h-7 text-teal-600" />;
      default:
        return <Star className="w-7 h-7 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border-b-4 border-red-600">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-600 text-white text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-sm">
                VietinBank Kiosk
              </span>
              <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                Chi nhánh Bắc Ninh & Hệ thống toàn quốc
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Chào mừng Quý khách đến với Quầy Giao Dịch VietinBank
            </h1>

            <p className="text-xs sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              Trải nghiệm các tiện ích số tương tác thông minh: tra cứu giải đáp thắc mắc, tính toán tiền gửi và lịch trả nợ vay, cài đặt iPay, thử thách game nhận voucher 2 lít xăng và mạng lưới điểm giao dịch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectModule('faq')}
                className="px-6 py-3 rounded-2xl bg-white text-blue-950 font-bold text-xs sm:text-sm hover:bg-blue-50 transition shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Bắt đầu tra cứu</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectModule('game')}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm transition shadow-md active:scale-95 flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Chơi Game nhận Voucher</span>
              </button>
            </div>
          </div>

          {/* Quick Advisor Contact Card right on Hero */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-white space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wide">
                  Hỗ trợ trực tiếp tại quầy
                </span>
                <h4 className="font-bold text-sm sm:text-base">{bank.advisor.name}</h4>
                <p className="text-[11px] text-blue-200">{bank.advisor.role}</p>
              </div>
            </div>

            <p className="text-xs text-blue-100 leading-snug">
              Cần hỗ trợ bất kỳ thủ tục giao dịch nào tại quầy, Quý khách hãy liên hệ ngay với chuyên viên trực quầy.
            </p>

            <a
              href={bank.advisor.tel}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition active:scale-98 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>Hotline tư vấn: {bank.advisor.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 7 Modules Grid Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              7 Tiện Ích Tương Tác Dành Cho Khách Hàng
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chạm chọn tính năng mong muốn bên dưới để thực hiện nhanh chóng
            </p>
          </div>
        </div>
      </div>

      {/* 7 Feature Modules Grid */}
      <div
        ref={cardsContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => onSelectModule(mod.id)}
            className={`group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 hover:border-blue-600/70 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              mod.id === 'featured' ? 'border-red-300/60 ring-2 ring-red-500/10' : ''
            }`}
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-120 transition-transform"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300 shadow-xs">
                  {getModuleIcon(mod.id)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      mod.badge === 'Có quà tặng'
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : mod.badge === 'Nổi bật'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {mod.badge}
                  </span>
                  <span className="text-xs font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                    0{mod.number}
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                {mod.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {mod.shortDesc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
              <span>Trải nghiệm ngay</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Promotion Banner (per PDF 5 overview requirements) */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Sản phẩm dịch vụ nổi bật tại quầy
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Khám phá các sản phẩm, ưu đãi và tiện ích VietinBank đang được giới thiệu tại chi nhánh
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Tài khoản hộ kinh doanh số đẹp, chạm POS rút tiền mặt không cần thẻ, dịch vụ thu hộ doanh nghiệp và danh mục tài sản bảo đảm đấu giá công khai.
          </p>
        </div>

        <button
          onClick={() => onSelectModule('featured')}
          className="shrink-0 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          <span>Xem ngay</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
