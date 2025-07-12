export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  mood: 'excited' | 'stressed' | 'happy' | 'nervous' | 'grateful' | 'overwhelmed' | 'calm' | 'romantic'
  category: 'planning' | 'memories' | 'emotions' | 'milestones' | 'traditions' | 'family' | 'vendors' | 'preparations' | 'ceremony' | 'reception'
  tags: string[]
  images?: string[]
  date: Date
  milestone?: string // e.g., "Choix de la robe", "Première rencontre avec le traiteur"
  isPrivate: boolean
  allowComments: boolean
  allowCollaboration: boolean
  sharedWithWhatsApp: boolean
  whatsappShareCount: number
  participantEmails?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface JournalComment {
  id: string
  entryId: string
  authorName: string
  authorEmail: string
  content: string
  createdAt: Date
}

export interface JournalTemplate {
  id: string
  title: string
  category: string
  prompts: string[]
  mood?: string
  suggestions: string[]
}

export const JOURNAL_MOODS = {
  excited: { label: 'Excitée', emoji: '🎉', color: 'yellow' },
  stressed: { label: 'Stressée', emoji: '😰', color: 'red' },
  happy: { label: 'Heureuse', emoji: '😊', color: 'green' },
  nervous: { label: 'Nerveuse', emoji: '😬', color: 'orange' },
  grateful: { label: 'Reconnaissante', emoji: '🙏', color: 'purple' },
  overwhelmed: { label: 'Dépassée', emoji: '😵', color: 'gray' },
  calm: { label: 'Sereine', emoji: '😌', color: 'blue' },
  romantic: { label: 'Romantique', emoji: '💕', color: 'pink' }
}

export const JOURNAL_CATEGORIES = {
  planning: 'Organisation',
  memories: 'Souvenirs',
  emotions: 'Émotions',
  milestones: 'Étapes importantes',
  traditions: 'Traditions',
  family: 'Famille',
  vendors: 'Prestataires',
  preparations: 'Préparatifs',
  ceremony: 'Cérémonie',
  reception: 'Réception'
}

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'first-day',
    title: 'Premier jour de planification',
    category: 'milestones',
    prompts: [
      'Comment je me sens aujourd\'hui en commençant à planifier mon mariage ?',
      'Quels sont mes rêves pour ce jour spécial ?',
      'Qu\'est-ce qui m\'excite le plus dans cette aventure ?'
    ],
    suggestions: [
      'Décris tes premières émotions',
      'Partage tes inspirations du moment',
      'Note tes priorités principales'
    ]
  },
  {
    id: 'dress-shopping',
    title: 'À la recherche de LA robe',
    category: 'preparations',
    prompts: [
      'Comment s\'est passée ma première séance d\'essayage ?',
      'Quelle robe m\'a fait le plus rêver ?',
      'Qui m\'accompagne dans cette quête ?'
    ],
    suggestions: [
      'Décris les robes essayées',
      'Note tes sensations',
      'Partage les réactions de tes proches'
    ]
  },
  {
    id: 'venue-visit',
    title: 'Visite du lieu de réception',
    category: 'planning',
    prompts: [
      'Quelle a été ma première impression du lieu ?',
      'Comment je m\'imagine ma fête ici ?',
      'Qu\'est-ce qui m\'a séduite ou inquiétée ?'
    ],
    suggestions: [
      'Décris l\'ambiance du lieu',
      'Imagine ta décoration',
      'Note les points pratiques'
    ]
  },
  {
    id: 'family-traditions',
    title: 'Traditions familiales',
    category: 'traditions',
    prompts: [
      'Quelles traditions de ma famille veux-je intégrer ?',
      'Comment adapter les traditions à mon mariage moderne ?',
      'Que représentent ces traditions pour moi ?'
    ],
    suggestions: [
      'Liste les traditions importantes',
      'Explique leur signification',
      'Planifie leur intégration'
    ]
  },
  {
    id: 'stress-moment',
    title: 'Moment de stress',
    category: 'emotions',
    prompts: [
      'Qu\'est-ce qui me stresse le plus en ce moment ?',
      'Comment puis-je gérer cette pression ?',
      'Qui peut m\'aider à relativiser ?'
    ],
    suggestions: [
      'Identifie la source du stress',
      'Trouve des solutions concrètes',
      'Rappelle-toi pourquoi tu te maries'
    ]
  }
]