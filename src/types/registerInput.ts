export interface UserRegisterInput {
  name: string;
  email: string;
  telephone: string;
  password: string;
  photo?: string;
  role: "DRIVER" | "INSTRUCTOR";
  gender: "MALE" | "FEMALE";
  city: string;
  state: string;
  confirmationToken?: string;
}
