import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowLeft,
  MessageSquareX,
  CheckCircle,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FeaturedProduct } from '../types';

interface FeaturedProductsSectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const { featured, bank } = contentData;
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);
  const [showInterestModal, setShowInterestModal] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Filter products by chip
  const filteredProducts = activeCategory === 'Tất cả'
    ? featured.items
    : featured.items.filter((item) => item.category === activeCategory);

  const handleInterestClick = (product: FeaturedProduct) => {
    setSelectedProduct(product);
    setShowInterestModal(true);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? featured.items.length - 1 : prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev === featured.items.length - 1 ? 0 : prev + 1));
  };

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
        <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          Cấu phần 6 • Dịch vụ tiêu biểu
        </span>
      </div>

      {/* Hero Header with subtle gradient & thin red border per PDF 5 */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg border-2 border-red-500/40 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            Nổi bật tại quầy giao dịch
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {featured.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {featured.description}
          </p>
        </div>
      </div>

      {/* Featured Poster Carousel (per PDF 5 recommendation: "Nên dùng chế độ hiển thị Poster dạng carousel để hấp dẫn hơn") */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Tiêu điểm sản phẩm (Carousel)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCarousel}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-500">
              {carouselIndex + 1} / {featured.items.length}
            </span>
            <button
              onClick={handleNextCarousel}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Active Item Card */}
        {(() => {
          const item = featured.items[carouselIndex];
          return (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleInterestClick(item)}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Tôi quan tâm</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md max-w-xs w-full bg-white">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto max-h-[280px] object-contain mx-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://pub-8db548912e6649bbabeb3b571024571e.r2.dev/Anh-CN/Bac-Ninh/Tru-so.jpg';
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Filter Chips (strictly per PDF 5: Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi | Thông tin bán đấu giá tài sản bảo đảm) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            Khám phá danh mục dịch vụ
          </h3>
          <span className="text-xs text-slate-500">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {featured.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-red-400/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Poster Image */}
            <div className="relative bg-slate-900 h-64 overflow-hidden flex items-center justify-center p-2">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://pub-8db548912e6649bbabeb3b571024571e.r2.dev/Anh-CN/Bac-Ninh/Tru-so.jpg';
                }}
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-blue-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Poster Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {product.badge}
                </span>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors mt-2">
                  {product.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                  {product.desc}
                </p>
              </div>

              {/* Nút "Tôi quan tâm" strictly per PDF 5 */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleInterestClick(product)}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Khi bấm "Tôi quan tâm" (Strictly per text instructions in PDF 5) */}
      {showInterestModal && selectedProduct && (
        <div
          onClick={() => setShowInterestModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-fadeIn relative"
          >
            <button
              onClick={() => setShowInterestModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                {selectedProduct.title}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Thông tin tư vấn dành cho Quý khách
              </h3>
            </div>

            {/* Prompt text strictly required in PDF 5 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <p className="font-medium">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <p className="font-semibold text-blue-900 border-t border-slate-200 pt-2.5">
                Hoặc liên hệ Chuyên viên tư vấn {bank.advisor.name} – {bank.advisor.phone}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={bank.advisor.tel}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Gọi Chuyên viên {bank.advisor.phone}</span>
              </a>

              <button
                onClick={() => setShowInterestModal(false)}
                className="py-3 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition"
              >
                Đã hiểu
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
