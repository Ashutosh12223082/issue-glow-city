import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import IssueCard from '@/components/IssueCard';
import { mockIssues, statsData } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, MapPin, BarChart3, Bell, Users, Zap, Shield, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
} as const;

const features = [
  { icon: Camera, title: 'Photo Report', desc: 'Snap a photo and our AI identifies the issue automatically' },
  { icon: MapPin, title: 'GPS Location', desc: 'Precise location tagging for faster response teams' },
  { icon: Zap, title: 'AI Priority', desc: 'Smart priority assignment based on severity analysis' },
  { icon: Bell, title: 'Live Updates', desc: 'Real-time notifications as your issue gets resolved' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track city performance with detailed dashboards' },
  { icon: Users, title: 'Community', desc: 'Upvote existing issues to amplify their priority' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(170_55%_30%/0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 pb-20 pt-24 md:pt-32">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Smart Civic Reporting Platform
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Report. Track.{' '}
              <span className="text-gradient-primary">Transform</span> your city.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Empower your community by reporting civic issues instantly. AI-powered analysis ensures the right team responds with the right priority.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/report">
                <Button size="lg" className="gap-2 px-8">
                  Report an Issue <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="px-8">
                  Track Complaints
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{statsData.totalIssues.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Issues Reported</p>
            </div>
            <div className="border-x border-border text-center">
              <p className="font-display text-2xl font-bold text-success">{statsData.resolutionRate}%</p>
              <p className="text-xs text-muted-foreground">Resolution Rate</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{statsData.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Active Citizens</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-lg text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">How it works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to a better city</p>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Report', desc: 'Upload a photo and describe the issue. AI handles the rest.' },
              { step: '02', title: 'Track', desc: 'Follow real-time status updates from submission to resolution.' },
              { step: '03', title: 'Resolved', desc: 'Rate the resolution quality and help improve city services.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-lg text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">Powerful Features</h2>
            <p className="mt-2 text-muted-foreground">Everything you need for smarter civic management</p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Card className="border border-border p-5 shadow-card transition-all hover:shadow-elevated">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-card-foreground">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Recent Reports</h2>
              <p className="text-sm text-muted-foreground">Latest civic issues from the community</p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockIssues.slice(0, 3).map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-10 text-center shadow-elevated">
            <h2 className="font-display text-3xl font-bold text-primary-foreground">Make your city better today</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
              Join thousands of citizens who are actively improving their neighborhoods.
            </p>
            <Link to="/report">
              <Button size="lg" variant="secondary" className="mt-6 gap-2">
                Start Reporting <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
