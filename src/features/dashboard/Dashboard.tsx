import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Apple,
  CalendarDays,
  Clapperboard,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  Mic,
  MoveRight,
  PackageCheck,
  TrendingUp,
  Trophy,
  Users,
  WalletCards,
} from 'lucide-react';
import { Card, MetricTile, MiniStat, ProgressBar, RadarMark, Ring, SectionHeader, SelectPill, StatusPill } from '../../components/fortress/ui';
import { deriveSnapshot, money, percent, SAMPLE_TRIAL_PRICE, MONTHLY_PACKAGE_PRICE } from '../../lib/fortressMetrics';
import { useFortressOSStore } from '../../store/useFortressOSStore';
import { useUserStore } from '../../store/useUserStore';
import { ScrollingQuotes } from '../../components/ScrollingQuotes';
import { API_URL } from '../../lib/api';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const CoverImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/covers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        }
      })
      .catch(console.error);
  }, []);

  if (images.length === 0) return null;

  const hour = new Date().getHours();
  const currentImage = images[hour % images.length];

  return (
    <div className="relative mx-auto flex aspect-[4/1] w-full max-w-[1200px] items-center justify-center overflow-hidden border border-line bg-void/50 rounded-2xl">
      <img
        src={`/covers/${encodeURIComponent(currentImage)}`}
        alt="Cover"
        className="h-full w-full object-cover object-center animate-in fade-in duration-1000"
      />
      <div className="absolute bottom-2 right-2 rounded bg-void/80 px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-concrete/50 border border-line/30">
        GALLERY ({hour % images.length + 1}/{images.length})
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const legacyToday = useUserStore((state) => state.today);
  const os = useFortressOSStore();
  const snapshot = deriveSnapshot(legacyToday, os);

  const studioPriority = `Close 1 trial, ship ${Math.max(1, os.studio.sampleVideosTarget - snapshot.sampleVideosDelivered)} sample videos, and complete your core drills.`;

  return (
    <div className="fortress-screen space-y-4">
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-3 text-sm font-semibold text-concrete">
          <CalendarDays className="h-4 w-4 text-gold" />
          {todayLabel}
        </div>
        <SelectPill>Day View</SelectPill>
      </div>

      <CoverImageGallery />
      <ScrollingQuotes />


      <Card gold className="overflow-hidden p-5 md:p-7">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-3 text-gold">
              <HeartPulse className="h-5 w-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.24em]">Today’s Priority</span>
            </div>
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.05em] text-concrete md:text-5xl">
              {studioPriority.split('1 trial')[0]}
              <span className="text-gold">1 trial</span>
              {studioPriority.split('1 trial')[1]}
            </h2>
            <p className="mt-4 text-base text-muted">Focus. Execute. Close. Then invest in your body, voice, rhythm, and future.</p>
            <button onClick={() => navigate('/studio')} className="gold-button mt-6 flex w-full items-center justify-center gap-3">
              Open Work Queue <MoveRight className="h-5 w-5" />
            </button>
          </div>
          <RadarMark />
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<TrendingUp className="h-5 w-5" />} title="Revenue (MRR)" action={<SelectPill>This Month</SelectPill>} />
        <div className="grid gap-5 md:grid-cols-[1.25fr_.75fr] md:items-start">
          <div>
            <div className="fortress-number text-5xl md:text-6xl">{money(snapshot.mrr)}</div>
            <div className="mt-2 fortress-label">Monthly Recurring Revenue</div>
          </div>
          <div className="rounded-xl border border-success/20 bg-success/5 p-4 text-success">
            <div className="text-2xl font-black">↑ {snapshot.activeMonthlyPackages > 0 ? 'Live' : 'Set packages'}</div>
            <div className="mt-1 text-sm text-muted">{snapshot.activeMonthlyPackages} active packages × {money(MONTHLY_PACKAGE_PRICE)}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricTile icon={<WalletCards className="h-5 w-5" />} label="Trial Revenue" value={money(snapshot.trialRevenue)} detail={`${snapshot.sampleVideoTrials} trials`} />
          <MetricTile icon={<Users className="h-5 w-5" />} label="Active Packages" value={snapshot.activeMonthlyPackages} detail={`${money(MONTHLY_PACKAGE_PRICE)} / month`} />
          <MetricTile icon={<Clapperboard className="h-5 w-5" />} label={`Sample Trials (${money(SAMPLE_TRIAL_PRICE)})`} value={snapshot.sampleVideoTrials} detail="One-time front door" />
          <MetricTile icon={<PackageCheck className="h-5 w-5" />} label={`Packages (${money(MONTHLY_PACKAGE_PRICE)})`} value={money(snapshot.mrr)} detail="Recurring base" />
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<Clapperboard className="h-5 w-5" />} title="Studio Ops" action={<SelectPill>Today</SelectPill>} />
        <div className="flex overflow-x-auto pb-1">
          <MiniStat
            icon={<Clapperboard className="h-6 w-6" />}
            value={<>{snapshot.sampleVideosDelivered}<span className="text-base text-muted"> / {snapshot.sampleVideosTarget}</span></>}
            label="Sample Videos Delivered"
            progress={{ value: snapshot.sampleVideosDelivered, max: snapshot.sampleVideosTarget }}
          />
          <MiniStat
            icon={<Users className="h-6 w-6" />}
            value={<>{snapshot.interviewSessions}<span className="text-base text-muted"> / {snapshot.interviewTarget}</span></>}
            label="Interview Sessions"
            progress={{ value: snapshot.interviewSessions, max: snapshot.interviewTarget }}
          />
          <MiniStat
            icon={<UserGearIcon />}
            value={<>{snapshot.managementSessions}<span className="text-base text-muted"> / {snapshot.managementTarget}</span></>}
            label="Management Sessions"
            progress={{ value: snapshot.managementSessions, max: snapshot.managementTarget }}
          />
          <MiniStat
            icon={<AlertTriangle className="h-6 w-6" />}
            value={snapshot.blockedClients}
            label="Blocked Clients"
            detail={snapshot.blockedClients > 0 ? 'Needs action' : 'Clear'}
            danger={snapshot.blockedClients > 0}
            progress={{ value: snapshot.blockedClients, max: Math.max(snapshot.blockedClients, 3) }}
          />
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<HeartPulse className="h-5 w-5" />} title="Core Passions" action={<SelectPill>Today</SelectPill>} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <PassionMini icon={<Apple className="h-6 w-6" />} label="Diet" status={`${snapshot.dietScore}%`} tone={snapshot.dietScore >= 80 ? 'green' : 'gold'} />
          <PassionMini icon={<TrendingUp className="h-6 w-6" />} label="Investments" status={`${snapshot.investmentsScore}%`} tone={snapshot.investmentsScore >= 70 ? 'green' : 'gold'} />
          <PassionMini icon={<Leaf className="h-6 w-6" />} label="Kegel" status={`${os.passions.kegel.completed} / ${os.passions.kegel.target}`} tone={snapshot.kegelScore >= 100 ? 'green' : 'gold'} />
          <PassionMini icon={<Mic className="h-6 w-6" />} label="Singing Drills" status={`${os.passions.singing.minutes} / ${os.passions.singing.targetMinutes} min`} tone="gold" />
          <PassionMini icon={<Dumbbell className="h-6 w-6" />} label="Boxing Drills" status={`${os.passions.boxing.completed} / ${os.passions.boxing.target} rounds`} tone="gold" />
          <PassionMini icon={<DancingIcon />} label="Dancing Drills" status={`${os.passions.dancing.minutes} / ${os.passions.dancing.targetMinutes} min`} tone="gold" />
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<HeartPulse className="h-5 w-5" />} title="Operator Readiness" action={<SelectPill>Today</SelectPill>} />
        <div className="grid gap-4 md:grid-cols-3">
          <ReadinessTile icon={<Dumbbell className="h-6 w-6" />} label="Fitness" score={snapshot.fitnessScore} detail={`${Math.round(snapshot.fitnessMinutes)} / 60 min`} color="#72D94F" />
          <ReadinessTile icon={<Leaf className="h-6 w-6" />} label="Lifestyle" score={percent(snapshot.lifestyleCompleted, snapshot.lifestyleTarget)} detail={`${snapshot.lifestyleCompleted} / ${snapshot.lifestyleTarget} habits`} color="#72D94F" />
          <div className="rounded-xl border border-line bg-void/35 p-4">
            <div className="mb-3 flex items-center gap-2 text-warning"><Flame className="h-6 w-6" /><span className="fortress-label text-warning">Challenge Streak</span></div>
            <div className="flex items-center justify-between">
              <div>
                <div className="fortress-number text-5xl">{Math.max(os.challenges.business.completed, os.challenges.personal.completed)}</div>
                <div className="text-sm text-muted">days / completions</div>
              </div>
              <Ring value={snapshot.operatorReadiness} size={88} color="#FF9E3D"><Flame className="h-7 w-7 text-warning" /></Ring>
            </div>
          </div>
        </div>
      </Card>

      <button onClick={() => navigate('/challenge')} className="group w-full rounded-2xl border border-line bg-panel/70 p-4 text-left transition hover:border-gold/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Challenge: Nourish & Reset</div>
              <div className="mt-1 text-sm text-muted">90-day deep work + core passions challenge</div>
            </div>
          </div>
          <div className="w-32 shrink-0 text-right">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-gold">Day 7 / 90</div>
            <ProgressBar value={7} max={90} className="mt-2 h-1.5" />
          </div>
        </div>
      </button>
    </div>
  );
};

const PassionMini = ({ icon, label, status, tone }: { icon: ReactNode; label: string; status: string; tone: 'gold' | 'green' }) => (
  <div className="rounded-xl border border-line bg-void/35 p-3 text-center">
    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold">{icon}</div>
    <div className="truncate text-sm font-semibold text-concrete">{label}</div>
    <div className="mt-2"><StatusPill tone={tone}>{status}</StatusPill></div>
  </div>
);

const ReadinessTile = ({ icon, label, score, detail, color }: { icon: ReactNode; label: string; score: number; detail: string; color: string }) => (
  <div className="rounded-xl border border-line bg-void/35 p-4">
    <div className="mb-2 flex items-center gap-2 text-gold">{icon}<span className="fortress-label">{label}</span></div>
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="fortress-number text-5xl">{score}<span className="text-2xl">%</span></div>
        <div className="text-sm text-muted">{detail}</div>
      </div>
      <Ring value={score} size={86} color={color}>{icon}</Ring>
    </div>
  </div>
);

const DancingIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6v5l4 3" />
    <path d="M12 11l-4 3" />
    <path d="M10 13l-2 6" />
    <path d="M15 14l2 5" />
  </svg>
);

const UserGearIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <circle cx="17" cy="13" r="2" />
    <path d="M17 9v1M17 16v1M13.5 11l.8.5M19.7 14.5l.8.5M13.5 15l.8-.5M19.7 11.5l.8-.5" />
  </svg>
);
