export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}