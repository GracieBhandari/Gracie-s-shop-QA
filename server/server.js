// Starts the web server. Run with: npm start

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Gracie's Shop is running at http://localhost:${PORT}`);
});
