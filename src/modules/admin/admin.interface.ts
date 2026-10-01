export interface IGetAllUsersQuery {
  searchTerm?: string;
  page?: number;
  limit?: number;
  role?: string;
}