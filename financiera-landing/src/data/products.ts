import { FinancialProduct } from '@/types';

const products: FinancialProduct[] = [
  {
    id: '1',
    name: 'Cuenta de Ahorro Premium',
    description: 'Cuenta de ahorro con alta rentabilidad y beneficios exclusivos para clientes premium.',
    category: 'accounts',
    interestRate: 2.5,
    minimumBalance: 1000,
    benefits: [
      'Sin comisión de mantenimiento con saldo mínimo',
      'Tarjeta de débito sin costo anual',
      'Retiros ilimitados en cajeros propios',
      'Banca en línea 24/7'
    ],
    imageUrl: '/images/products/savings-account.jpg',
    isPromoted: true,
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Cuenta Corriente Digital',
    description: 'Cuenta corriente 100% digital para gestionar tus finanzas sin visitar sucursales.',
    category: 'accounts',
    interestRate: 0.5,
    benefits: [
      'Sin comisión de apertura',
      'App móvil con funcionalidades avanzadas',
      'Transferencias gratuitas',
      'Alertas de movimientos en tiempo real'
    ],
    imageUrl: '/images/products/checking-account.jpg',
    createdAt: '2023-02-10',
  },
  {
    id: '3',
    name: 'Tarjeta de Crédito Oro',
    description: 'Tarjeta de crédito con amplios beneficios y programa de recompensas exclusivo.',
    category: 'cards',
    annualFee: 120,
    benefits: [
      'Acumulación de puntos en todas tus compras',
      'Seguro de viaje gratuito',
      'Acceso a salas VIP en aeropuertos',
      'Descuentos en establecimientos seleccionados'
    ],
    imageUrl: '/images/products/gold-card.jpg',
    isPromoted: true,
    createdAt: '2023-03-05',
  },
  {
    id: '4',
    name: 'Tarjeta de Crédito Platinum',
    description: 'Nuestra tarjeta más exclusiva con beneficios premium y límites elevados.',
    category: 'cards',
    annualFee: 250,
    benefits: [
      'Concierge personal 24/7',
      'Acumulación de puntos x2 en todas tus compras',
      'Seguro médico internacional',
      'Experiencias exclusivas en gastronomía y entretenimiento'
    ],
    imageUrl: '/images/products/platinum-card.jpg',
    createdAt: '2023-03-15',
  },
  {
    id: '5',
    name: 'Préstamo Personal Flexible',
    description: 'Préstamo personal con condiciones adaptadas a tus necesidades financieras.',
    category: 'loans',
    interestRate: 9.99,
    benefits: [
      'Aprobación en 24 horas',
      'Sin penalización por cancelación anticipada',
      'Plazos flexibles de 12 a 60 meses',
      'Monto desde $1,000 hasta $50,000'
    ],
    imageUrl: '/images/products/personal-loan.jpg',
    createdAt: '2023-04-01',
  },
  {
    id: '6',
    name: 'Préstamo Hipotecario',
    description: 'La mejor opción para financiar la compra de tu vivienda con condiciones competitivas.',
    category: 'loans',
    interestRate: 6.5,
    benefits: [
      'Financiación de hasta el 80% del valor del inmueble',
      'Plazos de hasta 30 años',
      'Cuota fija durante toda la vida del préstamo',
      'Asesoramiento personalizado'
    ],
    imageUrl: '/images/products/mortgage.jpg',
    isPromoted: true,
    createdAt: '2023-04-20',
  },
  {
    id: '7',
    name: 'Fondo de Inversión Conservador',
    description: 'Fondo de inversión con perfil de riesgo bajo para inversores cautelosos.',
    category: 'investments',
    riskLevel: 'low',
    minimumBalance: 500,
    benefits: [
      'Diversificación en activos de renta fija',
      'Liquidez inmediata',
      'Rebalanceo automático de cartera',
      'Informes trimestrales detallados'
    ],
    imageUrl: '/images/products/conservative-fund.jpg',
    createdAt: '2023-05-10',
  },
  {
    id: '8',
    name: 'Fondo de Inversión Balanceado',
    description: 'Equilibrio perfecto entre riesgo y rentabilidad para inversores moderados.',
    category: 'investments',
    riskLevel: 'medium',
    minimumBalance: 1000,
    benefits: [
      'Diversificación en renta fija y variable',
      'Ajustes tácticos según condiciones de mercado',
      'Asesoramiento personalizado',
      'Acceso a informes de mercado exclusivos'
    ],
    imageUrl: '/images/products/balanced-fund.jpg',
    createdAt: '2023-05-20',
  },
  {
    id: '9',
    name: 'Fondo de Inversión Crecimiento',
    description: 'Fondo orientado al crecimiento a largo plazo para inversores con mayor tolerancia al riesgo.',
    category: 'investments',
    riskLevel: 'high',
    minimumBalance: 2500,
    benefits: [
      'Mayor exposición a renta variable',
      'Gestión activa de la cartera',
      'Acceso a mercados internacionales',
      'Potencial de rentabilidad superior'
    ],
    imageUrl: '/images/products/growth-fund.jpg',
    isPromoted: true,
    createdAt: '2023-06-01',
  },
  {
    id: '10',
    name: 'Seguro de Vida',
    description: 'Protección financiera para ti y tu familia ante situaciones inesperadas.',
    category: 'insurance',
    benefits: [
      'Cobertura por fallecimiento e invalidez',
      'Opciones de capital asegurado flexibles',
      'Trámites simplificados para beneficiarios',
      'Posibilidad de incluir coberturas adicionales'
    ],
    imageUrl: '/images/products/life-insurance.jpg',
    createdAt: '2023-06-15',
  },
  {
    id: '11',
    name: 'Seguro de Hogar',
    description: 'Protección integral para tu vivienda y contenido contra múltiples riesgos.',
    category: 'insurance',
    benefits: [
      'Cobertura contra incendio, robo y desastres naturales',
      'Asistencia domiciliaria 24/7',
      'Responsabilidad civil familiar',
      'Reposición a nuevo de bienes dañados'
    ],
    imageUrl: '/images/products/home-insurance.jpg',
    createdAt: '2023-06-30',
  },
  {
    id: '12',
    name: 'Seguro de Salud',
    description: 'Plan de salud completo con amplia cobertura médica nacional e internacional.',
    category: 'insurance',
    benefits: [
      'Consultas médicas y especialistas',
      'Hospitalización y cirugías',
      'Cobertura farmacéutica',
      'Chequeos preventivos anuales'
    ],
    imageUrl: '/images/products/health-insurance.jpg',
    isPromoted: true,
    createdAt: '2023-07-10',
  },
];

export default products; 