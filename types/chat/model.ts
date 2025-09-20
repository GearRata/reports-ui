export interface ChatData {
    id: number;
    text: string;
    ticket_no: string;
    assignto: string;
    file_paths?: Record<string, string>;
    created_at: string;
    updated_at: string;
}

export interface AddChat {
    id: number;
    text: string;
    images?: File[];
    file_paths?: string[];
}

export interface UpdateChat {
    id: number;
    text: string;
    images?: File[];
    file_paths?: string[];
    existing_images?: string[];
}