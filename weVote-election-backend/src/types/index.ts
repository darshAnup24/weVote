export interface Election {
    id: string;
    title: string;
    date: Date;
    candidates: string[];
}

export interface ElectionInput {
    title: string;
    date: Date;
    candidates: string[];
}