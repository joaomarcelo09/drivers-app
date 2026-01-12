export interface UserRegisterInput {
  name: string;
  email: string;
  telephone: string;
  password: string;
  role: "DRIVER" | "INSTRUCTOR";
  gender: "MALE" | "FEMALE";
  city: string;
  state: string;
}
