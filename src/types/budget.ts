export type BudgetCategory = 
  | 'lieu_reception' // Lieu de réception
  | 'traiteur' // Traiteur et restauration
  | 'robe_costume' // Robe de mariée et costume
  | 'photographe' // Photographe
  | 'video' // Vidéographe
  | 'fleurs_decoration' // Fleurs et décoration
  | 'musique_animation' // Musique et animation
  | 'transport' // Transport
  | 'coiffure_maquillage' // Coiffure et maquillage
  | 'bijoux_alliances' // Bijoux et alliances
  | 'invitations' // Faire-part et invitations
  | 'voyage_noces' // Voyage de noces
  | 'ceremonies' // Cérémonies (religieuse, civile)
  | 'hebergement' // Hébergement des invités
  | 'cadeaux_invites' // Cadeaux pour les invités
  | 'divers' // Divers et imprévus

export type BudgetStatus = 'prevu' | 'confirme' | 'paye' | 'annule'

export interface BudgetItem {
  id: string
  userId: string
  category: BudgetCategory
  name: string
  description?: string
  estimatedAmount: number
  actualAmount?: number
  paidAmount?: number
  vendor?: string
  dueDate?: Date
  paymentDate?: Date
  status: BudgetStatus
  isRequired: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BudgetSummary {
  totalBudget: number
  totalEstimated: number
  totalActual: number
  totalPaid: number
  remainingBudget: number
  categoryBreakdown: Record<BudgetCategory, {
    estimated: number
    actual: number
    paid: number
    percentage: number
  }>
}

export const BUDGET_CATEGORIES: Record<BudgetCategory, { label: string; icon: string; color: string; typical: number }> = {
  lieu_reception: { label: 'Lieu de réception', icon: '🏛️', color: 'blue', typical: 30 },
  traiteur: { label: 'Traiteur', icon: '🍽️', color: 'orange', typical: 25 },
  robe_costume: { label: 'Tenues', icon: '👗', color: 'pink', typical: 8 },
  photographe: { label: 'Photographe', icon: '📸', color: 'purple', typical: 10 },
  video: { label: 'Vidéo', icon: '🎬', color: 'red', typical: 5 },
  fleurs_decoration: { label: 'Fleurs & Décoration', icon: '🌸', color: 'green', typical: 8 },
  musique_animation: { label: 'Musique & Animation', icon: '🎵', color: 'indigo', typical: 6 },
  transport: { label: 'Transport', icon: '🚗', color: 'gray', typical: 3 },
  coiffure_maquillage: { label: 'Beauté', icon: '💄', color: 'rose', typical: 3 },
  bijoux_alliances: { label: 'Bijoux', icon: '💍', color: 'yellow', typical: 4 },
  invitations: { label: 'Invitations', icon: '💌', color: 'cyan', typical: 2 },
  voyage_noces: { label: 'Voyage de noces', icon: '✈️', color: 'teal', typical: 10 },
  ceremonies: { label: 'Cérémonies', icon: '⛪', color: 'amber', typical: 3 },
  hebergement: { label: 'Hébergement', icon: '🏨', color: 'lime', typical: 5 },
  cadeaux_invites: { label: 'Cadeaux invités', icon: '🎁', color: 'emerald', typical: 3 },
  divers: { label: 'Divers', icon: '📋', color: 'slate', typical: 5 }
}

export const BUDGET_STATUS: Record<BudgetStatus, { label: string; icon: string; color: string }> = {
  prevu: { label: '📋 Prévu', icon: '📋', color: 'gray' },
  confirme: { label: '✅ Confirmé', icon: '✅', color: 'blue' },
  paye: { label: '💰 Payé', icon: '💰', color: 'green' },
  annule: { label: '❌ Annulé', icon: '❌', color: 'red' }
}

// Budget suggestions with typical amounts for French/North African weddings
export const BUDGET_SUGGESTIONS: Record<BudgetCategory, Array<{
  name: string
  description: string
  estimatedAmount: number
  isRequired: boolean
}>> = {
  lieu_reception: [
    { name: 'Location salle de réception', description: 'Salle principale pour la fête', estimatedAmount: 3000, isRequired: true },
    { name: 'Location salle cérémonie', description: 'Espace pour la cérémonie civile/religieuse', estimatedAmount: 800, isRequired: false },
    { name: 'Caution lieu', description: 'Dépôt de garantie', estimatedAmount: 500, isRequired: true },
    { name: 'Éclairage supplémentaire', description: 'Éclairage d\'ambiance', estimatedAmount: 400, isRequired: false },
    { name: 'Chauffage/Climatisation', description: 'Selon la saison', estimatedAmount: 300, isRequired: false }
  ],
  traiteur: [
    { name: 'Menu principal', description: 'Repas pour tous les invités', estimatedAmount: 4500, isRequired: true },
    { name: 'Cocktail d\'accueil', description: 'Apéritif et amuse-bouches', estimatedAmount: 800, isRequired: true },
    { name: 'Gâteau de mariage', description: 'Pièce montée ou wedding cake', estimatedAmount: 350, isRequired: true },
    { name: 'Service et personnel', description: 'Serveurs et personnel de service', estimatedAmount: 600, isRequired: true },
    { name: 'Pâtisseries orientales', description: 'Assortiment de pâtisseries traditionnelles', estimatedAmount: 400, isRequired: false },
    { name: 'Bar et boissons', description: 'Boissons pour la soirée', estimatedAmount: 800, isRequired: true },
    { name: 'Menu enfants', description: 'Repas adaptés aux enfants', estimatedAmount: 200, isRequired: false }
  ],
  robe_costume: [
    { name: 'Robe de mariée', description: 'Robe principale pour la cérémonie', estimatedAmount: 1200, isRequired: true },
    { name: 'Costume marié', description: 'Costume ou smoking', estimatedAmount: 600, isRequired: true },
    { name: 'Takchita/Caftan', description: 'Tenue traditionnelle', estimatedAmount: 800, isRequired: false },
    { name: 'Retouches', description: 'Ajustements des tenues', estimatedAmount: 150, isRequired: true },
    { name: 'Accessoires mariée', description: 'Voile, gants, chaussures', estimatedAmount: 300, isRequired: true },
    { name: 'Accessoires marié', description: 'Chaussures, cravate, boutons de manchette', estimatedAmount: 200, isRequired: true },
    { name: 'Tenue henné', description: 'Robe pour la cérémonie du henné', estimatedAmount: 400, isRequired: false }
  ],
  photographe: [
    { name: 'Photographe mariage', description: 'Couverture complète du mariage', estimatedAmount: 1500, isRequired: true },
    { name: 'Séance engagement', description: 'Photos de couple avant le mariage', estimatedAmount: 300, isRequired: false },
    { name: 'Album photo', description: 'Album imprimé de qualité', estimatedAmount: 400, isRequired: false },
    { name: 'Retouches photos', description: 'Post-traitement professionnel', estimatedAmount: 200, isRequired: true },
    { name: 'Photos henné', description: 'Photographe pour cérémonie du henné', estimatedAmount: 400, isRequired: false }
  ],
  video: [
    { name: 'Vidéaste mariage', description: 'Film du mariage', estimatedAmount: 1200, isRequired: false },
    { name: 'Drone', description: 'Prises de vue aériennes', estimatedAmount: 300, isRequired: false },
    { name: 'Montage et post-production', description: 'Édition du film final', estimatedAmount: 400, isRequired: false },
    { name: 'Film highlight', description: 'Version courte du mariage', estimatedAmount: 200, isRequired: false }
  ],
  fleurs_decoration: [
    { name: 'Bouquet de mariée', description: 'Bouquet principal', estimatedAmount: 120, isRequired: true },
    { name: 'Boutonnière marié', description: 'Fleur pour le marié', estimatedAmount: 15, isRequired: true },
    { name: 'Centres de table', description: 'Décoration florale des tables', estimatedAmount: 400, isRequired: true },
    { name: 'Arche florale', description: 'Décoration pour la cérémonie', estimatedAmount: 300, isRequired: false },
    { name: 'Décoration voiture', description: 'Ornements pour le véhicule', estimatedAmount: 80, isRequired: false },
    { name: 'Décoration salle', description: 'Arrangements floraux généraux', estimatedAmount: 600, isRequired: true }
  ],
  musique_animation: [
    { name: 'DJ/Orchestre', description: 'Animation musicale principale', estimatedAmount: 800, isRequired: true },
    { name: 'Système son', description: 'Matériel audio', estimatedAmount: 300, isRequired: true },
    { name: 'Éclairage disco', description: 'Jeux de lumière pour la piste', estimatedAmount: 200, isRequired: false },
    { name: 'Groupe traditionnel', description: 'Musiciens pour cérémonie traditionnelle', estimatedAmount: 600, isRequired: false },
    { name: 'Animation enfants', description: 'Divertissement pour les plus jeunes', estimatedAmount: 200, isRequired: false }
  ],
  transport: [
    { name: 'Voiture mariés', description: 'Transport des mariés', estimatedAmount: 250, isRequired: true },
    { name: 'Transport invités', description: 'Navette pour les invités', estimatedAmount: 300, isRequired: false },
    { name: 'Décoration véhicule', description: 'Ornements pour la voiture', estimatedAmount: 50, isRequired: false }
  ],
  coiffure_maquillage: [
    { name: 'Coiffure mariée', description: 'Coiffure pour le jour J', estimatedAmount: 120, isRequired: true },
    { name: 'Maquillage mariée', description: 'Maquillage professionnel', estimatedAmount: 150, isRequired: true },
    { name: 'Essai coiffure/maquillage', description: 'Test avant le mariage', estimatedAmount: 80, isRequired: true },
    { name: 'Retouches', description: 'Retouches pendant la journée', estimatedAmount: 50, isRequired: false },
    { name: 'Manucure', description: 'Soins des ongles', estimatedAmount: 40, isRequired: false }
  ],
  bijoux_alliances: [
    { name: 'Alliances', description: 'Anneaux de mariage', estimatedAmount: 800, isRequired: true },
    { name: 'Bague de fiançailles', description: 'Si pas encore achetée', estimatedAmount: 1200, isRequired: false },
    { name: 'Bijoux mariée', description: 'Parure pour le mariage', estimatedAmount: 400, isRequired: false },
    { name: 'Gravure alliances', description: 'Personnalisation des anneaux', estimatedAmount: 50, isRequired: false }
  ],
  invitations: [
    { name: 'Faire-part', description: 'Invitations principales', estimatedAmount: 200, isRequired: true },
    { name: 'Save the date', description: 'Pré-invitations', estimatedAmount: 100, isRequired: false },
    { name: 'Menu de table', description: 'Cartes des menus', estimatedAmount: 80, isRequired: false },
    { name: 'Plan de table', description: 'Affichage du placement', estimatedAmount: 60, isRequired: true },
    { name: 'Livret de messe', description: 'Programme de cérémonie', estimatedAmount: 80, isRequired: false }
  ],
  voyage_noces: [
    { name: 'Vol/Transport', description: 'Transport vers la destination', estimatedAmount: 1200, isRequired: true },
    { name: 'Hébergement', description: 'Hôtel ou location', estimatedAmount: 1500, isRequired: true },
    { name: 'Activités', description: 'Excursions et loisirs', estimatedAmount: 500, isRequired: false },
    { name: 'Repas', description: 'Restaurants et sorties', estimatedAmount: 400, isRequired: true },
    { name: 'Assurance voyage', description: 'Protection pour le voyage', estimatedAmount: 100, isRequired: true }
  ],
  ceremonies: [
    { name: 'Officiant religieux', description: 'Imam, prêtre ou rabbin', estimatedAmount: 200, isRequired: false },
    { name: 'Location lieu religieux', description: 'Mosquée, église, synagogue', estimatedAmount: 150, isRequired: false },
    { name: 'Musiciens cérémonie', description: 'Animation pour la cérémonie', estimatedAmount: 300, isRequired: false },
    { name: 'Décoration lieu', description: 'Ornements pour la cérémonie', estimatedAmount: 200, isRequired: false }
  ],
  hebergement: [
    { name: 'Hôtel famille proche', description: 'Logement pour la famille', estimatedAmount: 600, isRequired: false },
    { name: 'Hôtel invités VIP', description: 'Hébergement invités importants', estimatedAmount: 400, isRequired: false },
    { name: 'Suite nuit de noces', description: 'Chambre spéciale mariés', estimatedAmount: 200, isRequired: false }
  ],
  cadeaux_invites: [
    { name: 'Dragées', description: 'Bonbons traditionnels', estimatedAmount: 150, isRequired: true },
    { name: 'Petits cadeaux', description: 'Souvenirs pour les invités', estimatedAmount: 200, isRequired: false },
    { name: 'Sachets/Boites', description: 'Emballages pour les cadeaux', estimatedAmount: 80, isRequired: true }
  ],
  divers: [
    { name: 'Assurance mariage', description: 'Protection contre les imprévus', estimatedAmount: 150, isRequired: false },
    { name: 'Pourboires', description: 'Gratifications pour les prestataires', estimatedAmount: 300, isRequired: false },
    { name: 'Urgences', description: 'Fonds pour imprévus', estimatedAmount: 500, isRequired: true },
    { name: 'Nettoyage après', description: 'Remise en état des lieux', estimatedAmount: 200, isRequired: false }
  ]
}