export interface Competition {
    id: number;
    nom: string;
    description: string;
    imageURL: string;
    dateDebut: Date;
    dateFin: Date;
    etatCompetition: StatutCompetition;
    categorieCompetition: CategorieCompetition;
    typedesport: TypeDeSport;
  }
  
  export interface Club {
    id: number;
    nom: string;
    etablissement: string;
    imageURL: string;
    responsable?: CompteResponsable;  // Ajouté comme optionnel car utilisé dans le template
  }
  
  export interface ClubCompetition {
    id: number;
    club: Club;
    competition: Competition;
    statutParticipation: StatutParticipation;
    dateInscription: Date; 
  }
  
  export enum StatutParticipation {
    INSCRIT = 'INSCRIT',
    VALIDE = 'VALIDE',
    ELIMINE = 'ELIMINE'
  }
  
  export enum StatutCompetition {
    À_venir = 'À_venir',
    EN_COURS = 'EN_COURS',
    Terminé = 'Terminé'
  }
  
  export enum CategorieCompetition {
    TOURNOI_Ramadan = 'TOURNOI_Ramadan',
    COUPE_Universitaire = 'COUPE_Universitaire',
    LIGUE_InterClubs = 'LIGUE_InterClubs',
    CHAMPIONNAT_Regional = 'CHAMPIONNAT_Regional',
    TOURNOI_Estival = 'TOURNOI_Estival',
    LIGUE_Des_Filieres = 'LIGUE_Des_Filieres',
    GALA_Sportif = 'GALA_Sportif',
    JOURNEE_Sportive = 'JOURNEE_Sportive',
    OLYMPIADE_Univ = 'OLYMPIADE_Univ',
    TOURNOI_Fin_Annee = 'TOURNOI_Fin_Annee',
    Competition_interEcole = 'Competition_interEcole'
  }
  
  export enum TypeDeSport {
    FOOTBALL = 'FOOTBALL',
    BASKETBALL = 'BASKETBALL',
    VOLLEYBALL = 'VOLLEYBALL',
    TENNIS = 'TENNIS',
    MULTISPORTS = 'MULTISPORTS'
  }

  export interface CompteResponsable {
    id: number;
    nom_responsable: string;
    prenom_responsable: string;
    email: string;
  }
  