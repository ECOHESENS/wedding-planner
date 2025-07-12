export type TrousseauCategory = 
  | 'robe_mariee' // Robe de mariée et accessoires
  | 'lingerie' // Lingerie et sous-vêtements
  | 'chaussures' // Chaussures
  | 'bijoux' // Bijoux et accessoires
  | 'beaute' // Beauté et soins
  | 'parfum' // Parfums
  | 'maison' // Linge de maison
  | 'cuisine' // Équipement cuisine
  | 'electromenager' // Électroménager
  | 'decoration' // Décoration
  | 'vetements' // Vêtements du quotidien
  | 'voyage_noces' // Voyage de noces
  | 'traditionnels' // Articles traditionnels
  | 'marie_homme' // Articles pour le marié
  | 'cadeaux_mariage' // Cadeaux de mariage
  | 'autres' // Autres

export type Priority = 'essentiel' | 'important' | 'souhaite' | 'luxe'

export interface TrousseauItem {
  id: string
  userId: string
  name: string
  description?: string
  category: TrousseauCategory
  priority: Priority
  quantity: number
  quantityObtained: number
  estimatedPrice?: number
  actualPrice?: number
  brand?: string
  size?: string
  color?: string
  store?: string
  url?: string
  notes?: string
  images?: string[]
  purchased: boolean
  purchaseDate?: Date
  giftFrom?: string // Si c'est un cadeau
  isGift: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TrousseauList {
  id: string
  userId: string
  name: string
  description?: string
  items: TrousseauItem[]
  totalBudget?: number
  createdAt: Date
  updatedAt: Date
}

export const TROUSSEAU_CATEGORIES: Record<TrousseauCategory, { label: string; icon: string; color: string }> = {
  robe_mariee: { label: 'Robe de mariée', icon: '👰', color: 'pink' },
  lingerie: { label: 'Lingerie', icon: '👙', color: 'rose' },
  chaussures: { label: 'Chaussures', icon: '👠', color: 'purple' },
  bijoux: { label: 'Bijoux', icon: '💍', color: 'yellow' },
  beaute: { label: 'Beauté', icon: '💄', color: 'red' },
  parfum: { label: 'Parfums', icon: '🌸', color: 'pink' },
  maison: { label: 'Linge de maison', icon: '🏠', color: 'blue' },
  cuisine: { label: 'Cuisine', icon: '🍽️', color: 'orange' },
  electromenager: { label: 'Électroménager', icon: '🏠', color: 'gray' },
  decoration: { label: 'Décoration', icon: '🕯️', color: 'indigo' },
  vetements: { label: 'Vêtements', icon: '👗', color: 'purple' },
  voyage_noces: { label: 'Voyage de noces', icon: '✈️', color: 'blue' },
  traditionnels: { label: 'Articles traditionnels', icon: '🏺', color: 'amber' },
  marie_homme: { label: 'Articles pour le marié', icon: '🤵', color: 'slate' },
  cadeaux_mariage: { label: 'Cadeaux de mariage', icon: '🎁', color: 'green' },
  autres: { label: 'Autres', icon: '📦', color: 'gray' }
}

export const PRIORITY_LEVELS: Record<Priority, { label: string; icon: string; color: string; description: string }> = {
  essentiel: { 
    label: '🔥 Essentiel', 
    icon: '🔥',
    color: 'red', 
    description: 'Indispensable pour le mariage' 
  },
  important: { 
    label: '⭐ Important', 
    icon: '⭐',
    color: 'orange', 
    description: 'Très utile et recommandé' 
  },
  souhaite: { 
    label: '💙 Souhaité', 
    icon: '💙',
    color: 'blue', 
    description: 'Ce serait bien de l\'avoir' 
  },
  luxe: { 
    label: '💎 Luxe', 
    icon: '💎',
    color: 'purple', 
    description: 'Pour se faire plaisir' 
  }
}

// Suggestions d'articles par catégorie pour aider la mariée
export const TROUSSEAU_SUGGESTIONS: Record<TrousseauCategory, string[]> = {
  robe_mariee: [
    'Robe de mariée',
    'Voile',
    'Diadème ou couronne',
    'Gants',
    'Cape ou étole',
    'Robe de civil',
    'Robe de henné',
    'Jupons',
    'Bustier ou corset'
  ],
  lingerie: [
    'Soutien-gorge sans bretelles',
    'Culotte taille haute',
    'Body shapewear',
    'Jarretières',
    'Bas ou collants',
    'Nuisettes',
    'Ensembles de lingerie fine',
    'Soutien-gorge adhésif',
    'Culottes en coton'
  ],
  chaussures: [
    'Escarpins pour le mariage',
    'Chaussures plates de secours',
    'Sandales pour la plage (lune de miel)',
    'Chaussons en soie',
    'Bottes élégantes',
    'Baskets confortables',
    'Chaussures de henné'
  ],
  bijoux: [
    'Alliance',
    'Bague de fiançailles',
    'Collier',
    'Boucles d\'oreilles',
    'Bracelet',
    'Montre',
    'Épingles à cheveux',
    'Bijoux traditionnels',
    'Coffret à bijoux'
  ],
  beaute: [
    'Fond de teint longue tenue',
    'Palette de maquillage',
    'Rouge à lèvres',
    'Mascara waterproof',
    'Crème hydratante',
    'Huile d\'argan',
    'Gommage corps',
    'Masques visage',
    'Vernis à ongles'
  ],
  parfum: [
    'Parfum signature',
    'Eau de toilette',
    'Brume corporelle',
    'Huiles essentielles',
    'Bougie parfumée',
    'Savons parfumés'
  ],
  maison: [
    'Parure de lit',
    'Draps en soie',
    'Couverture en cachemire',
    'Serviettes de bain',
    'Peignoirs',
    'Rideaux',
    'Coussins décoratifs',
    'Tapis',
    'Nappe de fête'
  ],
  cuisine: [
    'Service de table',
    'Verres en cristal',
    'Couverts en argent',
    'Plats de service',
    'Théière',
    'Tajine',
    'Plateaux marocains',
    'Samovar',
    'Ustensiles de cuisine'
  ],
  electromenager: [
    'Robot cuiseur',
    'Blender',
    'Cafetière',
    'Grille-pain',
    'Bouilloire électrique',
    'Multicuiseur',
    'Machine à pain'
  ],
  decoration: [
    'Cadres photo',
    'Vases',
    'Bougies',
    'Miroirs décoratifs',
    'Objets d\'art',
    'Plantes vertes',
    'Luminaires',
    'Tentures murales'
  ],
  vetements: [
    'Robes d\'été',
    'Manteaux',
    'Vestes élégantes',
    'Pantalons',
    'Jupes',
    'Chemisiers',
    'Cardigans',
    'Foulards',
    'Ceintures'
  ],
  voyage_noces: [
    'Valises',
    'Maillots de bain',
    'Pareos',
    'Chapeaux',
    'Lunettes de soleil',
    'Crème solaire',
    'Appareil photo',
    'Pochette voyage',
    'Adaptateurs électriques'
  ],
  traditionnels: [
    'Kaftan brodé',
    'Takchita',
    'Bijoux berbères',
    'Babouches',
    'Tapis traditionnel',
    'Coussin brodé',
    'Miroir doré',
    'Plateau en cuivre',
    'Encensoir'
  ],
  marie_homme: [
    'Costume de marié',
    'Chemises blanches',
    'Cravates et nœuds papillon',
    'Chaussures de ville',
    'Chaussettes élégantes',
    'Ceintures en cuir',
    'Manchettes',
    'Boutons de manchettes',
    'Parfum pour homme',
    'Montre',
    'Costume traditionnel',
    'Babouches pour homme'
  ],
  cadeaux_mariage: [
    'Liste de mariage',
    'Cadeaux invités',
    'Dragées',
    'Boîtes à dragées',
    'Cadeaux témoins',
    'Cadeaux parents',
    'Cadeaux famille',
    'Livre d\'or',
    'Urne pour enveloppes',
    'Cadeaux d\'anniversaire de mariage',
    'Cadeaux personnalisés',
    'Paniers garnis'
  ],
  autres: [
    'Album photo de mariage',
    'Journal intime',
    'Carnet d\'adresses',
    'Organiseur',
    'Livres de recettes',
    'Accessoires de voyage'
  ]
}