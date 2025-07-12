export type VendorCategory = 
  | 'traiteur' // Traiteurs
  | 'photographe' // Photographes
  | 'dj_musicien' // DJ et musiciens
  | 'fleuriste' // Fleuristes
  | 'decoration' // Décoration
  | 'lieu_reception' // Lieux de réception
  | 'transport' // Transport
  | 'coiffure_maquillage' // Coiffure et maquillage
  | 'robe_costume' // Robes et costumes
  | 'bijoutier' // Bijoutiers
  | 'patisserie' // Pâtisseries
  | 'animation' // Animation
  | 'ceremonie' // Officiant de cérémonie
  | 'video' // Vidéographes
  | 'invitations' // Faire-part et invitations
  | 'autres' // Autres

export type VendorRating = 1 | 2 | 3 | 4 | 5

export interface Vendor {
  id: string
  userId: string // Wedding planner who added this vendor
  name: string
  category: VendorCategory
  description?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  website?: string
  instagram?: string
  facebook?: string
  rating?: VendorRating
  priceRange?: 'budget' | 'moyen' | 'premium' | 'luxe'
  specialties: string[] // e.g., ["Mariage marocain", "Végétarien", "Plein air"]
  services: string[] // List of specific services they offer
  portfolio?: string[] // URLs to portfolio images
  minimumBudget?: number
  maximumBudget?: number
  notes?: string
  isRecommended: boolean
  isVerified: boolean
  responseTime?: string // e.g., "24h", "48h", "1 semaine"
  languages?: string[] // Languages spoken
  serviceArea?: string[] // Cities/regions they serve
  availability?: string // General availability info
  lastContactDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface VendorReview {
  id: string
  vendorId: string
  clientName?: string
  rating: VendorRating
  review: string
  eventDate?: Date
  isVerified: boolean
  createdAt: Date
}

export const VENDOR_CATEGORIES: Record<VendorCategory, { label: string; icon: string; color: string }> = {
  traiteur: { label: 'Traiteurs', icon: '🍽️', color: 'orange' },
  photographe: { label: 'Photographes', icon: '📸', color: 'blue' },
  dj_musicien: { label: 'DJ & Musiciens', icon: '🎵', color: 'purple' },
  fleuriste: { label: 'Fleuristes', icon: '🌸', color: 'pink' },
  decoration: { label: 'Décoration', icon: '🎨', color: 'indigo' },
  lieu_reception: { label: 'Lieux de réception', icon: '🏛️', color: 'gray' },
  transport: { label: 'Transport', icon: '🚗', color: 'blue' },
  coiffure_maquillage: { label: 'Coiffure & Maquillage', icon: '💄', color: 'red' },
  robe_costume: { label: 'Robes & Costumes', icon: '👗', color: 'purple' },
  bijoutier: { label: 'Bijoutiers', icon: '💍', color: 'yellow' },
  patisserie: { label: 'Pâtisseries', icon: '🎂', color: 'pink' },
  animation: { label: 'Animation', icon: '🎭', color: 'green' },
  ceremonie: { label: 'Officiant', icon: '⛪', color: 'brown' },
  video: { label: 'Vidéographes', icon: '🎬', color: 'red' },
  invitations: { label: 'Faire-part', icon: '💌', color: 'pink' },
  autres: { label: 'Autres', icon: '📋', color: 'gray' }
}

export const PRICE_RANGES = {
  budget: { label: 'Budget', description: 'Options économiques', color: 'green' },
  moyen: { label: 'Moyen', description: 'Bon rapport qualité-prix', color: 'blue' },
  premium: { label: 'Premium', description: 'Qualité supérieure', color: 'purple' },
  luxe: { label: 'Luxe', description: 'Haut de gamme', color: 'amber' }
}

// Suggested specialties for each category to help wedding planners
export const VENDOR_SPECIALTIES: Record<VendorCategory, string[]> = {
  traiteur: [
    'Cuisine marocaine',
    'Cuisine tunisienne', 
    'Cuisine algérienne',
    'Buffet traditionnel',
    'Menu végétarien',
    'Menu halal',
    'Service à table',
    'Cocktail dinatoire',
    'Pâtisseries orientales'
  ],
  photographe: [
    'Photo de mariage traditionnel',
    'Style reportage',
    'Photo de couple',
    'Cérémonie religieuse',
    'Henné traditionnel',
    'Portrait de famille',
    'Drone autorisé',
    'Album personnalisé',
    'Retouche professionnelle'
  ],
  dj_musicien: [
    'Musique orientale',
    'Chaâbi marocain',
    'Raï algérien',
    'Malouf tunisien',
    'Groupe traditionnel',
    'DJ moderne',
    'Animation bilingue',
    'Matériel son/éclairage',
    'Ambiance familiale'
  ],
  fleuriste: [
    'Bouquet de mariée',
    'Décoration salle',
    'Arche florale',
    'Centres de table',
    'Fleurs exotiques',
    'Style oriental',
    'Boutonnières',
    'Décoration voiture',
    'Fleurs séchées'
  ],
  decoration: [
    'Décoration orientale',
    'Style moderne',
    'Décoration vintage',
    'Éclairage d\'ambiance',
    'Mobilier de location',
    'Tissus et draperies',
    'Décoration extérieure',
    'Thème personnalisé',
    'Installation complète'
  ],
  lieu_reception: [
    'Salle de réception',
    'Jardin/Extérieur',
    'Riad traditionnel',
    'Hôtel de luxe',
    'Château',
    'Capacité 50-100',
    'Capacité 100-200',
    'Capacité 200+',
    'Parking inclus'
  ],
  transport: [
    'Voiture de luxe',
    'Limousine',
    'Voiture vintage',
    'Transport invités',
    'Calèche',
    'Décoration véhicule',
    'Chauffeur professionnel',
    'Service navette',
    'Voiture électrique'
  ],
  coiffure_maquillage: [
    'Maquillage mariée',
    'Coiffure orientale',
    'Maquillage traditionnel',
    'Essai inclus',
    'Déplacement à domicile',
    'Retouches journée',
    'Maquillage famille',
    'Coiffure invités',
    'Produits naturels'
  ],
  robe_costume: [
    'Robe sur mesure',
    'Location robes',
    'Costume homme',
    'Takchita traditionnelle',
    'Caftan moderne',
    'Retouches incluses',
    'Accessoires inclus',
    'Style oriental',
    'Créateur local'
  ],
  bijoutier: [
    'Alliances sur mesure',
    'Bijoux traditionnels',
    'Or 18 carats',
    'Diamants certifiés',
    'Gravure personnalisée',
    'Parure complète',
    'Réparation bijoux',
    'Expertise gratuite',
    'Garantie longue durée'
  ],
  patisserie: [
    'Gâteau de mariage',
    'Pâtisseries orientales',
    'Chouarak traditionnel',
    'Macarons personnalisés',
    'Dragées',
    'Buffet sucré',
    'Gâteau sans gluten',
    'Décoration comestible',
    'Livraison incluse'
  ],
  animation: [
    'Groupe folklorique',
    'Danse orientale',
    'Spectacle enfants',
    'Magicien',
    'Animation musicale',
    'Jeux traditionnels',
    'Photo booth',
    'Feux d\'artifice',
    'Spectacle de rue'
  ],
  ceremonie: [
    'Mariage religieux',
    'Cérémonie laïque',
    'Mariage mixte',
    'Cérémonie bilingue',
    'Rituel traditionnel',
    'Mariage en extérieur',
    'Cérémonie personnalisée',
    'Conseil pré-marital',
    'Documentation fournie'
  ],
  video: [
    'Film de mariage',
    'Highlights video',
    'Drone professionnel',
    'Multi-caméras',
    'Montage professionnel',
    'Live streaming',
    'Interview famille',
    'Documentaire complet',
    'Remise rapide'
  ],
  invitations: [
    'Faire-part personnalisés',
    'Style oriental',
    'Calligraphie arabe',
    'Impression de luxe',
    'Menu personnalisé',
    'Save the date',
    'Remerciements',
    'Livret de messe',
    'Design unique'
  ],
  autres: [
    'Service particulier',
    'Prestation unique',
    'Sur demande'
  ]
}