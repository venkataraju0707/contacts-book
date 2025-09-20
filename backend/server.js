require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const contactRoutes = require('./routes/contacts');


const app = express();
const PORT = process.env.PORT || 8082;


app.use(cors());
app.use(bodyParser.json());


app.use('/contacts', contactRoutes);


 
app.get('/', (req, res) => res.send('Contact API running'));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('Mongo connect error', err));