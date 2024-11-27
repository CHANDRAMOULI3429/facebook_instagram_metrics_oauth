const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes); // Facebook and Instagram Authentication
app.use('/metrics', metricsRoutes); // Fetch and store metrics

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
