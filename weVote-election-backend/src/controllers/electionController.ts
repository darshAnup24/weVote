export class ElectionController {
    private electionService: ElectionService;

    constructor(electionService: ElectionService) {
        this.electionService = electionService;
    }

    public async createElection(req: Request, res: Response): Promise<void> {
        try {
            const electionData: ElectionInput = req.body;
            const newElection = await this.electionService.createElection(electionData);
            res.status(201).json(newElection);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getElections(req: Request, res: Response): Promise<void> {
        try {
            const elections = await this.electionService.getElections();
            res.status(200).json(elections);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getElectionById(req: Request, res: Response): Promise<void> {
        try {
            const electionId = req.params.id;
            const election = await this.electionService.getElectionById(electionId);
            if (election) {
                res.status(200).json(election);
            } else {
                res.status(404).json({ message: 'Election not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}