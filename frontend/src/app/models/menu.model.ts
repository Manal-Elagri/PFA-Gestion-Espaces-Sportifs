import { Category } from './category.model';

export interface Menu {
  id: number;
  nom: string;
  prix: number;
  description: string;
  imageURL: string;
  categorie: Category;
}