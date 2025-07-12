export type AttendeeCategory = 
  | 'TEMOINS' // Témoins
  | 'DEMOISELLES_HONNEUR' // Demoiselles d'honneur
  | 'GARCONS_HONNEUR' // Garçons d'honneur
  | 'FAMILLE_PROCHE' // Famille proche
  | 'FAMILLE_ETENDUE' // Famille étendue
  | 'AMIS_PROCHES' // Amis proches
  | 'COLLEGUES' // Collègues
  | 'INVITES_CEREMONIE' // Invités cérémonie uniquement
  | 'INVITES_RECEPTION' // Invités réception uniquement
  | 'ENFANTS' // Enfants
  | 'AUTRES' // Autres

export interface Attendee {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  category: AttendeeCategory
  side: 'MARIE' | 'MARIEE' | 'COMMUN' // Côté marié, mariée, ou commun
  age?: number
  address?: string
  dietaryRestrictions?: string[]
  plusOne?: boolean
  plusOneName?: string
  confirmed: boolean
  invitationSent: boolean
  tableNumber?: number
  specialNeeds?: string
  notes?: string
  rsvpDate?: Date
  // New fields for family relationships and roles
  relationshipType?: string // père, mère, frère, soeur, etc.
  parentId?: string // ID de l'invité parent dans l'organigramme
  specialRole?: string[] // témoin, demoiselle d'honneur, etc.
  createdAt: Date
  updatedAt: Date
}

export type TableShape = 'round' | 'square' | 'rectangular'

export interface Table {
  id: string
  number: number
  shape: TableShape
  seats: number
  x: number // Position X dans le plan
  y: number // Position Y dans le plan
  attendees: string[] // IDs des invités
  notes?: string
}

export interface VenueLayout {
  id: string
  name: string
  width: number // Largeur en mètres
  height: number // Hauteur en mètres
  tables: Table[]
  totalCapacity: number
  stage?: {
    x: number
    y: number
    width: number
    height: number
  }
  danceFloor?: {
    x: number
    y: number
    width: number
    height: number
  }
  entrance?: {
    x: number
    y: number
  }
  buffet?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface TablePlan {
  id: string
  userId: string
  name: string
  venueLayout: VenueLayout
  attendees: Attendee[]
  createdAt: Date
  updatedAt: Date
}

export const ATTENDEE_CATEGORIES: Record<AttendeeCategory, string> = {
  TEMOINS: 'Témoins',
  DEMOISELLES_HONNEUR: 'Demoiselles d\'honneur',
  GARCONS_HONNEUR: 'Garçons d\'honneur',
  FAMILLE_PROCHE: 'Famille proche',
  FAMILLE_ETENDUE: 'Famille étendue',
  AMIS_PROCHES: 'Amis proches',
  COLLEGUES: 'Collègues',
  INVITES_CEREMONIE: 'Invités cérémonie uniquement',
  INVITES_RECEPTION: 'Invités réception uniquement',
  ENFANTS: 'Enfants',
  AUTRES: 'Autres'
}

export const TABLE_SHAPES: Record<TableShape, string> = {
  round: 'Ronde',
  square: 'Carrée',
  rectangular: 'Rectangulaire'
}

export const RELATIONSHIP_TYPES = {
  // Parents directs
  mere_mariee: 'Mère de la mariée',
  pere_mariee: 'Père de la mariée',
  mere_marie: 'Mère du marié',
  pere_marie: 'Père du marié',
  
  // Fratrie
  soeur_mariee: 'Sœur de la mariée',
  frere_mariee: 'Frère de la mariée',
  soeur_marie: 'Sœur du marié',
  frere_marie: 'Frère du marié',
  belle_soeur: 'Belle-sœur',
  beau_frere: 'Beau-frère',
  
  // Grands-parents
  grand_mere_mariee: 'Grand-mère de la mariée',
  grand_pere_mariee: 'Grand-père de la mariée',
  grand_mere_marie: 'Grand-mère du marié',
  grand_pere_marie: 'Grand-père du marié',
  
  // Oncles et tantes
  tante_mariee: 'Tante de la mariée',
  oncle_mariee: 'Oncle de la mariée',
  tante_marie: 'Tante du marié',
  oncle_marie: 'Oncle du marié',
  
  // Cousins
  cousine_mariee: 'Cousine de la mariée',
  cousin_mariee: 'Cousin de la mariée',
  cousine_marie: 'Cousine du marié',
  cousin_marie: 'Cousin du marié',
  
  // Neveux et nièces
  neveu: 'Neveu',
  niece: 'Nièce',
  
  // Amis
  ami_mariee: 'Ami(e) de la mariée',
  ami_marie: 'Ami(e) du marié',
  ami_commun: 'Ami(e) commun',
  
  // Autres
  autre: 'Autre'
}

export const SPECIAL_ROLES = {
  temoin_mariee: 'Témoin de la mariée',
  temoin_marie: 'Témoin du marié',
  demoiselle_honneur: 'Demoiselle d\'honneur',
  garcon_honneur: 'Garçon d\'honneur',
  bouquetiere: 'Bouquetière',
  porteur_alliances: 'Porteur d\'alliances',
  maitre_ceremonie: 'Maître de cérémonie',
  photographe_invite: 'Photographe invité',
  musicien_invite: 'Musicien invité',
  negafa: 'Negafa',
  amaria: 'Amaria'
}