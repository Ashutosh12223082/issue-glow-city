import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ThumbsUp, MapPin, Clock } from 'lucide-react';
import { Issue, categoryIcons, categoryLabels, priorityColors, statusColors, statusLabels } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
      onClick={onClick}
    >
      {issue.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">{categoryIcons[issue.category]}</span>
          <span className="text-xs font-medium text-muted-foreground">{categoryLabels[issue.category]}</span>
          <Badge variant="outline" className={`ml-auto text-xs ${priorityColors[issue.priority]}`}>
            {issue.priority}
          </Badge>
        </div>
        <h3 className="mb-1 font-display text-sm font-semibold text-card-foreground line-clamp-2">{issue.title}</h3>
        <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{issue.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {issue.location.address.split(',')[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3" /> {issue.upvotes}
            </span>
            <Badge variant="secondary" className={`text-xs ${statusColors[issue.status]}`}>
              {statusLabels[issue.status]}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
