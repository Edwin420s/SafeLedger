const request = require('supertest');
const app = require('../../app');
const prisma = require('../../config/db');

describe('API Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Create test user
    const userData = {
      phone: '0712345678',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData);

    authToken = response.body.token;
    userId = response.body.user?.id || response.body.userId;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.payment.deleteMany();
    await prisma.agreement.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Health Check', () => {
    test('GET /health should return ok status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });

  describe('Authentication', () => {
    test('POST /api/users/register should create new user', async () => {
      const userData = {
        phone: '0712345679',
        password: 'password123',
        name: 'Another User'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.phone).toBe(userData.phone);
      expect(response.body.token).toBeDefined();
    });

    test('POST /api/users/login should authenticate user', async () => {
      const loginData = {
        phone: '0712345678',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body.user.phone).toBe(loginData.phone);
      expect(response.body.token).toBeDefined();
    });

    test('should reject invalid credentials', async () => {
      const loginData = {
        phone: '0712345678',
        password: 'wrongpassword'
      };

      await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Agreements', () => {
    test('POST /api/agreements should create agreement', async () => {
      const agreementData = {
        borrowerId: '0712345679', // Phone number of existing user
        amount: 1000,
        interestRate: 5.0,
        penaltyRate: 2.0,
        dueDate: '2024-12-31T23:59:59.000Z',
        terms: 'Test loan agreement'
      };

      const response = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${authToken}`)
        .send(agreementData)
        .expect(201);

      expect(response.body.amount).toBe(agreementData.amount);
      expect(response.body.status).toBe('PENDING');
      expect(response.body.hash).toBeDefined();
    });

    test('GET /api/agreements should list user agreements', async () => {
      const response = await request(app)
        .get('/api/agreements')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should reject unauthorized access', async () => {
      await request(app)
        .get('/api/agreements')
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    test('should limit requests after threshold', async () => {
      const promises = Array(105).fill().map(() =>
        request(app).get('/health')
      );

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 30000);
  });
});
