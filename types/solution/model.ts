export interface SolutionData {
    file_paths(file_paths: any): unknown
    resolved_at: string;
    solution: string;
}

export type SolutionDataId = number;

export interface AddSolution {
    file_paths?: string[];
    images?: File[];
    solution: string;
}

export interface UpdateSolution {
    solution: string;
    images?: File[];
    file_paths?: string[];
    existing_images?: string[];
}

export type DeleteSolution = number;