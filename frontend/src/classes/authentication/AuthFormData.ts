type GPAuthFormType = "email" | "password"
class AuthFormData {
  email: string;
  password: string;

  constructor(email?: string, password?: string) {
    this.email = email ?? "";
    this.password = password ?? "";
  }

  get getEmail() {
    return this.email;
  }

  get getPassword() {
    return this.password
  }

  setAuthField (field: GPAuthFormType, value: string){
    this[field] = value
  }
}

export {AuthFormData, type GPAuthFormType}