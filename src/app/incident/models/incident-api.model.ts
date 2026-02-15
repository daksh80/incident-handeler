export interface IncidentApiRecord {
  id: string;
  title: string;
  service: string;
  severity: string;
  status: string;
  owner: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentListResponse {
  data: IncidentApiRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
