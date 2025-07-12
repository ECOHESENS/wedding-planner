import { Culture, ChecklistCategory } from '@prisma/client'

export interface ChecklistTemplate {
  title: string
  category: ChecklistCategory
  cultures: Culture[]
  description?: string
}

export const checklistTemplates: ChecklistTemplate[] = [
  // Engagement (Fiançailles)
  {
    title: "Organiser la demande en mariage",
    category: "ENGAGEMENT",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Choisir la bague de fiançailles",
    category: "ENGAGEMENT",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Annoncer les fiançailles à la famille",
    category: "ENGAGEMENT",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },

  // Khotba (Demande officielle)
  {
    title: "Organiser la visite des familles",
    category: "KHOTBA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Préparer les tenues traditionnelles pour la Khotba",
    category: "KHOTBA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Organiser le repas de la Khotba",
    category: "KHOTBA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Échanger les cadeaux traditionnels",
    category: "KHOTBA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },

  // Henna
  {
    title: "Réserver la Negafa",
    category: "HENNA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Choisir les tenues pour la soirée henné",
    category: "HENNA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Organiser la décoration traditionnelle",
    category: "HENNA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Préparer le henné et les accessoires",
    category: "HENNA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Organiser l'animation musicale traditionnelle",
    category: "HENNA",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },

  // EVJF (Enterrement de vie de jeune fille)
  {
    title: "Planifier l'EVJF avec les amies",
    category: "BACHELORETTE",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Réserver le lieu pour l'EVJF",
    category: "BACHELORETTE",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Organiser les activités de l'EVJF",
    category: "BACHELORETTE",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },

  // Mariage religieux
  {
    title: "Réserver la mosquée",
    category: "RELIGIOUS_CEREMONY",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Organiser la cérémonie religieuse",
    category: "RELIGIOUS_CEREMONY",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Préparer les témoins",
    category: "RELIGIOUS_CEREMONY",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },

  // Mariage civil
  {
    title: "Déposer le dossier de mariage en mairie",
    category: "CIVIL_CEREMONY",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Organiser la cérémonie civile",
    category: "CIVIL_CEREMONY",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Choisir les témoins pour la mairie",
    category: "CIVIL_CEREMONY",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },

  // Réception
  {
    title: "Réserver la salle de réception",
    category: "RECEPTION",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Choisir le traiteur",
    category: "RECEPTION",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Organiser la décoration de la salle",
    category: "RECEPTION",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Réserver le photographe",
    category: "RECEPTION",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Choisir l'animation musicale",
    category: "RECEPTION",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },

  // Trousseau
  {
    title: "Préparer le trousseau de la mariée",
    category: "TROUSSEAU",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Acheter la lingerie de maison",
    category: "TROUSSEAU",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },
  {
    title: "Organiser la présentation du trousseau",
    category: "TROUSSEAU",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN],
  },

  // Général
  {
    title: "Envoyer les invitations",
    category: "GENERAL",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Gérer les confirmations des invités",
    category: "GENERAL",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Organiser l'hébergement pour les invités",
    category: "GENERAL",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
  {
    title: "Préparer les cadeaux pour les invités",
    category: "GENERAL",
    cultures: [Culture.MOROCCAN, Culture.TUNISIAN, Culture.ALGERIAN, Culture.FRENCH],
  },
]