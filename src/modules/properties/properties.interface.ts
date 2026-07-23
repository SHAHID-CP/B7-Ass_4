export interface PropertyQuery {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  page: number;
  limit: number;
}