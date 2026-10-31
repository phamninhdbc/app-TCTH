import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { FaqSection } from './components/FaqSection';
import { AppIpaySection } from './components/AppIpaySection';
import { GameSection } from './components/GameSection';
import { DepositSection } from './components/DepositSection';
import { LoanSection } from './components/LoanSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchSection } from './components/BranchSection';
import { EndConversationModal } from './components/EndConversationModal';
import contentData from './data/contentData.json';
import { Phone, Shield, Building, Heart } from 'lucide-react';

export default function App() {
  const [currentModule, setCurrentModule] = useState<string>('home');
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);

  const handleSelectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentModule('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* VietinBank Applet Header */}
      <Header
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        onOpenEndDialog={() => setIsEndModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentModule === 'home' && (
          <HomeHero
            onSelectModule={handleSelectModule}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'faq' && (
          <FaqSection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'app-ipay' && (
          <AppIpaySection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'game' && (
          <GameSection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'deposit' && (
          <DepositSection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'loan' && (
          <LoanSection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'featured' && (
          <FeaturedProductsSection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}

        {currentModule === 'branches' && (
          <BranchSection
            onBackToHome={() => handleSelectModule('home')}
            onOpenEndDialog={() => setIsEndModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-white text-base tracking-wide">
                <span className="text-red-500">Vietin</span>Bank
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">
                {contentData.bank.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                Tổng đài CSKH: <strong>{contentData.bank.hotline}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Tư vấn viên: <strong>{contentData.bank.advisor.name} ({contentData.bank.advisor.phone})</strong>
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} VietinBank. Cổng thông tin và tiện ích tương tác tại quầy giao dịch.</p>
            <p>Trụ sở chính: 108 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội | Chi nhánh Bắc Ninh: 31 Nguyễn Đăng Đạo</p>
          </div>
        </div>
      </footer>

      {/* End Conversation Modal */}
      <EndConversationModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onRestart={handleRestart}
      />
    </div>
  );
}
