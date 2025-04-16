export type ProductCategory = 
  | 'accounts' 
  | 'cards' 
  | 'loans' 
  | 'investments' 
  | 'insurance';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface FinancialProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  interestRate?: number; // Optional, as not all products have interest rates
  annualFee?: number; // Optional, for cards and some accounts
  minimumBalance?: number; // Optional, for accounts and investments
  riskLevel?: RiskLevel; // Optional, mainly for investments
  benefits: string[];
  imageUrl: string;
  isPromoted?: boolean;
  createdAt: string;
}

export interface ProductFilterProps {
  activeCategory: ProductCategory | 'all';
  setActiveCategory: (category: ProductCategory | 'all') => void;
} 