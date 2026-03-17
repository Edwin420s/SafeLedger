// Mock API service – replace with real backend calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
let currentUser = null;

export const login = async (email, password) => {
  await delay(800);
  // Simulate validation
  if (email === 'test@example.com' && password === 'password') {
    const user = { id: 1, name: 'Test User', email, phone: '0712345678', trustScore: 85 };
    currentUser = user;
    return user;
  }
  throw new Error('Invalid email or password');
};

export const register = async (userData) => {
  await delay(1000);
  // Simulate registration
  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    trustScore: 70,
  };
  currentUser = newUser;
  return newUser;
};

export const updateProfile = async (profileData) => {
  await delay(800);
  if (!currentUser) throw new Error('Not authenticated');
  // Merge updates
  currentUser = { ...currentUser, ...profileData };
  return currentUser;
};

// Mock agreements storage
let agreements = [
  {
    id: 1,
    borrowerName: 'Alice Wanjiku',
    amount: 5000,
    dueDate: '2026-04-15',
    terms: 'Repay in full by due date. No interest.',
    status: 'active',
    hederaTxId: '0.0.123456-1234567890-123',
  },
  {
    id: 2,
    borrowerName: 'Bob Omondi',
    amount: 10000,
    dueDate: '2026-03-30',
    terms: '10% interest, monthly installments.',
    status: 'pending',
    hederaTxId: null,
  },
];

export const createAgreement = async (agreementData) => {
  await delay(1200);
  const newAgreement = {
    id: agreements.length + 1,
    ...agreementData,
    status: 'pending',
    hederaTxId: `0.0.${Math.floor(Math.random() * 1000000)}-${Date.now()}`,
  };
  agreements.push(newAgreement);
  return newAgreement;
};

export const getUserAgreements = async () => {
  await delay(600);
  // In a real app, filter by current user. For demo, return all.
  return agreements;
};

export const getAgreementById = async (id) => {
  await delay(400);
  const agreement = agreements.find(a => a.id === parseInt(id));
  if (!agreement) throw new Error('Not found');
  return agreement;
};

export const verifyAgreement = async (id) => {
  await delay(1000);
  const agreement = agreements.find(a => a.id === parseInt(id));
  if (!agreement) throw new Error('Not found');
  // Simulate verification: if it has a tx id, it's valid
  const valid = !!agreement.hederaTxId;
  return {
    valid,
    hash: valid ? '0x' + Math.random().toString(36).substring(2, 15) : null,
    timestamp: valid ? new Date().toISOString() : null,
  };
};