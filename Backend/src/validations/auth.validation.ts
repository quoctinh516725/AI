class AuthValidation {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  static isValidUsername(username: string): boolean {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  }
}

export default AuthValidation;
