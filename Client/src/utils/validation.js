export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Basic Kenyan phone: starts with 0 or 254, then 7 or 1, then 8 digits
  const re = /^(0|254)?[17]\d{8}$/;
  return re.test(String(phone).replace(/\s/g, ''));
};