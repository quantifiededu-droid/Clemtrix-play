import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, Badge } from '../components/ui/Layout';
import { 
  PlayCircle, 
  BookOpen, 
  BarChart2, 
  Music, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-primary text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-piano-in-close-up-34354-large.mp4" type="video/mp4" />
          </video>
          {/* Gradients to blend */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-primary to-transparent z-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                <Music className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">The Future of Piano Learning</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-white">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400 animate-gradient-x">Keys</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Experience a cinematic approach to music education. 
                Professional curriculum meets pro-grade virtual technology.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button size="lg" onClick={() => navigate('/auth/signup')} className="rounded-2xl px-12 py-6 text-xl bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 group">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-2xl px-12 py-6 border-white/20 hover:bg-white/5 backdrop-blur-sm">
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <FeatureCard 
              className="md:col-span-8 md:h-80"
              icon={<BookOpen className="w-8 h-8" />}
              title="50+ Professional Lessons"
              description="A curriculum designed by concert pianists to take you from Middle C to playing your favorite classics with perfect technique."
            />
            <FeatureCard 
              className="md:col-span-4 md:h-80"
              icon={<PlayCircle className="w-8 h-8" />}
              title="Tone.js Synth"
              description="High-fidelity 24-bit audio engine for a realistic practice experience directly in your browser."
            />
            <FeatureCard 
              className="md:col-span-4 md:h-80"
              icon={<BarChart2 className="w-8 h-8" />}
              title="Smart Analytics"
              description="Track every note, streak, and milestone with beautiful data visualizations."
            />
             <FeatureCard 
              className="md:col-span-8 md:h-80"
              icon={<Users className="w-8 h-8" />}
              title="Master Class Techniques"
              description="Learn proper posture, hand independence, and dynamics with our interactive SVG diagnostic tools that guide your fingers."
            />
          </div>
        </div>
      </section>

      {/* Skill Level Tiers */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Master Every Level</h2>
            <p className="text-slate-400 font-medium">A curriculum designed to take you from total beginner to advanced virtuoso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TierCard 
              level="Beginner" 
              count={8} 
              color="indigo"
              skills={['Keyboard Layout', 'Hand Posture', 'First Melodies', 'Both Hands Together']}
            />
            <TierCard 
              level="Intermediate" 
              count={8} 
              color="amber"
              skills={['Full Octave Scales', 'Chord Inversions', 'Arpeggios', 'Dynamics & Expression']}
            />
            <TierCard 
              level="Advanced" 
              count={6} 
              color="rose"
              skills={['12 Key Mastery', 'Complex Voicings', 'Pedal Mastery', 'Improvisation']}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-indigo-600 shadow-2xl relative shadow-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <TestimonialCard 
              quote="The hand diagrams are a game changer. I finally stopped my wrists from sagging!"
              author="Sarah J."
              role="Self-taught Beginner"
            />
            <TestimonialCard 
              quote="The interactive piano sounds amazing. It's so much better than other web keyboards."
              author="Michael R."
              role="Intermediate Player"
            />
            <TestimonialCard 
              quote="CLEMTRIX Play makes music theory actually make sense for my kids. Highly recommend."
              author="David L."
              role="Parent"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 opacity-50" />
      </section>

      {/* CTA Section */}
      <section className="py-40 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-white/5 rounded-[40px] p-16 md:p-24 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">Ready to play<br/>your first song?</h2>
              <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg">Join 10,000+ students mastering the keys with Clemtrix Play.</p>
              <Button size="lg" variant="secondary" onClick={() => navigate('/auth/signup')} className="rounded-2xl px-12 py-6 text-xl bg-amber-400 text-amber-950 hover:bg-amber-300">
                Start My Journey
              </Button>
            </div>
            <Music className="absolute -bottom-12 -right-12 w-96 h-96 text-indigo-500/5 rotate-12" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) {
  return (
    <Card className={cn("p-8 flex flex-col justify-center border-white/5 bg-white/5 hover:bg-white/10 transition-colors group", className)}>
      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </Card>
  );
}

function TierCard({ level, count, color, skills }: { level: string, count: number, color: string, skills: string[] }) {
  const colorMap: any = {
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400',
    amber: 'bg-amber-400/20 border-amber-400/30 text-amber-400',
    rose: 'bg-rose-500/20 border-rose-500/30 text-rose-400'
  };

  return (
    <Card className="overflow-hidden border-white/5 hover:border-white/20 transition-all bg-white/5 p-8 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-3xl font-bold tracking-tight text-white">{level}</h3>
        <Badge variant={color as any}>{count} Lessons</Badge>
      </div>
      <ul className="space-y-4 mb-10 flex-grow">
        {skills.map(skill => (
          <li key={skill} className="flex items-center text-sm text-slate-400 font-medium">
            <CheckCircle2 className={`w-4 text-accent w-4 h-4 mr-3`} />
            {skill}
          </li>
        ))}
      </ul>
      <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 py-4">View Curriculum</Button>
    </Card>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="relative group">
      <div className="flex mb-6">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />)}
      </div>
      <p className="italic mb-8 text-xl font-medium leading-relaxed">"{quote}"</p>
      <div>
        <p className="font-bold text-white text-lg">{author}</p>
        <p className="text-sm text-white/50 font-bold uppercase tracking-widest">{role}</p>
      </div>
    </div>
  );
}
