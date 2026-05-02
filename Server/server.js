const app = require('./app');
const { PORT } = require('./config/env');
require('./jobs/notificationJob'); // Initialize notification job

app.listen(PORT, () => {
  console.log(`SafeLedger backend running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});