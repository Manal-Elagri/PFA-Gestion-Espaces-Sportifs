export interface Category {
    id: number;
    nom: string;
  }
  
  export interface MenuItem {
    id: number;
    nom: string;
    description: string;
    prix: number;
    imageURL: string;
    categorie: Category;
  }
  
  export interface CartItem extends MenuItem {
    quantite: number;
  }
  
  export interface CommandeMenuRequest {
    menu: {
      id: number;
    };
    quantite: number;
  }
  
  export interface Commande {
    id: number;
    dateCommande: string;
    prixTotal: number;
    etatCommande: EtatCommande;
    menus: MenuQuantite[];
  }

  export enum EtatCommande {
    EN_ATTENTE = 'EN_ATTENTE',
    EN_PREPARATION = 'EN_PREPARATION',
    PRET = 'PRET',
    LIVRE = 'LIVRE',
  }
  

  export interface MenuQuantite {
    menu: { id: number };
    quantite: number;
  }
  
  
  /*export interface CommandeMenu {
    menu: MenuItem;
    quantite: number;
  }*/
  
  