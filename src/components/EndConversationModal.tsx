import React from 'react';
import { Heart, Sparkles, X, RotateCcw, CheckCircle } from 'lucide-react';
import contentData from '../data/contentData.json';

interface EndConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const EndConversationModal: React.FC<EndConversationModalProps> = ({
  isOpen,
  onClose,
  onRestart,
}) => {
  if (!isOpen) return null;

  const { bank } = contentData;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* VietinBank Thank You Icon & Badge */}
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-9 h-9 fill-current text-red-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            VietinBank Trân Trọng Cảm Ơn
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kính Chúc Quý Khách
          </h3>
        </div>

        {/* The Exact Sentence strictly required in PDF 1:
            "Cảm ơn Quý khách đã sử dụng dịch vụ của VietinBank. Chúc Quý khách một ngày tốt lành!" */}
        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-slate-800 font-semibold text-sm sm:text-base leading-relaxed">
          “{bank.farewell}”
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bắt đầu phiên giao dịch mới</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
