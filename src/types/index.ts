export interface BankAdvisor {
  name: string;
  role: string;
  phone: string;
  tel: string;
}

export interface BankInfo {
  name: string;
  shortName: string;
  slogan: string;
  hotline: string;
  logoUrl: string;
  advisor: BankAdvisor;
  greeting: string;
  farewell: string;
  unresolvedResponse: string;
}

export interface AppModuleItem {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  badge: string;
  icon: string;
  color: string;
}

export interface FaqStep {
  step: number;
  text: string;
  image: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  youtubeId: string;
  steps: FaqStep[];
}

export interface DepositTerm {
  months: number;
  label: string;
  rate: number;
}

export interface RepaymentCycle {
  id: string;
  name: string;
  divisor: number;
  monthsStep: number;
}

export interface LoanScheduleRow {
  period: number;
  dueDate: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export interface FeaturedProduct {
  id: string;
  category: string;
  title: string;
  badge: string;
  desc: string;
  imageUrl: string;
}

export interface OfficeLocation {
  id: string;
  type: string;
  name: string;
  address: string;
  hotline: string;
  imageUrl: string;
  mapUrl: string;
}

export interface ContentData {
  bank: BankInfo;
  modules: AppModuleItem[];
  faq: {
    question: string;
    categories: FaqCategory[];
  };
  appIpay: {
    title: string;
    subtitle: string;
    ios: {
      name: string;
      url: string;
      qrUrl: string;
    };
    android: {
      name: string;
      url: string;
      qrUrl: string;
    };
    features: string[];
  };
  game: {
    title: string;
    description: string;
    winScore: number;
    rewardText: string;
    brandName: string;
    instruction: string;
    note: string;
    encouragements: Record<string, string>;
  };
  deposit: {
    title: string;
    subtitle: string;
    minAmount: number;
    minAmountFormatted: string;
    maxRate: number;
    defaultAmount: number;
    defaultTermMonths: number;
    terms: DepositTerm[];
    tiktokVideoUrl: string;
    formulaDescription: string;
  };
  loan: {
    title: string;
    subtitle: string;
    defaultAmount: number;
    defaultTenureMonths: number;
    defaultAnnualRate: number;
    defaultDisbursementDate: string;
    defaultDueDay: number;
    cycles: RepaymentCycle[];
    principles: string[];
  };
  featured: {
    title: string;
    description: string;
    buttonLabel: string;
    consultPrompt: string;
    categories: string[];
    items: FeaturedProduct[];
  };
  branches: {
    title: string;
    subtitle: string;
    workingHours: {
      weekdays: string;
      weekend: string;
    };
    selectedBranch: string;
    majorBranches: string[];
    offices: OfficeLocation[];
  };
}

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}
