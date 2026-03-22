const {
  registerSchema,
  loginSchema,
  agreementSchema,
  paymentSchema
} = require('../../utils/validator');

describe('Validator Service', () => {
  describe('registerSchema', () => {
    test('should validate valid registration data', () => {
      const validData = {
        phone: '0712345678',
        password: 'password123',
        name: 'John Doe'
      };

      const { error } = registerSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject invalid phone number', () => {
      const invalidData = {
        phone: '123',
        password: 'password123',
        name: 'John Doe'
      };

      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('phone');
    });

    test('should reject short password', () => {
      const invalidData = {
        phone: '0712345678',
        password: '123',
        name: 'John Doe'
      };

      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('password');
    });
  });

  describe('agreementSchema', () => {
    test('should validate valid agreement data', () => {
      const validData = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 5000,
        interestRate: 5.0,
        penaltyRate: 2.0,
        dueDate: '2024-12-31T23:59:59.000Z',
        terms: 'Loan terms and conditions'
      };

      const { error } = agreementSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject negative amount', () => {
      const invalidData = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: -1000
      };

      const { error } = agreementSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('positive');
    });

    test('should reject interest rate over 100', () => {
      const invalidData = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 1000,
        interestRate: 150
      };

      const { error } = agreementSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    test('should use default values for optional fields', () => {
      const data = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 1000,
        dueDate: '2024-12-31T23:59:59.000Z'
      };

      const { value } = agreementSchema.validate(data);
      expect(value.interestRate).toBe(5.0);
      expect(value.penaltyRate).toBe(2.0);
    });
  });

  describe('paymentSchema', () => {
    test('should validate valid payment data', () => {
      const validData = {
        agreementId: 'agreement1',
        amount: 500,
        notes: 'Monthly payment'
      };

      const { error } = paymentSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject zero amount', () => {
      const invalidData = {
        agreementId: 'agreement1',
        amount: 0
      };

      const { error } = paymentSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('positive');
    });
  });
});
