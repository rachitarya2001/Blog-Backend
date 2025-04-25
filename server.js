import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import blogRoutes from './routes/blogRoutes.js';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/blogs', blogRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port ${process.env.PORT}`)
        );
    })
    .catch((err) => console.error('MongoDB connection error:', err));
