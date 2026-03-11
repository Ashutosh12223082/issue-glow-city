import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import IssueCard from '@/components/IssueCard';
import { mockIssues, statusLabels, type IssueStatus } from '@/lib/mock-data';
import { Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const statuses: ('all' | IssueStatus)[] = ['all', 'submitted', 'under_review', 'assigned', 'in_progress', 'resolved'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = activeTab === 'all' ? mockIssues : mockIssues.filter((i) => i.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Complaints</h1>
            <p className="text-muted-foreground">Track and manage your reported issues</p>
          </div>
          <Link to="/report">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Report New Issue
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: mockIssues.length, color: 'text-foreground' },
            { label: 'In Progress', value: mockIssues.filter(i => i.status === 'in_progress').length, color: 'text-primary' },
            { label: 'Pending', value: mockIssues.filter(i => ['submitted', 'under_review'].includes(i.status)).length, color: 'text-warning' },
            { label: 'Resolved', value: mockIssues.filter(i => i.status === 'resolved').length, color: 'text-success' },
          ].map((s) => (
            <Card key={s.label} className="border border-border p-4 shadow-card text-center">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-muted/50 p-1">
            {statuses.map((s) => (
              <TabsTrigger key={s} value={s} className="text-xs capitalize">
                {s === 'all' ? 'All' : statusLabels[s]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab}>
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p>No issues found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
