export interface CommunityMember {
  id: number;
  name: string;
  nik: string;
  address: string;
  phone: string;
  gender: string;
  birth_date: string;
  created_at: string;
}

export interface Program {
  id: number;
  title: string;
  category: 'PUG' | 'PHA' | 'GENTING' | 'STUNTING';
  description: string;
  date: string;
  location: string;
  status: string;
}

export interface ViolenceReport {
  id: number;
  victim_name: string;
  reporter_name: string;
  incident_date: string;
  description: string;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  communityCount: number;
  programCount: number;
  reportCount: number;
}
