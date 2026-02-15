export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: string;
  status: string;
  createdAt: string;
  occurredAt: string;
  owner: string;
  assignedTo: string;
  summary: string;
}
