import React, { useState, useEffect } from 'react';
import { Phone, Clock, MessageSquareX, Sparkles, Building2 } from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeaderProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  onOpenEndDialog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  onOpenEndDialog,
}) => {
  const { bank } = contentData;
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo VietinBank & Bank Info */}
          <div
            onClick={() => onSelectModule('home')}
            className="flex items-center space-x-3 cursor-pointer group transition-transform active:scale-98"
            title="Về trang chủ VietinBank"
          >
            <div className="h-12 flex items-center justify-center p-1 bg-white rounded-lg">
              <img
                src={bank.logoUrl}
                alt="VietinBank Logo"
                className="h-9 sm:h-11 object-contain transition-transform group-hover:scale-102"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="logo-fallback hidden items-center space-x-2 font-bold text-xl text-blue-800">
                <span className="text-red-600">Vietin</span>Bank
              </div>
            </div>

            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  Kiosk Quầy Giao Dịch
                </span>
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  Sẵn sàng phục vụ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{bank.slogan}</p>
            </div>
          </div>

          {/* Center Info: Live Clock & Branch notice */}
          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-600 bg-slate-50/80 border border-slate-200/80 px-3.5 py-1.5 rounded-full">
            <div className="flex items-center space-x-1 text-slate-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentTime}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1 text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-red-600" />
              <span>CN Bắc Ninh & 155 Chi nhánh</span>
            </div>
          </div>

          {/* Action Area: Hotline Advisor & End Conversation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href={bank.advisor.tel}
              className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-blue-200 shadow-xs"
              title="Gọi ngay chuyên viên tư vấn"
            >
              <Phone className="w-4 h-4 text-blue-600 animate-bounce" />
              <div className="hidden lg:block text-left leading-tight">
                <div className="text-[10px] text-blue-500 uppercase font-medium">Tư vấn viên</div>
                <div className="font-bold">{bank.advisor.name}</div>
              </div>
              <span className="lg:hidden font-bold">{bank.advisor.phone}</span>
            </a>

            <button
              onClick={onOpenEndDialog}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-rose-200 shadow-xs active:scale-95"
              title="Kết thúc cuộc trò chuyện và làm mới"
            >
              <MessageSquareX className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Kết thúc trò chuyện</span>
              <span className="sm:hidden">Kết thúc</span>
            </button>
          </div>
        </div>

        {/* Quick Tabs Bar */}
        <div className="flex items-center space-x-2 py-2 overflow-x-auto no-scrollbar text-xs font-medium border-t border-slate-100">
          <button
            onClick={() => onSelectModule('home')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
              currentModule === 'home'
                ? 'bg-blue-700 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trang chủ quầy
          </button>
          {contentData.modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                currentModule === mod.id
                  ? 'bg-blue-700 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{mod.number}. {mod.title}</span>
              {mod.badge === 'Có quà tặng' && (
                <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                  Quà
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
