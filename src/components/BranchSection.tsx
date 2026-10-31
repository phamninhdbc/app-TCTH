import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Search,
  Building,
  Navigation,
  ArrowLeft,
  MessageSquareX,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { OfficeLocation } from '../types';

interface BranchSectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

export const BranchSection: React.FC<BranchSectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const { branches } = contentData;
  const [selectedBranch, setSelectedBranch] = useState<string>('Bắc Ninh');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter offices for current view
  const offices = branches.offices.filter(
    (off) =>
      off.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Về menu chính
        </button>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          Cấu phần 7 • Mạng lưới phòng giao dịch
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
          <MapPin className="w-4 h-4 text-teal-700" />
          Mạng lưới 155 Chi nhánh toàn quốc
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {branches.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {branches.subtitle}. Tra cứu nhanh địa chỉ, chỉ đường qua Google Maps và gọi hotline trực tiếp.
        </p>
      </div>

      {/* Working Hours Card (strictly per PDF 4) */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Thời gian phục vụ giao dịch tại quầy
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              {branches.workingHours.weekdays}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-red-600/80 border border-red-400/40 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          <span>{branches.workingHours.weekend}</span>
        </div>
      </div>

      {/* Branch Selection Toolbar (strictly per PDF 4: Bắc Đà Nẵng, Hội An, TP.HCM, Bình Dương, Bắc Ninh...) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chọn chi nhánh trong hệ thống
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {branches.majorBranches.map((br) => (
                <button
                  key={br}
                  onClick={() => setSelectedBranch(br)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    selectedBranch === br
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>

          {/* Search box within selected branch */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên PGD hoặc địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Đang hiển thị danh sách phòng giao dịch thuộc: <strong className="text-blue-900">{selectedBranch}</strong>
          </span>
          <span>{offices.length} điểm giao dịch</span>
        </div>
      </div>

      {/* Offices Grid (8 locations in Bac Ninh per PDF 4 with Photo, Map Link with icon, and Hotline Call) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offices.map((office, idx) => (
          <div
            key={office.id}
            className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Office Image */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img
                src={office.imageUrl}
                alt={office.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://pub-8db548912e6649bbabeb3b571024571e.r2.dev/Anh-CN/Bac-Ninh/Tru-so.jpg';
                }}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  #{idx + 1} • {office.type}
                </span>
              </div>
            </div>

            {/* Office Information */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {office.name}
                </h3>

                {/* Address + Google Maps Icon & Link */}
                <div className="mt-3 flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{office.address}</p>
                </div>
              </div>

              {/* Action Buttons: Hotline Click-to-Call & Google Maps Link (Strictly per PDF 4) */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Hotline call button */}
                <a
                  href={`tel:${office.hotline}`}
                  className="py-2.5 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-blue-200 shadow-2xs"
                  title="Nhấn để gọi ngay hotline phòng giao dịch"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hotline: {office.hotline}</span>
                </a>

                {/* Google Maps link with Maps icon */}
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                  title="Xem chỉ đường trên Google Maps"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
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
