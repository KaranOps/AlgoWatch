const express = require('express');
const app = express();
const connectDB = require('./config/db')
const studentRoutes = require('./routes/studentRoutes');
const cronRoutes = require('./routes/cronRoutes');
const schedular = require('./cronJobs/scheduler');
const cors = require('cors');
require('dotenv').config();


//Middleware to parse json body
app.use(express.json());
app.use(cors());

connectDB();

// app.get('/', (req, res) => {
//     res.send("AlgoWatch is live");
// // })
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'undefined');

app.use('/api/students', studentRoutes);
app.use('/api/cron', cronRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
