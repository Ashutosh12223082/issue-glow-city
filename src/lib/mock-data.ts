export type IssueCategory = 'pothole' | 'garbage' | 'streetlight' | 'water_leak' | 'illegal_dumping' | 'damaged_infrastructure' | 'traffic_signal' | 'sewage';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  location: { lat: number; lng: number; address: string };
  imageUrl?: string;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  upvotes: number;
  assignedTo?: string;
  department?: string;
}

export const categoryLabels: Record<IssueCategory, string> = {
  pothole: 'Pothole',
  garbage: 'Garbage Accumulation',
  streetlight: 'Streetlight Failure',
  water_leak: 'Water Leakage',
  illegal_dumping: 'Illegal Dumping',
  damaged_infrastructure: 'Damaged Infrastructure',
  traffic_signal: 'Traffic Signal',
  sewage: 'Sewage Issue',
};

export const categoryIcons: Record<IssueCategory, string> = {
  pothole: '🕳️',
  garbage: '🗑️',
  streetlight: '💡',
  water_leak: '💧',
  illegal_dumping: '🚯',
  damaged_infrastructure: '🏗️',
  traffic_signal: '🚦',
  sewage: '🚰',
};

export const priorityColors: Record<IssuePriority, string> = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-info/10 text-info border-info/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-critical/10 text-critical border-critical/20',
};

export const statusColors: Record<IssueStatus, string> = {
  submitted: 'bg-muted text-muted-foreground',
  under_review: 'bg-info/10 text-info',
  assigned: 'bg-warning/10 text-warning',
  in_progress: 'bg-primary/10 text-primary',
  resolved: 'bg-success/10 text-success',
};

export const statusLabels: Record<IssueStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'A dangerous pothole approximately 2 feet wide has formed near the intersection of Main St and Oak Ave. Multiple vehicles have been damaged.',
    category: 'pothole',
    priority: 'high',
    status: 'in_progress',
    location: { lat: 40.7128, lng: -74.006, address: '123 Main St, Downtown' },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=300&fit=crop',
    reportedBy: 'John D.',
    reportedAt: '2026-03-08T10:30:00Z',
    updatedAt: '2026-03-10T14:20:00Z',
    upvotes: 24,
    assignedTo: 'Roads Department',
    department: 'Public Works',
  },
  {
    id: '2',
    title: 'Garbage overflow at Park Lane',
    description: 'Trash bins have not been collected for over a week. Garbage is overflowing onto the sidewalk creating a health hazard.',
    category: 'garbage',
    priority: 'medium',
    status: 'assigned',
    location: { lat: 40.7148, lng: -74.008, address: '45 Park Lane, West Side' },
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
    reportedBy: 'Sarah M.',
    reportedAt: '2026-03-09T08:15:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
    upvotes: 12,
    department: 'Sanitation',
  },
  {
    id: '3',
    title: 'Broken streetlight on Elm Street',
    description: 'The streetlight at the corner of Elm and 5th has been out for 3 days. The area is very dark at night and feels unsafe.',
    category: 'streetlight',
    priority: 'medium',
    status: 'under_review',
    location: { lat: 40.7158, lng: -74.003, address: '78 Elm Street' },
    reportedBy: 'Mike R.',
    reportedAt: '2026-03-10T18:45:00Z',
    updatedAt: '2026-03-10T18:45:00Z',
    upvotes: 8,
  },
  {
    id: '4',
    title: 'Water main leak flooding road',
    description: 'A significant water leak is causing flooding on Cedar Ave. Water is streaming across the road making it dangerous for drivers.',
    category: 'water_leak',
    priority: 'critical',
    status: 'in_progress',
    location: { lat: 40.7118, lng: -74.009, address: '200 Cedar Ave' },
    imageUrl: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=400&h=300&fit=crop',
    reportedBy: 'Lisa K.',
    reportedAt: '2026-03-10T06:30:00Z',
    updatedAt: '2026-03-10T07:15:00Z',
    upvotes: 45,
    assignedTo: 'Water Dept Emergency',
    department: 'Water Services',
  },
  {
    id: '5',
    title: 'Illegal dumping near school',
    description: 'Construction debris has been illegally dumped near Lincoln Elementary School. Contains potentially hazardous materials.',
    category: 'illegal_dumping',
    priority: 'high',
    status: 'submitted',
    location: { lat: 40.7138, lng: -74.005, address: 'Near Lincoln Elementary, 5th Ave' },
    reportedBy: 'Tom W.',
    reportedAt: '2026-03-11T09:00:00Z',
    updatedAt: '2026-03-11T09:00:00Z',
    upvotes: 31,
  },
  {
    id: '6',
    title: 'Damaged park bench',
    description: 'The bench near the fountain in Central Park has broken slats and exposed nails. Safety hazard for children.',
    category: 'damaged_infrastructure',
    priority: 'low',
    status: 'resolved',
    location: { lat: 40.7168, lng: -74.004, address: 'Central Park, near fountain' },
    reportedBy: 'Amy L.',
    reportedAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-09T16:30:00Z',
    upvotes: 5,
    department: 'Parks & Recreation',
  },
];

export const statsData = {
  totalIssues: 1247,
  resolvedIssues: 892,
  pendingIssues: 355,
  avgResponseTime: '2.4 days',
  resolutionRate: 71.5,
  activeUsers: 3420,
};

export const weeklyData = [
  { day: 'Mon', reports: 23, resolved: 18 },
  { day: 'Tue', reports: 31, resolved: 25 },
  { day: 'Wed', reports: 28, resolved: 22 },
  { day: 'Thu', reports: 35, resolved: 30 },
  { day: 'Fri', reports: 42, resolved: 28 },
  { day: 'Sat', reports: 18, resolved: 15 },
  { day: 'Sun', reports: 12, resolved: 10 },
];

export const categoryDistribution = [
  { name: 'Pothole', value: 320, fill: 'hsl(170 55% 30%)' },
  { name: 'Garbage', value: 245, fill: 'hsl(38 92% 55%)' },
  { name: 'Streetlight', value: 189, fill: 'hsl(205 75% 50%)' },
  { name: 'Water Leak', value: 156, fill: 'hsl(0 72% 51%)' },
  { name: 'Dumping', value: 134, fill: 'hsl(152 60% 40%)' },
  { name: 'Infrastructure', value: 203, fill: 'hsl(270 50% 50%)' },
];
