export type SubscriptionPlan = 'monthly' | 'quarterly' | 'annual'

export type PaymentStatus = 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete'

export interface PricingTier {
  id: SubscriptionPlan
  name: string
  description: string
  price: number // Price in euros
  originalPrice: number // Original monthly equivalent
  discount: number // Discount percentage
  billingCycle: string
  features: string[]
  popular: boolean
  savings: number // Annual savings in euros
}

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: PaymentStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethod {
  id: string
  userId: string
  type: 'card' | 'sepa' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: Date
}

export interface Invoice {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  invoiceDate: Date
  dueDate: Date
  paidAt?: Date
  downloadUrl?: string
  description: string
}

export interface BillingHistory {
  invoices: Invoice[]
  totalPaid: number
  nextPayment?: {
    amount: number
    date: Date
    description: string
  }
}

// Base price: 30€/month
const BASE_MONTHLY_PRICE = 30

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'monthly',
    name: 'Mensuel',
    description: 'Parfait pour commencer',
    price: BASE_MONTHLY_PRICE,
    originalPrice: BASE_MONTHLY_PRICE,
    discount: 0,
    billingCycle: 'Facturé chaque mois',
    popular: false,
    savings: 0,
    features: [
      'Accès complet à toutes les fonctionnalités',
      'Gestion illimitée d\'invités',
      'Planning et timeline personnalisés',
      'Budget et dépenses en temps réel',
      'Journal de préparation',
      'Conseils culturels personnalisés',
      'Support par email',
      'Sauvegarde automatique',
      'Accès mobile et desktop'
    ]
  },
  {
    id: 'quarterly',
    name: 'Trimestriel',
    description: 'Économisez 10% sur 3 mois',
    price: Math.round(BASE_MONTHLY_PRICE * 3 * 0.9), // 81€ for 3 months
    originalPrice: BASE_MONTHLY_PRICE * 3, // 90€
    discount: 10,
    billingCycle: 'Facturé tous les 3 mois',
    popular: true,
    savings: Math.round(BASE_MONTHLY_PRICE * 3 * 0.1), // 9€ saved per quarter
    features: [
      'Toutes les fonctionnalités du plan mensuel',
      '10% de réduction sur le prix',
      'Facturation trimestrielle',
      'Support prioritaire',
      'Accès aux nouvelles fonctionnalités en avant-première',
      'Consultation personnalisée (30 min/trimestre)',
      'Templates de faire-part exclusifs',
      'Guides culturels détaillés'
    ]
  },
  {
    id: 'annual',
    name: 'Annuel',
    description: 'Économisez 20% sur 12 mois',
    price: Math.round(BASE_MONTHLY_PRICE * 12 * 0.8), // 288€ for 12 months
    originalPrice: BASE_MONTHLY_PRICE * 12, // 360€
    discount: 20,
    billingCycle: 'Facturé une fois par an',
    popular: false,
    savings: Math.round(BASE_MONTHLY_PRICE * 12 * 0.2), // 72€ saved per year
    features: [
      'Toutes les fonctionnalités des autres plans',
      '20% de réduction sur le prix',
      'Facturation annuelle',
      'Support VIP avec réponse garantie sous 2h',
      'Accès illimité aux consultations',
      'Coach mariage personnel assigné',
      'Kit de mariage physique envoyé à domicile',
      'Accès aux événements exclusifs',
      'Templates premium illimités',
      'Planification voyage de noces incluse'
    ]
  }
]

export const PAYMENT_FEATURES = {
  security: [
    'Paiements sécurisés SSL',
    'Données cryptées',
    'Conformité RGPD',
    'Aucun stockage de données bancaires'
  ],
  methods: [
    'Carte bancaire (Visa, Mastercard)',
    'Prélèvement SEPA',
    'PayPal',
    'Apple Pay & Google Pay'
  ],
  flexibility: [
    'Changement de plan à tout moment',
    'Annulation sans frais',
    'Remboursement sous 14 jours',
    'Pause temporaire possible'
  ]
}

export const FAQ_PAYMENT = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez changer de plan à tout moment depuis votre espace de facturation. Les changements prennent effet immédiatement et nous calculons au prorata.'
  },
  {
    question: 'Y a-t-il une période d\'essai gratuite ?',
    answer: 'Oui, tous les nouveaux utilisateurs bénéficient de 14 jours d\'essai gratuit pour tester toutes les fonctionnalités.'
  },
  {
    question: 'Comment annuler mon abonnement ?',
    answer: 'Vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. L\'annulation prend effet à la fin de votre période de facturation en cours.'
  },
  {
    question: 'Les prix incluent-ils les taxes ?',
    answer: 'Oui, tous nos prix sont affichés TTC (TVA française incluse à 20%).'
  },
  {
    question: 'Proposez-vous des remises pour les wedding planners ?',
    answer: 'Oui, nous proposons des tarifs préférentiels pour les professionnels du mariage. Contactez-nous pour plus d\'informations.'
  }
]