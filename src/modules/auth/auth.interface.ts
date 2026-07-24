export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TUpdateProfilePayload {
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
};