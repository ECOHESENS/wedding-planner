export type TimelinePhase = 
  | 'engagement' // Fiançailles
  | '12_months' // 12 mois avant
  | '9_months' // 9 mois avant
  | '6_months' // 6 mois avant
  | '3_months' // 3 mois avant
  | '1_month' // 1 mois avant
  | '2_weeks' // 2 semaines avant
  | '1_week' // 1 semaine avant
  | 'wedding_day' // Jour J
  | 'post_wedding' // Après le mariage

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type TaskCategory = 
  | 'administrative' // Administratif
  | 'venue' // Lieu
  | 'vendors' // Prestataires
  | 'attire' // Tenues
  | 'beauty' // Beauté
  | 'decor' // Décoration
  | 'logistics' // Logistique
  | 'guests' // Invités
  | 'honeymoon' // Voyage de noces
  | 'traditions' // Traditions

export interface TimelineTask {
  id: string
  userId: string
  title: string
  description?: string
  category: TaskCategory
  phase: TimelinePhase
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedDuration?: number // en heures
  dueDate?: Date
  completedDate?: Date
  assignedTo?: string[] // IDs des personnes assignées
  notes?: string
  relatedBudgetItems?: string[] // IDs des éléments de budget liés
  relatedVendors?: string[] // IDs des prestataires liés
  isCustom: boolean // false = tâche suggérée, true = ajoutée par l'utilisateur
  createdAt: Date
  updatedAt: Date
}

export interface TimelinePhaseInfo {
  id: TimelinePhase
  title: string
  icon: string
  color: string
  description: string
  timeframe: string
  completionRate?: number
}

export const TIMELINE_PHASES: Record<TimelinePhase, TimelinePhaseInfo> = {
  engagement: {
    id: 'engagement',
    title: '💍 Fiançailles',
    icon: '💍',
    color: 'pink',
    description: 'Célébrer les fiançailles et commencer la planification',
    timeframe: 'Dès les fiançailles'
  },
  '12_months': {
    id: '12_months',
    title: '📅 12 Mois Avant',
    icon: '📅',
    color: 'blue',
    description: 'Établir les bases de votre mariage',
    timeframe: '12-9 mois avant'
  },
  '9_months': {
    id: '9_months',
    title: '🎯 9 Mois Avant',
    icon: '🎯',
    color: 'indigo',
    description: 'Réserver les prestataires principaux',
    timeframe: '9-6 mois avant'
  },
  '6_months': {
    id: '6_months',
    title: '👗 6 Mois Avant',
    icon: '👗',
    color: 'purple',
    description: 'Finaliser les détails importants',
    timeframe: '6-3 mois avant'
  },
  '3_months': {
    id: '3_months',
    title: '🎨 3 Mois Avant',
    icon: '🎨',
    color: 'green',
    description: 'Peaufiner tous les détails',
    timeframe: '3-1 mois avant'
  },
  '1_month': {
    id: '1_month',
    title: '✅ 1 Mois Avant',
    icon: '✅',
    color: 'yellow',
    description: 'Finaliser et confirmer tout',
    timeframe: '1 mois-2 semaines avant'
  },
  '2_weeks': {
    id: '2_weeks',
    title: '⏰ 2 Semaines Avant',
    icon: '⏰',
    color: 'orange',
    description: 'Derniers préparatifs',
    timeframe: '2 semaines-1 semaine avant'
  },
  '1_week': {
    id: '1_week',
    title: '🚨 1 Semaine Avant',
    icon: '🚨',
    color: 'red',
    description: 'Préparatifs de dernière minute',
    timeframe: '1 semaine avant le Jour J'
  },
  wedding_day: {
    id: 'wedding_day',
    title: '💒 Jour J',
    icon: '💒',
    color: 'rose',
    description: 'Votre jour spécial !',
    timeframe: 'Le jour du mariage'
  },
  post_wedding: {
    id: 'post_wedding',
    title: '🌟 Après le Mariage',
    icon: '🌟',
    color: 'emerald',
    description: 'Tâches post-mariage',
    timeframe: 'Après le mariage'
  }
}

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  administrative: { label: '📋 Administratif', icon: '📋', color: 'gray' },
  venue: { label: '🏛️ Lieu', icon: '🏛️', color: 'blue' },
  vendors: { label: '🤝 Prestataires', icon: '🤝', color: 'purple' },
  attire: { label: '👗 Tenues', icon: '👗', color: 'pink' },
  beauty: { label: '💄 Beauté', icon: '💄', color: 'red' },
  decor: { label: '🌸 Décoration', icon: '🌸', color: 'green' },
  logistics: { label: '🚗 Logistique', icon: '🚗', color: 'orange' },
  guests: { label: '👥 Invités', icon: '👥', color: 'indigo' },
  honeymoon: { label: '✈️ Voyage de noces', icon: '✈️', color: 'teal' },
  traditions: { label: '🏺 Traditions', icon: '🏺', color: 'amber' }
}

export const TASK_PRIORITIES: Record<string, { label: string; icon: string; color: string }> = {
  low: { label: '🟢 Faible', icon: '🟢', color: 'green' },
  medium: { label: '🟡 Moyenne', icon: '🟡', color: 'yellow' },
  high: { label: '🟠 Élevée', icon: '🟠', color: 'orange' },
  critical: { label: '🔴 Critique', icon: '🔴', color: 'red' }
}

export const TASK_STATUS: Record<TaskStatus, { label: string; icon: string; color: string }> = {
  pending: { label: '⏳ En attente', icon: '⏳', color: 'gray' },
  in_progress: { label: '🔄 En cours', icon: '🔄', color: 'blue' },
  completed: { label: '✅ Terminé', icon: '✅', color: 'green' },
  cancelled: { label: '❌ Annulé', icon: '❌', color: 'red' }
}

// Tâches suggérées par phase
export const SUGGESTED_TASKS: Record<TimelinePhase, Array<{
  title: string
  description: string
  category: TaskCategory
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedDuration: number
}>> = {
  engagement: [
    {
      title: 'Célébrer les fiançailles 🎉',
      description: 'Organiser une petite fête pour annoncer vos fiançailles',
      category: 'traditions',
      priority: 'medium',
      estimatedDuration: 4
    },
    {
      title: 'Créer un budget initial 💰',
      description: 'Établir une fourchette budgétaire pour le mariage',
      category: 'administrative',
      priority: 'critical',
      estimatedDuration: 2
    },
    {
      title: 'Définir le style du mariage 🎨',
      description: 'Décider du thème, couleurs et ambiance générale',
      category: 'decor',
      priority: 'high',
      estimatedDuration: 3
    }
  ],
  '12_months': [
    {
      title: 'Choisir la date du mariage 📅',
      description: 'Fixer la date définitive en tenant compte des contraintes',
      category: 'administrative',
      priority: 'critical',
      estimatedDuration: 1
    },
    {
      title: 'Réserver le lieu de réception 🏛️',
      description: 'Visiter et réserver la salle de réception',
      category: 'venue',
      priority: 'critical',
      estimatedDuration: 8
    },
    {
      title: 'Établir la liste d\'invités 👥',
      description: 'Créer la liste préliminaire des invités',
      category: 'guests',
      priority: 'high',
      estimatedDuration: 3
    },
    {
      title: 'Réserver le traiteur 🍽️',
      description: 'Déguster et choisir le menu avec le traiteur',
      category: 'vendors',
      priority: 'critical',
      estimatedDuration: 6
    }
  ],
  '9_months': [
    {
      title: 'Choisir et réserver le photographe 📸',
      description: 'Sélectionner le photographe après entretiens',
      category: 'vendors',
      priority: 'high',
      estimatedDuration: 4
    },
    {
      title: 'Commencer à chercher la robe de mariée 👰',
      description: 'Visiter les boutiques et essayer différents styles',
      category: 'attire',
      priority: 'high',
      estimatedDuration: 8
    },
    {
      title: 'Réserver l\'animation/DJ 🎵',
      description: 'Choisir l\'animation musicale pour la réception',
      category: 'vendors',
      priority: 'high',
      estimatedDuration: 3
    },
    {
      title: 'Planifier le voyage de noces ✈️',
      description: 'Choisir la destination et réserver',
      category: 'honeymoon',
      priority: 'medium',
      estimatedDuration: 6
    }
  ],
  '6_months': [
    {
      title: 'Commander la robe de mariée 👗',
      description: 'Finaliser le choix et commander avec retouches',
      category: 'attire',
      priority: 'critical',
      estimatedDuration: 2
    },
    {
      title: 'Choisir le costume du marié 🤵',
      description: 'Sélectionner et commander le costume',
      category: 'attire',
      priority: 'high',
      estimatedDuration: 3
    },
    {
      title: 'Réserver les services beauté 💄',
      description: 'Coiffeur, maquilleur, esthéticienne',
      category: 'beauty',
      priority: 'high',
      estimatedDuration: 2
    },
    {
      title: 'Commander les faire-part 💌',
      description: 'Créer et commander les invitations',
      category: 'guests',
      priority: 'high',
      estimatedDuration: 4
    }
  ],
  '3_months': [
    {
      title: 'Envoyer les faire-part 📮',
      description: 'Poster les invitations aux invités',
      category: 'guests',
      priority: 'critical',
      estimatedDuration: 2
    },
    {
      title: 'Organiser l\'enterrement de vie 🎉',
      description: 'Planifier les EVJF/EVG',
      category: 'traditions',
      priority: 'medium',
      estimatedDuration: 6
    },
    {
      title: 'Finaliser le menu de réception 🥘',
      description: 'Confirmer le menu définitif avec le traiteur',
      category: 'vendors',
      priority: 'high',
      estimatedDuration: 2
    },
    {
      title: 'Choisir les alliances 💍',
      description: 'Sélectionner et commander les alliances',
      category: 'attire',
      priority: 'critical',
      estimatedDuration: 3
    }
  ],
  '1_month': [
    {
      title: 'Essayage final de la robe 👰',
      description: 'Dernier essayage avec tous les accessoires',
      category: 'attire',
      priority: 'high',
      estimatedDuration: 2
    },
    {
      title: 'Confirmer avec tous les prestataires ✅',
      description: 'Vérifier les détails avec chaque prestataire',
      category: 'vendors',
      priority: 'critical',
      estimatedDuration: 4
    },
    {
      title: 'Préparer les cadeaux d\'invités 🎁',
      description: 'Emballer les dragées et petits cadeaux',
      category: 'guests',
      priority: 'medium',
      estimatedDuration: 4
    },
    {
      title: 'Organiser la répétition 🎭',
      description: 'Planifier la répétition de cérémonie',
      category: 'logistics',
      priority: 'high',
      estimatedDuration: 3
    }
  ],
  '2_weeks': [
    {
      title: 'Faire le point sur les confirmations 📋',
      description: 'Vérifier qui a confirmé sa présence',
      category: 'guests',
      priority: 'high',
      estimatedDuration: 1
    },
    {
      title: 'Préparer le plan de table 🪑',
      description: 'Organiser le placement des invités',
      category: 'logistics',
      priority: 'high',
      estimatedDuration: 3
    },
    {
      title: 'Faire ses soins beauté 💆‍♀️',
      description: 'Manucure, épilation, soins du visage',
      category: 'beauty',
      priority: 'high',
      estimatedDuration: 4
    }
  ],
  '1_week': [
    {
      title: 'Récupérer la robe et accessoires 👗',
      description: 'Dernière vérification et récupération',
      category: 'attire',
      priority: 'critical',
      estimatedDuration: 1
    },
    {
      title: 'Préparer le trousseau 🧳',
      description: 'Emballer pour la lune de miel',
      category: 'honeymoon',
      priority: 'medium',
      estimatedDuration: 2
    },
    {
      title: 'Répétition générale 🎬',
      description: 'Répétition complète de la cérémonie',
      category: 'logistics',
      priority: 'critical',
      estimatedDuration: 3
    }
  ],
  wedding_day: [
    {
      title: 'Prendre un petit-déjeuner léger 🥐',
      description: 'Bien s\'alimenter pour tenir la journée',
      category: 'logistics',
      priority: 'high',
      estimatedDuration: 1
    },
    {
      title: 'Séance coiffure/maquillage 💄',
      description: 'Préparation beauté avec les professionnels',
      category: 'beauty',
      priority: 'critical',
      estimatedDuration: 3
    },
    {
      title: 'Photos de préparation 📸',
      description: 'Séance photo des préparatifs',
      category: 'logistics',
      priority: 'medium',
      estimatedDuration: 1
    },
    {
      title: 'Cérémonie 💒',
      description: 'Le moment tant attendu !',
      category: 'traditions',
      priority: 'critical',
      estimatedDuration: 2
    },
    {
      title: 'Réception et fête 🎊',
      description: 'Célébrer avec vos proches',
      category: 'traditions',
      priority: 'critical',
      estimatedDuration: 8
    }
  ],
  post_wedding: [
    {
      title: 'Remercier les prestataires 🙏',
      description: 'Envoyer des remerciements aux professionnels',
      category: 'administrative',
      priority: 'medium',
      estimatedDuration: 1
    },
    {
      title: 'Envoyer les remerciements 💌',
      description: 'Cartes de remerciement aux invités',
      category: 'guests',
      priority: 'medium',
      estimatedDuration: 2
    },
    {
      title: 'Trier et partager les photos 📱',
      description: 'Organiser et partager les souvenirs',
      category: 'administrative',
      priority: 'low',
      estimatedDuration: 4
    },
    {
      title: 'Démarches administratives 📋',
      description: 'Changement de nom, documents officiels',
      category: 'administrative',
      priority: 'high',
      estimatedDuration: 6
    }
  ]
}