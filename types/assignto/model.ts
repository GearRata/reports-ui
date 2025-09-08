export interface AssignData {
  id: number;
  name: string;
  telegram_username: string;
}

export type AssignDataId = number;

export interface CreateAssignData {
  name: string;
  telegram_username: string;
}
export interface UpdateAssignData {
  name: string;
  telegram_username: string;
}

export type DeleteAssignData = number;
