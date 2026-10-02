// Énumération pour l'état des réservations
export enum EtatReservationTerrain {
  EN_ATTENTE = "EN_ATTENTE",
  VALIDEE = "VALIDEE",
  REFUSEE = "REFUSEE"
}

// Interface pour le terrain
export interface Terrain {
  id: number;
  nom: string;
  mesure: string;
  estDisponible: boolean;
  categorieTerrain: CategorieTerrain;
  imageURL: string;
  type?: string;  // Ajouté comme optionnel car utilisé dans le template
}

// Énumération pour la catégorie de terrain
export enum CategorieTerrain {
  ATHLETISME = "ATHLETISME",
  BASKETBALL = "BASKETBALL",
  FOOTBALL = "FOOTBALL",
  HANDBALL = "HANDBALL",
  MULTISPORTS = "MULTISPORTS",
  TENNIS = "TENNIS",
  VOLLEYBALL = "VOLLEYBALL"
}

// Interface pour l'équipe
export interface Equipe {
  id: number;
  nom_equipe: string;
  imageURL: string;
  nbr_joueurs: number;
  responsable?: CompteResponsable;  // Ajouté comme optionnel car utilisé dans le template
}

// Interface pour la réservation de terrain
export interface ReservationTerrain {
  id: number;
  equipe: Equipe;
  terrain: Terrain;
  dateReservation: Date; // Date de création de la réservation
  calendrier: Date; // Date prévue d'utilisation du terrain
  etatReservation: EtatReservationTerrain;
}

// Interface pour le compte responsable
export interface CompteResponsable {
  id: number;
  nom_responsable: string;
  prenom_responsable: string;
  email: string;
}

// Interface pour les données du calendrier
export interface CalendrierData {
  dateCalendrier: Date;
  terrain: Terrain;
  equipe: Equipe;
  etatReservation: EtatReservationTerrain;
}

// Interface pour les jours occupés par terrain

// Ajoutez cette interface
export interface JoursOccupes {
  [terrainId: string]: string[]; // ou Date[] si vous préférez
}