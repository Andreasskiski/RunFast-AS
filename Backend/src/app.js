const express = require('express')
const cors = require('cors')

const userRoutes = require('./v1/routes/userRoutes');
const dashRoutes = require('./v1/routes/dashRoutes');
const spinningRoutes = require('./v1/routes/spinningRoutes');
const bookingRoutes = require('./v1/routes/bookingRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dashboard', dashRoutes)
app.use('/api/v1/spinning', spinningRoutes)
app.use('/api/v1/booking', bookingRoutes)

app.listen(3000, () => {
    console.log('Server on port', 3000)
});