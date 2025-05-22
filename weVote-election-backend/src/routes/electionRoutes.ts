import { Router } from 'express';
import ElectionController from '../controllers/electionController';

const router = Router();
const electionController = new ElectionController();

export default function setElectionRoutes(app: Router) {
    app.post('/elections', electionController.createElection.bind(electionController));
    app.get('/elections', electionController.getElections.bind(electionController));
    app.get('/elections/:id', electionController.getElectionById.bind(electionController));
}