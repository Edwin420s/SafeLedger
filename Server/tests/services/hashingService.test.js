const { hashAgreement } = require('../../services/hashingService');

describe('Hashing Service', () => {
  describe('hashAgreement', () => {
    test('should generate consistent hash for same input', () => {
      const agreement = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 1000,
        dueDate: '2024-12-31',
        terms: 'Test terms'
      };

      const hash1 = hashAgreement(agreement);
      const hash2 = hashAgreement(agreement);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex format
    });

    test('should generate different hashes for different inputs', () => {
      const agreement1 = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 1000,
        dueDate: '2024-12-31'
      };

      const agreement2 = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 2000, // Different amount
        dueDate: '2024-12-31'
      };

      const hash1 = hashAgreement(agreement1);
      const hash2 = hashAgreement(agreement2);

      expect(hash1).not.toBe(hash2);
    });

    test('should handle empty object', () => {
      const hash = hashAgreement({});
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    test('should handle nested objects', () => {
      const agreement = {
        lenderId: 'user1',
        borrowerId: 'user2',
        amount: 1000,
        metadata: {
          created: '2024-01-01',
          version: '1.0'
        }
      };

      const hash = hashAgreement(agreement);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
