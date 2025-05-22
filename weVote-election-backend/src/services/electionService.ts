import { Election, ElectionInput, ElectionDocument } from '../models/election';
import mongoose from 'mongoose';

export class ElectionService {
    async createElection(electionData: ElectionInput): Promise<ElectionDocument> {
        const election = new Election(electionData);
        return await election.save();
    }

    async getElections(): Promise<ElectionDocument[]> {
        return await Election.find();
    }

    async getElectionById(id: string): Promise<ElectionDocument | null> {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('Invalid election ID');
        }
        return await Election.findById(id);
    }
}