// This is a placeholder; we use react-hot-toast directly in components.
// We can add more sophisticated notification handling if needed.
export const sendNotification = (message, type = 'info') => {
  console.log(`[${type}] ${message}`);
};