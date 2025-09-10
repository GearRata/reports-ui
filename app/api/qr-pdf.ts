
export type DepartmentRow = {
  id: number;
  name: string;
  branch_id: number;
  branch_name: string;
};

type ApiResponse = {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    branch_id: number;
    branch_name: string;
    // ฟิลด์อื่น ๆ ถูกละไว้
  }>;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export function buildQrUrl(
  branch: number | string,
  department: number | string
) {
  return `${BASE}/public/v1/${encodeURIComponent(String(branch))}/${encodeURIComponent(String(department))}`;
}

export async function fetchDepartments(): Promise<DepartmentRow[]> {
  const url = `${BASE}/api/v1/department/listall`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch departments failed: ${res.status}`);

  const json = (await res.json()) as ApiResponse;
  const rows = (json?.data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    branch_id: d.branch_id,
    branch_name: d.branch_name,
  }));
  return rows;
}
