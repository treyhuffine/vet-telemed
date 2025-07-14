import validator from 'validator';

export interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
    validator?: (value: any) => boolean;
  }>;
}

export class InputValidator {
  static validate(data: any, rules: ValidationRule[]): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const value = data[rule.field];

      for (const validation of rule.rules) {
        let isValid = true;

        switch (validation.type) {
          case 'required':
            isValid = value !== undefined && value !== null && value !== '';
            break;

          case 'email':
            isValid = !value || validator.isEmail(value);
            break;

          case 'minLength':
            isValid = !value || value.length >= validation.value;
            break;

          case 'maxLength':
            isValid = !value || value.length <= validation.value;
            break;

          case 'pattern':
            isValid = !value || validation.value.test(value);
            break;

          case 'custom':
            isValid = !value || (validation.validator ? validation.validator(value) : true);
            break;
        }

        if (!isValid) {
          errors[rule.field] = validation.message;
          break; // Stop checking other rules for this field
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static sanitizeInput(input: string): string {
    // Remove any potential XSS attempts
    return validator.escape(input);
  }

  static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeInput(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = this.sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  }

  static isValidPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static isValidPhoneNumber(phone: string): boolean {
    // Basic phone validation - can be enhanced based on requirements
    return validator.isMobilePhone(phone, 'any');
  }

  static isValidURL(url: string): boolean {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    });
  }

  static isValidUUID(uuid: string): boolean {
    return validator.isUUID(uuid);
  }
}