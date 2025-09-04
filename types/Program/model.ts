export interface ProgramData {
    id: number
    name: string
    type_id: number
    type_name?: string
}

export type ProgramDataId = number;

export interface CreateProgram {
    name: string | null;
    type_id: number
}

export interface UpdateProgram {
    name: string | null;
    type_id: number
}

export type DeleteProgram = number;