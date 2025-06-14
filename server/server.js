const express = require('express');
const app = express();
const connectDB = require('./config/db')
const studentRoutes = require('./routes/studentRoutes');
//Middleware to parse json body
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send("AlgoWatch is live");
})

app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
