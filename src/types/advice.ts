export type AdviceCategory = 
  | 'planning_timeline' // Planification et timeline
  | 'budget_tips' // Conseils budget
  | 'venue_selection' // Choix du lieu
  | 'vendor_selection' // Choix des prestataires
  | 'traditions_moroccan' // Traditions marocaines
  | 'traditions_tunisian' // Traditions tunisiennes
  | 'traditions_algerian' // Traditions algériennes
  | 'ceremonies' // Cérémonies (khotba, henné, etc.)
  | 'dress_attire' // Tenues et style
  | 'beauty_wellness' // Beauté et bien-être
  | 'photography' // Photographie
  | 'catering_menu' // Traiteur et menu
  | 'decorations' // Décoration
  | 'music_entertainment' // Musique et animation
  | 'guest_management' // Gestion des invités
  | 'legal_religious' // Aspects légaux et religieux
  | 'honeymoon' // Voyage de noces
  | 'stress_management' // Gestion du stress
  | 'family_dynamics' // Relations familiales
  | 'modern_fusion' // Mariage moderne-traditionnel

export type AdviceType = 'tip' | 'warning' | 'tradition' | 'cultural' | 'practical' | 'emotional'

export interface AdviceItem {
  id: string
  category: AdviceCategory
  type: AdviceType
  title: string
  content: string
  summary: string
  tags: string[]
  culture?: 'moroccan' | 'tunisian' | 'algerian' | 'general'
  timeline?: string // e.g., "12 mois avant", "1 semaine avant"
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string // e.g., "30 minutes", "2 heures"
  resources?: string[] // Links, books, contacts
  relatedAdvice?: string[] // IDs of related advice
  isPopular: boolean
  likes: number
  createdAt: Date
  updatedAt: Date
}

export const ADVICE_CATEGORIES: Record<AdviceCategory, { 
  label: string
  icon: string
  color: string
  description: string
}> = {
  planning_timeline: {
    label: 'Planification & Timeline',
    icon: '📅',
    color: 'blue',
    description: 'Organisation générale et planning du mariage'
  },
  budget_tips: {
    label: 'Conseils Budget',
    icon: '💰',
    color: 'green',
    description: 'Optimisation et gestion du budget mariage'
  },
  venue_selection: {
    label: 'Choix du Lieu',
    icon: '🏛️',
    color: 'purple',
    description: 'Sélection et négociation des lieux'
  },
  vendor_selection: {
    label: 'Choix des Prestataires',
    icon: '🤝',
    color: 'orange',
    description: 'Sélection et gestion des prestataires'
  },
  traditions_moroccan: {
    label: 'Traditions Marocaines',
    icon: '🇲🇦',
    color: 'red',
    description: 'Coutumes et traditions du mariage marocain'
  },
  traditions_tunisian: {
    label: 'Traditions Tunisiennes',
    icon: '🇹🇳',
    color: 'red',
    description: 'Coutumes et traditions du mariage tunisien'
  },
  traditions_algerian: {
    label: 'Traditions Algériennes',
    icon: '🇩🇿',
    color: 'red',
    description: 'Coutumes et traditions du mariage algérien'
  },
  ceremonies: {
    label: 'Cérémonies',
    icon: '💒',
    color: 'amber',
    description: 'Khotba, henné, nikah et autres cérémonies'
  },
  dress_attire: {
    label: 'Tenues & Style',
    icon: '👗',
    color: 'pink',
    description: 'Choix des tenues et style vestimentaire'
  },
  beauty_wellness: {
    label: 'Beauté & Bien-être',
    icon: '💄',
    color: 'rose',
    description: 'Préparation beauté et gestion du stress'
  },
  photography: {
    label: 'Photographie',
    icon: '📸',
    color: 'indigo',
    description: 'Conseils photo et vidéo'
  },
  catering_menu: {
    label: 'Traiteur & Menu',
    icon: '🍽️',
    color: 'yellow',
    description: 'Choix du menu et organisation du repas'
  },
  decorations: {
    label: 'Décoration',
    icon: '🎨',
    color: 'cyan',
    description: 'Décoration et ambiance'
  },
  music_entertainment: {
    label: 'Musique & Animation',
    icon: '🎵',
    color: 'violet',
    description: 'Animation musicale et divertissement'
  },
  guest_management: {
    label: 'Gestion des Invités',
    icon: '👥',
    color: 'teal',
    description: 'Organisation et protocole des invités'
  },
  legal_religious: {
    label: 'Légal & Religieux',
    icon: '📋',
    color: 'slate',
    description: 'Démarches administratives et religieuses'
  },
  honeymoon: {
    label: 'Voyage de Noces',
    icon: '✈️',
    color: 'sky',
    description: 'Organisation du voyage de noces'
  },
  stress_management: {
    label: 'Gestion du Stress',
    icon: '🧘',
    color: 'emerald',
    description: 'Techniques de relaxation et bien-être'
  },
  family_dynamics: {
    label: 'Relations Familiales',
    icon: '👨‍👩‍👧‍👦',
    color: 'orange',
    description: 'Gestion des relations et conflits familiaux'
  },
  modern_fusion: {
    label: 'Fusion Moderne-Traditionnel',
    icon: '🔄',
    color: 'purple',
    description: 'Mélange harmonieux tradition et modernité'
  }
}

export const ADVICE_TYPES: Record<AdviceType, { 
  label: string
  icon: string
  color: string
}> = {
  tip: { label: 'Conseil', icon: '💡', color: 'blue' },
  warning: { label: 'Attention', icon: '⚠️', color: 'orange' },
  tradition: { label: 'Tradition', icon: '🏺', color: 'amber' },
  cultural: { label: 'Culturel', icon: '🌍', color: 'green' },
  practical: { label: 'Pratique', icon: '🔧', color: 'gray' },
  emotional: { label: 'Émotionnel', icon: '💕', color: 'pink' }
}

// Sample advice content - this would be expanded significantly
export const SAMPLE_ADVICE: AdviceItem[] = [
  {
    id: '1',
    category: 'ceremonies',
    type: 'tradition',
    title: 'Comment organiser la cérémonie de la Khotba',
    summary: 'La khotba est la demande en mariage officielle. Voici comment bien l\'organiser selon les traditions.',
    content: `La cérémonie de la Khotba est un moment crucial dans les traditions maghrébines. Elle marque la demande officielle en mariage et l'accord des familles.

**Préparation (2-3 semaines avant):**
- Choisir une date propice selon le calendrier islamique
- Préparer les cadeaux traditionnels (bijoux, henné, dattes, lait...)
- Inviter les proches des deux familles
- Préparer un repas traditionnel

**Déroulement de la cérémonie:**
1. Arrivée de la famille du prétendant avec les cadeaux
2. Lecture de la Fatiha
3. Échange des cadeaux et bénédictions
4. Partage du repas en famille
5. Fixation de la date du mariage

**Conseils pratiques:**
- Respecter l'ordre protocolaire des familles
- Prévoir suffisamment de place pour tous les invités
- Préparer un discours de présentation des familles
- Documenter ce moment avec des photos

**Cadeaux traditionnels à prévoir:**
- Bijoux en or pour la future mariée
- Henné et produits de beauté
- Dattes et fruits secs
- Tissus précieux
- Parfums traditionnels`,
    tags: ['khotba', 'demande mariage', 'tradition', 'famille', 'cérémonie'],
    culture: 'general',
    timeline: '6-12 mois avant',
    difficulty: 'intermediate',
    estimatedTime: '1 journée',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    category: 'traditions_moroccan',
    type: 'cultural',
    title: 'La cérémonie du Henné marocaine',
    summary: 'Tout savoir sur l\'organisation d\'une soirée henné traditionnelle marocaine.',
    content: `La soirée henné est l'une des traditions les plus importantes du mariage marocain. Elle se déroule généralement la veille du mariage.

**Préparation de la mariée:**
- Bain traditionnel au savon noir et gommage
- Application du henné par une experte (neqqacha)
- Port du caftan traditionnel
- Maquillage et coiffure traditionnels

**Organisation de la soirée:**
- Décoration avec des bougies et des pétales de rose
- Musique traditionnelle avec bendir et derbouka
- Danses folkloriques (chaâbi, ahidous...)
- Chants traditionnels par les femmes de la famille

**Menu traditionnel:**
- Pâtisseries orientales (chebakia, sellou...)
- Thé à la menthe et café
- Fruits secs et dattes
- Lait aux amandes

**Rituels importants:**
- Application du henné sur les mains et pieds
- Bénédictions des femmes âgées
- Remise des cadeaux à la mariée
- Partage de conseils de mariage

**Conseils d'organisation:**
- Réserver une neqqacha expérimentée
- Prévoir 3-4 heures pour la cérémonie
- Inviter uniquement les femmes des deux familles
- Prévoir des coussins et tapis pour s'asseoir`,
    tags: ['henné', 'marocain', 'tradition', 'femmes', 'neqqacha'],
    culture: 'moroccan',
    timeline: '1 jour avant',
    difficulty: 'intermediate',
    estimatedTime: '4 heures',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    category: 'budget_tips',
    type: 'tip',
    title: 'Comment économiser 30% sur votre budget mariage',
    summary: 'Astuces pratiques pour réduire considérablement le coût de votre mariage sans sacrifier la qualité.',
    content: `Organiser un beau mariage avec un budget maîtrisé, c'est possible ! Voici nos conseils d'experts.

**1. Choisir la bonne saison (Économie: 20-40%)**
- Éviter mai, juin, septembre (haute saison)
- Privilégier novembre à mars
- Mariage en semaine = -30% sur les prestataires

**2. Optimiser le lieu (Économie: 15-25%)**
- Lieux non-dédiés (mairies, espaces associatifs...)
- Négocier un forfait tout compris
- Éviter les lieux avec restrictions de traiteurs

**3. Traiteur intelligent (Économie: 20-30%)**
- Buffet au lieu de service à table
- Menu unique adapté à tous
- Négocier selon le nombre d'invités
- Inclure les boissons dans le forfait

**4. Décoration DIY (Économie: 50-70%)**
- Créer ses centres de table
- Utiliser des fleurs de saison
- Louer au lieu d'acheter
- Récupérer la déco d'autres mariages

**5. Invitations numériques (Économie: 80-90%)**
- Sites spécialisés gratuits
- QR codes pour les infos pratiques
- RSVP en ligne automatisé

**6. Alliances et bijoux (Économie: 30-50%)**
- Acheter en ligne avec certification
- Bijoux vintages ou d'occasion
- Négocier un paiement en plusieurs fois

**Erreurs à éviter:**
- Ne pas comparer les devis
- Oublier les frais cachés
- Ne pas négocier les acomptes
- Acheter impulsivement

**Budget type pour 100 invités:**
- Version économique: 8 000-12 000€
- Version standard: 15 000-20 000€
- Version premium: 25 000-35 000€`,
    tags: ['budget', 'économies', 'négociation', 'astuces', 'planification'],
    timeline: '12 mois avant',
    difficulty: 'beginner',
    estimatedTime: '2 heures de recherche',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    category: 'vendor_selection',
    type: 'practical',
    title: 'Guide complet des prestataires mariage',
    summary: 'Comment choisir, négocier et gérer tous vos prestataires mariage pour un jour J réussi.',
    content: `Choisir les bons prestataires est crucial pour la réussite de votre mariage. Voici notre guide complet.

**TRAITEUR & RESTAURATION**
**Questions essentielles:**
- Quelle est votre spécialité culinaire ?
- Proposez-vous des dégustations ?
- Gérez-vous les allergies alimentaires ?
- Quel service proposez-vous (buffet, assis, cocktail) ?
- Inclut-il les boissons et le service ?

**À négocier:**
- Repas gratuits pour les mariés
- Réduction si +100 invités
- Possibilité de ramener un gâteau extérieur
- Formule tout compris avec décoration

**PHOTOGRAPHE & VIDÉASTE**
**Portfolio obligatoire:**
- Mariages complets (pas que des highlights)
- Diversité des styles et cultures
- Qualité constante sur plusieurs années
- Témoignages clients récents

**Questions techniques:**
- Matériel de backup prévu ?
- Délais de livraison ?
- Nombre de photos retouchées ?
- Droits d'utilisation des images ?

**MUSIQUE & ANIMATION**
**Types de prestataires:**
- DJ traditionnel avec playlist
- Groupe de musique live
- Animateur avec jeux et ambiance
- Combo DJ + musiciens

**Points à vérifier:**
- Matériel son adapté au lieu
- Répertoire musical varié
- Expérience mariages multiculturels
- Assurance et licence SACEM

**DECORATION & FLEURISTE**
**Services inclus:**
- Visite technique du lieu
- Croquis et visualisation 3D
- Livraison et installation
- Enlèvement après la fête

**Négociation déco:**
- Récupération des arrangements
- Fleurs de saison = prix réduit
- Package complet plus avantageux
- Possibilité de location

**COIFFURE & MAQUILLAGE**
**Essais obligatoires:**
- Test 2 mois avant minimum
- Avec votre robe et accessoires
- Photos sous différents éclairages
- Validation du style final

**Le jour J:**
- Arrivée 3h avant la cérémonie
- Kit de retouches fourni
- Accompagnement possible
- Maquillage longue tenue

**TRANSPORT & LOGISTIQUE**
**Options disponibles:**
- Voiture de luxe décorée
- Calèche traditionnelle
- Transport collectif invités
- Navettes hôtel-lieu

**GESTION DES CONTRATS**
**Clauses importantes:**
- Acompte maximum 30%
- Conditions d'annulation
- Assurance responsabilité civile
- Pénalités de retard

**PLANNING DE RÉSERVATION**
- 12 mois avant: Lieu, traiteur, photographe
- 8 mois avant: Musique, décoration
- 6 mois avant: Coiffure, maquillage, transport
- 3 mois avant: Finalisation détails

**BUDGET TYPE PAR PRESTATAIRE**
- Traiteur: 40-50% du budget total
- Photographe: 8-12%
- Musique: 5-8%
- Décoration: 8-15%
- Coiffure/maquillage: 3-5%
- Transport: 2-3%`,
    tags: ['prestataires', 'négociation', 'contrats', 'planning', 'budget'],
    timeline: '12-6 mois avant',
    difficulty: 'intermediate',
    estimatedTime: '3 semaines de recherche',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    category: 'music_entertainment',
    type: 'cultural',
    title: 'Mariage sans musique : alternatives et solutions',
    summary: 'Comment organiser un mariage festif et mémorable sans musique, en respectant les convictions religieuses.',
    content: `Organiser un mariage sans musique tout en conservant une ambiance festive est possible. Voici nos solutions.

**ALTERNATIVES À LA MUSIQUE**

**1. Animations vocales**
- Chants religieux a cappella
- Récitations de poésie
- Contes et histoires traditionnelles
- Discours inspirants et témoignages

**2. Spectacles culturels**
- Danses folkloriques silencieuses
- Représentations théâtrales
- Démonstrations d'arts martiaux
- Calligraphie en direct

**3. Activités participatives**
- Jeux de société géants
- Concours de culture générale
- Ateliers créatifs (henné, calligraphie)
- Photobooth avec accessoires

**AMBIANCE SONORE SANS MUSIQUE**

**Sons naturels:**
- Fontaines et jets d'eau
- Chants d'oiseaux (volières)
- Bruits de la nature (enregistrements)
- Sonnettes et carillons doux

**Effets sonores:**
- Applaudissements rythmés
- Youyous traditionnels
- Claquements de mains
- Percussions douces (daf, bendir)

**TIMING ET PROGRAMME**

**Cérémonie (1h30):**
- Arrivée en procession silencieuse
- Lecture de textes sacrés
- Échange des vœux
- Bénédictions familiales

**Réception (3h):**
- Discours de bienvenue
- Présentation des familles
- Jeux et animations
- Repas avec conversations

**Soirée (2h):**
- Spectacles culturels
- Témoignages émouvants
- Activités de groupe
- Prières et bénédictions

**DÉCORATION COMPENSATOIRE**

**Visuel renforcé:**
- Éclairage dramatique et coloré
- Projections d'images et citations
- Fleurs et parfums envoûtants
- Tissus et textures luxueuses

**Expérience sensorielle:**
- Diffusion de parfums naturels
- Textures tactiles variées
- Dégustations surprises
- Températures contrastées

**GESTION DES INVITÉS**

**Communication préalable:**
- Expliquer le concept sur l'invitation
- Préparer les invités à l'ambiance
- Proposer des activités alternatives
- Rassurer sur l'aspect festif

**Rôles actifs:**
- Distribuer des rôles d'animation
- Encourager les talents personnels
- Créer des équipes pour les jeux
- Responsabiliser les témoins

**SOLUTIONS TECHNIQUES**

**Sonorisation:**
- Micros pour les discours
- Système de diffusion douce
- Réglages audio optimaux
- Technicien dédié

**Coordination:**
- Maître de cérémonie expérimenté
- Planning détaillé minute par minute
- Signalétique claire pour tous
- Équipe de coordination

**BUDGET RÉALLOUÉ**

**Économies réalisées:**
- Pas de DJ ou groupe (€1000-3000)
- Moins de matériel son
- Moins de frais SACEM

**Réinvestissement:**
- Décoration plus luxueuse
- Animations alternatives
- Nourriture plus raffinée
- Cadeaux invités personnalisés

**TÉMOIGNAGES & RETOURS**

*"Notre mariage sans musique a été plus intime et spirituel. Les invités ont participé activement et l'ambiance était magique."* - Fatima & Ahmed

*"Les animations culturelles ont permis de découvrir nos traditions familiales. C'était éducatif et émouvant."* - Khadija & Youssef

**CONSEILS PRATIQUES**

- Prévoir plus d'animations qu'un mariage classique
- Tester les activités avant le jour J
- Avoir un plan B pour chaque animation
- Former une équipe d'animation familiale
- Prévoir des pauses régulières`,
    tags: ['sans musique', 'religieux', 'animations', 'culturel', 'alternatif'],
    timeline: '6 mois avant',
    difficulty: 'advanced',
    estimatedTime: '2 mois de préparation',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    category: 'traditions_tunisian',
    type: 'tradition',
    title: 'Les traditions du mariage tunisien',
    summary: 'Découvrez les coutumes et rituels du mariage traditionnel tunisien, du Malouf à la Keswa.',
    content: `Le mariage tunisien est riche en traditions séculaires. Voici un guide complet des rituels et coutumes.

**LA DEMANDE EN MARIAGE (KHOTBA)**

**Préparation:**
- Visite préalable des familles
- Échange des informations généalogiques
- Vérification de la compatibilité
- Consultation des anciens

**Cérémonie:**
- Récitation de la Fatiha
- Échange des cadeaux traditionnels
- Bénédictions des familles
- Fixation de la date du mariage

**Cadeaux traditionnels:**
- Bijoux en or pour la future épouse
- Parfums et henné
- Dattes et pâtisseries
- Tissus précieux

**LES FIANÇAILLES (KHOTBA OFFICIALISÉE)**

**Rituels:**
- Échange des alliances
- Lecture du Coran
- Bénédictions religieuses
- Partage d'un repas festif

**Préparatifs:**
- Préparation du trousseau
- Achat des bijoux
- Réservation du lieu
- Préparation des tenues

**LA SOIRÉE HENNÉ (LAYLAT AL-HENNA)**

**Préparation de la mariée:**
- Bain traditionnel au savon d'Alep
- Application du henné par une experte
- Maquillage aux produits naturels
- Port de la robe traditionnelle

**Rituels:**
- Danses folkloriques (Malouf)
- Chants traditionnels
- Jeux et devinettes
- Conseils matrimoniaux

**Musique traditionnelle:**
- Oud et qanun
- Darbouka et riq
- Chants en arabe dialectal
- Mélodies ancestrales

**LE JOUR DU MARIAGE**

**Matin - Préparation:**
- Réveil avec chants traditionnels
- Petit-déjeuner en famille
- Préparation de la mariée
- Bénédictions matinales

**Après-midi - Cérémonie:**
- Cortège nuptial
- Cérémonie religieuse (Nikah)
- Signatures et témoignages
- Photos officielles

**Soirée - Réception:**
- Entrée des mariés
- Danses traditionnelles
- Banquet tunisien
- Youyous et félicitations

**LA KESWA (TENUE TRADITIONNELLE)**

**Composants:**
- Keswa en soie ou velours
- Bijoux en or (khomsa, torque)
- Chéchia ou turban brodé
- Chaussures traditionnelles

**Couleurs symboliques:**
- Rouge : bonheur et fertilité
- Blanc : pureté et innocence
- Doré : prospérité et richesse
- Vert : espoir et renaissance

**MENU TRADITIONNEL**

**Entrées:**
- Brik à l'œuf
- Salade méchouia
- Houmous et moutabel
- Olives et cornichons

**Plats principaux:**
- Couscous aux légumes
- Agneau aux pruneaux
- Poisson grillé
- Tajine tunisien

**Desserts:**
- Makroudh aux dattes
- Baklava au miel
- Zlabia dorée
- Fruits frais et secs

**TRADITIONS FAMILIALES**

**Rôle des femmes:**
- Préparation collective
- Transmission des savoirs
- Accompagnement de la mariée
- Bénédictions et conseils

**Rôle des hommes:**
- Négociations familiales
- Aspects religieux
- Logistique et organisation
- Accueil des invités

**MUSIQUE ET DANSES**

**Genres traditionnels:**
- Malouf (musique andalouse)
- Stambali (rythmes africains)
- Mezoued (musique populaire)
- Chansons de mariage

**Instruments:**
- Oud (luth arabe)
- Qanun (cithare)
- Nay (flûte)
- Percussions variées

**CONSEILS MODERNES**

**Adaptation contemporaine:**
- Mélange tradition-modernité
- Respect des valeurs ancestrales
- Intégration des nouvelles technologies
- Confort des invités

**Organisation pratique:**
- Planification 6 mois à l'avance
- Réservation des spécialistes
- Préparation des costumes
- Coordination avec les familles

**BUDGET ESTIMATIF**

**Poste de dépenses:**
- Keswa et bijoux : 3000-8000€
- Musique traditionnelle : 500-1500€
- Décoration : 1000-3000€
- Nourriture : 50-100€ par personne
- Henné et beauté : 300-800€`,
    tags: ['tunisien', 'keswa', 'malouf', 'traditions', 'coutumes'],
    culture: 'tunisian',
    timeline: '6 mois avant',
    difficulty: 'intermediate',
    estimatedTime: '3 mois de préparation',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    category: 'traditions_algerian',
    type: 'tradition',
    title: 'Mariage algérien : traditions berbères et arabes',
    summary: 'Explorez les riches traditions du mariage algérien, des coutumes berbères aux rituels arabes.',
    content: `Le mariage algérien mélange harmonieusement les traditions berbères et arabes. Découvrez cette richesse culturelle.

**TRADITIONS BERBÈRES (AMAZIGH)**

**La demande (Aseggas)**
- Visite des anciens de la tribu
- Échange des généalogies
- Vérification de la compatibilité
- Bénédictions en tamazight

**Préparatifs berbères:**
- Confection des bijoux en argent
- Préparation du costume traditionnel
- Tissage des tapis de mariage
- Préparation des tatouages henné

**Rituels berbères:**
- Danses ahellil et ahwach
- Chants en berbère
- Musique traditionnelle (bendir, ghaita)
- Couscous cérémonial

**TRADITIONS ARABES**

**La Khotba arabe:**
- Récitation du Coran
- Demande officielle
- Échange des cadeaux
- Bénédictions religieuses

**Préparatifs arabes:**
- Préparation du trousseau
- Achat des bijoux en or
- Réservation du lieu
- Préparation des tenues

**RÉGIONS ET SPÉCIFICITÉS**

**Kabylie (Berbère):**
- Robe kabyle brodée
- Bijoux en argent ciselé
- Danses traditionnelles
- Cuisine berbère

**Aurès (Chaoui):**
- Costume chaoui coloré
- Musique chaouie
- Traditions montagnardes
- Hospitalité légendaire

**Ouest algérien (Arabe):**
- Influence andalouse
- Musique raï
- Costumes brodés
- Cuisine oranaise

**Constantine (Malouf):**
- Musique savante
- Costumes raffinés
- Traditions citadines
- Hospitalité constantinoise

**COSTUMES TRADITIONNELS**

**Femme berbère:**
- Robe traditionnelle (aγeris)
- Bijoux en argent
- Foulard brodé
- Chaussures berbères

**Femme arabe:**
- Karakou constantinois
- Bijoux en or
- Voile brodé
- Babouches dorées

**Homme berbère:**
- Burnous blanc
- Chéchia berbère
- Ceinture tissée
- Babouches en cuir

**Homme arabe:**
- Costume traditionnel
- Turban ou chéchia
- Ceinture brodée
- Babouches pointues

**MUSIQUE ET DANSES**

**Musique berbère:**
- Ahellil (chant collectif)
- Ahwach (danse de groupe)
- Instruments : bendir, ghaita
- Rythmes ancestraux

**Musique arabe:**
- Raï moderne
- Malouf constantinois
- Hawzi oranais
- Instruments : oud, qanun

**GASTRONOMIE DE MARIAGE**

**Plats berbères:**
- Couscous aux légumes
- Tajine de viande
- Chakhchoukha
- Pâtisseries au miel

**Plats arabes:**
- Mechoui (agneau rôti)
- Dolma (légumes farcis)
- Makroudh
- Zlabia

**RITUELS SPÉCIFIQUES**

**Rituel du henné:**
- Application artistique
- Motifs berbères/arabes
- Chants traditionnels
- Bénédictions des femmes

**Rituel du lait:**
- Partage du lait
- Symbole de pureté
- Bénédictions maternelles
- Vœux de fertilité

**ORGANISATION MODERNE**

**Planification:**
- Choix de la région d'inspiration
- Sélection des traditions
- Coordination avec les familles
- Respect des coutumes

**Adaptations contemporaines:**
- Fusion des traditions
- Respect des valeurs
- Confort moderne
- Photographie professionnelle

**CONSEILS PRATIQUES**

**Préparation (6 mois):**
- Recherche des spécialistes
- Commande des costumes
- Réservation des musiciens
- Préparation du menu

**Jour J:**
- Coordination des rituels
- Respect du timing
- Traduction pour les invités
- Documentation photographique

**BUDGET ESTIMATIF**

**Costumes traditionnels:** 2000-6000€
**Musique traditionnelle:** 800-2000€
**Décoration berbère/arabe:** 1500-4000€
**Nourriture traditionnelle:** 40-80€/personne
**Henné et beauté:** 400-1000€
**Bijoux traditionnels:** 1000-5000€

**TÉMOIGNAGES**

*"Notre mariage kabyle a honoré nos ancêtres tout en célébrant notre amour. Les traditions berbères ont donné une dimension sacrée à notre union."* - Lynda & Karim

*"Mélanger les traditions de nos régions (Kabylie et Constantine) a créé une célébration unique et mémorable."* - Amina & Sofiane`,
    tags: ['algérien', 'berbère', 'kabyle', 'traditions', 'amazigh'],
    culture: 'algerian',
    timeline: '6 mois avant',
    difficulty: 'intermediate',
    estimatedTime: '3 mois de préparation',
    isPopular: true,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]