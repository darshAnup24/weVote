import express from 'express';
import mongoose from 'mongoose';
import { setElectionRoutes } from './routes/electionRoutes';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weVote';

app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

setElectionRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});