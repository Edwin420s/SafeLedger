const { encrypt, decrypt } = require('../../utils/encryption');

describe('Encryption Service', () => {
  describe('encrypt/decrypt', () => {
    test('should encrypt and decrypt text correctly', () => {
      const plaintext = 'This is a secret message';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':'); // Should contain iv:authTag:encrypted format
    });

    test('should generate different encrypted values for same input', () => {
      const plaintext = 'Same message';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      expect(encrypted1).not.toBe(encrypted2); // Different IVs
    });

    test('should decrypt both to same original', () => {
      const plaintext = 'Same message';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    test('should handle empty string', () => {
      const plaintext = '';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test('should handle special characters', () => {
      const plaintext = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test('should handle unicode characters', () => {
      const plaintext = 'Unicode: 🚀 💰 📝 🔒';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test('should throw error for invalid encrypted format', () => {
      expect(() => decrypt('invalid-format')).toThrow();
    });

    test('should throw error for tampered data', () => {
      const plaintext = 'Original message';
      const encrypted = encrypt(plaintext);
      const tampered = encrypted.replace(/[a-f0-9]/, 'x'); // Change one character

      expect(() => decrypt(tampered)).toThrow();
    });
  });
});
