import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockIssues, categoryIcons, categoryLabels, priorityColors, statusColors, statusLabels } from '@/lib/mock-data';
import { MapPin, Layers, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MapView() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Map View</h1>
            <p className="text-muted-foreground">Visualize civic issues across the city</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Layers className="h-3.5 w-3.5" /> Heatmap
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Map Placeholder */}
          <Card className="relative col-span-1 overflow-hidden border border-border shadow-card lg:col-span-2" style={{ minHeight: 500 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/30 to-info/5">
              <div className="flex h-full flex-col items-center justify-center text-center p-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">Interactive Map</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Connect a mapping service (Mapbox, Google Maps, or Leaflet) to display issues on an interactive map with clustering and heatmap overlays.
                </p>
              </div>
              {/* Simulated pins */}
              {mockIssues.map((issue, i) => (
                <div
                  key={issue.id}
                  className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-elevated border border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${20 + (i * 12) % 60}%`,
                    top: `${15 + (i * 15) % 65}%`,
                  }}
                  title={issue.title}
                >
                  <span className="text-sm">{categoryIcons[issue.category]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Issue List */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold text-foreground">Nearby Issues</h3>
            {mockIssues.map((issue) => (
              <Card key={issue.id} className="border border-border p-3 shadow-card cursor-pointer hover:shadow-elevated transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{categoryIcons[issue.category]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">{issue.location.address}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs capitalize ${priorityColors[issue.priority]}`}>
                        {issue.priority}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${statusColors[issue.status]}`}>
                        {statusLabels[issue.status]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
