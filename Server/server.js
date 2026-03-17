const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`SafeLedger backend running on port ${PORT}`);
});