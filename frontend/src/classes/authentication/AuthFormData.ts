type GPAuthFormType = "email" | "password";
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
    return this.password;
  }

  /**
   * On input change, sets the given field (either email or password) to the given value
   * @param field the field to set
   * @param value the value to set the field to
   */
  setAuthField(field: GPAuthFormType, value: string) {
    this[field] = value;
  }
}

export { AuthFormData, type GPAuthFormType };
