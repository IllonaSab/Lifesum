const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());



app.use('/api', authRoutes);
app.use('/api', dashboardRoutes); 

app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
});
