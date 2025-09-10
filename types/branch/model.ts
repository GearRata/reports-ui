export interface BranchData {
  id: number;
  name: string;
}

export type BranchDataId = number;
export type CreateBranch = { name: string };
export type UpdateBranch = { name: string };
export type DeleteBranch = number;
