export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}

export interface LoginInput {
  email: string;
  passwords: string;
}
