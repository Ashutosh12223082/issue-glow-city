import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockIssues, statsData, weeklyData, categoryDistribution, categoryLabels, categoryIcons, priorityColors, statusColors, statusLabels } from '@/lib/mock-data';
import { FileText, CheckCircle, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all civic complaints</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Total Issues" value={statsData.totalIssues.toLocaleString()} icon={FileText} trend="12% this week" trendUp />
          <StatCard title="Resolved" value={statsData.resolvedIssues.toLocaleString()} icon={CheckCircle} trend="8% this week" trendUp />
          <StatCard title="Avg Response" value={statsData.avgResponseTime} icon={Clock} trend="0.3 days faster" trendUp />
          <StatCard title="Active Users" value={statsData.activeUsers.toLocaleString()} icon={Users} trend="5% growth" trendUp />
        </div>

        {/* Charts */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border border-border p-5 shadow-card">
            <h3 className="mb-4 font-display text-sm font-semibold text-card-foreground">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 89%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(170 10% 45%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(170 10% 45%)" />
                <Tooltip />
                <Bar dataKey="reports" fill="hsl(170 55% 30%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="hsl(152 60% 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="border border-border p-5 shadow-card">
            <h3 className="mb-4 font-display text-sm font-semibold text-card-foreground">Issues by Category</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={2}>
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {categoryDistribution.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.fill }} />
                  {c.name}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Issues Table */}
        <Card className="border border-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-display text-sm font-semibold text-card-foreground">All Complaints</h3>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Issue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Reported</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockIssues.map((issue) => (
                  <tr key={issue.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="max-w-[200px]">
                        <p className="truncate font-medium text-card-foreground">{issue.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{issue.location.address}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs">
                        {categoryIcons[issue.category]} {categoryLabels[issue.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs capitalize ${priorityColors[issue.priority]}`}>
                        {issue.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={`text-xs ${statusColors[issue.status]}`}>
                        {statusLabels[issue.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
