export interface PropertyQuery {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  sortBy?:string;
  page: number;
  limit: number;
}