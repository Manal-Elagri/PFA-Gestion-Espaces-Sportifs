import {Client} from 'src/app/models/client.model';
import { CommandeMenu }  from 'src/app/models/commande-menu.model';


export interface Commande {
    id?: number;
    client: Client;
    dateCommande: Date;
    etatCommande: string;
    prixTotal: number;
    commandeMenus: CommandeMenu[];
  }
  