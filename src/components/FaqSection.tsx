import React, { useState } from 'react';
import {
  KeyRound,
  CreditCard,
  Fingerprint,
  ScanFace,
  ChevronRight,
  ExternalLink,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Phone,
  MessageSquareX,
  CheckCircle2,
  Maximize2,
  X,
  HelpCircle,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FaqCategory } from '../types';

interface FaqSectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const { faq, bank } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [feedbackGiven, setFeedbackGiven] = useState<'success' | 'unresolved' | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return <KeyRound className="w-6 h-6 text-amber-600" />;
      case 'close-card':
        return <CreditCard className="w-6 h-6 text-rose-600" />;
      case 'verify-chip-cccd':
        return <Fingerprint className="w-6 h-6 text-blue-600" />;
      case 'update-biometric':
        return <ScanFace className="w-6 h-6 text-emerald-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleSelectCategory = (cat: FaqCategory) => {
    setSelectedCategory(cat);
    setActiveStepIndex(0);
    setFeedbackGiven(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFaq = () => {
    setSelectedCategory(null);
    setActiveStepIndex(0);
    setFeedbackGiven(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* If no category is selected, show question and 4 cards */}
      {!selectedCategory ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Question */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              Cấu phần 1 • Hỗ trợ tại quầy
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {faq.question}
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Chạm chọn một trong 4 chủ đề thường gặp nhất dưới đây để xem hướng dẫn từng bước trực quan kèm hình ảnh và video.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {faq.categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-500/60 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      {getCategoryIcon(category.id)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                      Mục 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>{category.steps.length} bước hướng dẫn chi tiết</span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
            >
              Quay lại menu chính
            </button>
            <button
              onClick={onOpenEndDialog}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition flex items-center justify-center gap-1.5"
            >
              <MessageSquareX className="w-4 h-4 text-rose-600" />
              Kết thúc cuộc trò chuyện
            </button>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step Guide for Selected Category */
        <div className="space-y-8 animate-fadeIn">
          {/* Top Bar with Back button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <button
              onClick={handleResetFaq}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Chọn câu hỏi khác
            </button>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              {selectedCategory.title}
            </span>
          </div>

          {/* Guide Title & Video Link */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-200 bg-blue-800/60 px-2.5 py-1 rounded">
                  Quy trình chuẩn VietinBank iPay
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-2 text-white">
                  {selectedCategory.title}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Video Link */}
              <a
                href={selectedCategory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 shrink-0"
              >
                <Youtube className="w-5 h-5 text-white" />
                <span>Xem Video trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Steps Stepper Tabs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Các bước thực hiện (Bước {activeStepIndex + 1}/{selectedCategory.steps.length})
              </h3>
              <div className="flex items-center space-x-1">
                {selectedCategory.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStepIndex(i)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all ${
                      activeStepIndex === i
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Step Showcase */}
            {(() => {
              const currentStep = selectedCategory.steps[activeStepIndex];
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                  {/* Step Text Info */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Bước {currentStep.step} / {selectedCategory.steps.length}
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5">
                      <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {currentStep.text}
                      </p>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeStepIndex === 0}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        Bước trước
                      </button>
                      <button
                        onClick={() =>
                          setActiveStepIndex((prev) =>
                            Math.min(selectedCategory.steps.length - 1, prev + 1)
                          )
                        }
                        disabled={activeStepIndex === selectedCategory.steps.length - 1}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
                      >
                        Bước kế tiếp
                      </button>
                    </div>
                  </div>

                  {/* Step Image */}
                  <div className="md:col-span-6 flex flex-col items-center">
                    <div
                      onClick={() => setPreviewImage(currentStep.image)}
                      className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md cursor-pointer max-w-xs sm:max-w-sm w-full transition-transform hover:scale-101"
                      title="Nhấn để phóng to ảnh"
                    >
                      <img
                        src={currentStep.image}
                        alt={`Hình minh họa bước ${currentStep.step}`}
                        className="w-full h-auto max-h-[380px] object-contain mx-auto bg-slate-950"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.img-error-badge') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="img-error-badge hidden h-48 items-center justify-center text-xs text-slate-300 p-4 text-center">
                        Hình ảnh minh họa bước {currentStep.step}
                      </div>

                      <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                        <Maximize2 className="w-4 h-4" />
                        <span>Xem kích thước lớn</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">
                      Ảnh minh họa bước {currentStep.step} (Chạm để phóng to)
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* All Steps Mini Gallery */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Toàn bộ các bước minh họa
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {selectedCategory.steps.map((st, i) => (
                <div
                  key={st.step}
                  onClick={() => setActiveStepIndex(i)}
                  className={`bg-white rounded-xl p-2 border cursor-pointer transition-all ${
                    activeStepIndex === i
                      ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="h-24 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={st.image}
                      alt={`Bước ${st.step}`}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-center mt-1 text-slate-700">
                    Bước {st.step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Satisfaction Feedback Section (Strictly per PDF 1) */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Anh/chị đã thực hiện ổn hay chưa?
            </h3>

            {feedbackGiven === null ? (
              <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => {
                    setFeedbackGiven('success');
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-xs transition active:scale-95"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Đã ổn (Quay lại Menu)</span>
                </button>

                <button
                  onClick={() => setFeedbackGiven('unresolved')}
                  className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-sm px-6 py-3 rounded-xl transition active:scale-95"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Chưa ổn (Cần hỗ trợ)</span>
                </button>
              </div>
            ) : feedbackGiven === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 max-w-lg mx-auto space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-semibold text-emerald-800">
                  Rất vui vì đã hỗ trợ được Quý khách thành công!
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={onBackToHome}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Quay lại menu chính
                  </button>
                </div>
              </div>
            ) : (
              /* When user says "Chưa ổn" - strictly display the requested advisor message */
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                    !
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                      {bank.unresolvedResponse}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={bank.advisor.tel}
                        className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition"
                      >
                        <Phone className="w-4 h-4 animate-bounce" />
                        <span>Gọi Chuyên viên {bank.advisor.name} ({bank.advisor.phone})</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom 2 Actions Required: "Quay lại menu chính" & "Kết thúc cuộc trò chuyện" */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
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
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl p-2 border border-slate-700 shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Ảnh phóng to"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
            <p className="text-slate-300 text-xs mt-2">
              Nhấn bất kỳ đâu để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
