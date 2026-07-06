import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CalendarDays, CheckCircle2, ChevronRight,
  Clapperboard, Cuboid, MessageSquareText, Play, Plus, Users,
} from 'lucide-react';
import { Card, MiniStat, SectionHeader, SelectPill, StatusPill } from '../../components/fortress/ui';
import { deriveSnapshot, money, SAMPLE_TRIAL_PRICE } from '../../lib/fortressMetrics';
import { useFortressOSStore } from '../../store/useFortressOSStore';
import { useUserStore } from '../../store/useUserStore';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

type StudioTab = 'Today' | 'Week' | 'Month';

export const StudioOperations = () => {
  const navigate = useNavigate();
  const legacyToday = useUserStore((state) => state.today);
  const os = useFortressOSStore();
  const snapshot = deriveSnapshot(legacyToday, os);
  const [tab, setTab] = useState<StudioTab>('Today');

  const queue = [
    { time: '9:00 AM', client: 'Apex Fitness', task: 'Sample Video Trial', tag: 'Trial Due', detail: money(SAMPLE_TRIAL_PRICE), tone: 'purple' as const, icon: <Play className="h-5 w-5" /> },
    { time: '10:30 AM', client: 'Ironspire Performance', task: 'Interview Scheduled', tag: 'Interview', detail: 'Zoom · 45 min', tone: 'gold' as const, icon: <MessageSquareText className="h-5 w-5" /> },
    { time: '1:00 PM', client: 'Peak Athletics', task: 'Package In Progress', tag: 'Production 60%', detail: '12 assets', tone: 'green' as const, icon: <Cuboid className="h-5 w-5" /> },
    { time: '2:30 PM', client: 'Velocity Training', task: 'Management Session', tag: 'Session', detail: '60 min', tone: 'gold' as const, icon: <Users className="h-5 w-5" /> },
    { time: '4:00 PM', client: 'Elevate Coaching', task: 'Client Review Blocked', tag: 'Blocked', detail: 'Needs feedback', tone: 'red' as const, icon: <AlertTriangle className="h-5 w-5" /> },
  ];

  return (
    <div className="fortress-screen space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-concrete">
          <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
          <span className="truncate">{todayLabel}</span>
        </div>
        <SelectPill
          options={['Today', 'Week', 'Month']}
          value={tab}
          onChange={(v) => setTab(v as StudioTab)}
        />
      </div>

      {/* KPI scroll row — scrollable on mobile */}
      <Card className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          <MiniStat
            icon={<Clapperboard className="h-6 w-6" />}
            value={Math.max(0, snapshot.sampleVideosTarget - snapshot.sampleVideosDelivered)}
            label="Videos Due"
            detail={`${money((snapshot.sampleVideosTarget - snapshot.sampleVideosDelivered) * SAMPLE_TRIAL_PRICE)} potential`}
            progress={{ value: snapshot.sampleVideosDelivered, max: snapshot.sampleVideosTarget }}
          />
          <MiniStat
            icon={<Cuboid className="h-6 w-6" />}
            value={snapshot.activeMonthlyPackages}
            label="Packages"
            detail={`${money(snapshot.mrr)} MRR`}
            progress={{ value: snapshot.activeMonthlyPackages, max: Math.max(snapshot.activeMonthlyPackages, 30) }}
          />
          <MiniStat
            icon={<MessageSquareText className="h-6 w-6" />}
            value={snapshot.interviewSessions}
            label="Interviews"
            detail={`${Math.max(0, snapshot.interviewTarget - snapshot.interviewSessions)} upcoming`}
            progress={{ value: snapshot.interviewSessions, max: snapshot.interviewTarget }}
          />
          <MiniStat
            icon={<Users className="h-6 w-6" />}
            value={snapshot.managementSessions}
            label="Sessions"
            detail={`${Math.max(0, snapshot.managementTarget - snapshot.managementSessions)} upcoming`}
            progress={{ value: snapshot.managementSessions, max: snapshot.managementTarget }}
          />
          <MiniStat
            icon={<AlertTriangle className="h-6 w-6" />}
            value={snapshot.blockedClients}
            label="Blocked"
            detail={snapshot.blockedClients > 0 ? 'Needs action' : 'All clear'}
            danger={snapshot.blockedClients > 0}
            progress={{ value: snapshot.blockedClients, max: Math.max(3, snapshot.blockedClients) }}
          />
        </div>
      </Card>

      {/* Today's Queue */}
      <Card gold className="p-5">
        <SectionHeader
          icon={<TargetIcon />}
          title="Today's Queue"
          action={
            <button className="rounded-xl border border-line bg-void/50 px-3 py-2 text-xs font-semibold text-concrete hover:border-gold/40 hover:text-gold">
              View All ({queue.length + snapshot.blockedClients})
            </button>
          }
        />
        <div className="overflow-hidden rounded-xl border border-line bg-void/30">
          {queue.map((item) => (
            <button
              key={`${item.time}-${item.client}`}
              className="flex w-full items-center gap-3 border-b border-line/70 p-3 text-left last:border-b-0 hover:bg-white/[.03]"
            >
              {/* Time */}
              <div className="w-14 shrink-0 font-mono text-xs text-muted">{item.time}</div>

              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-void/60 text-gold">
                {item.icon}
              </div>

              {/* Client + task */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-concrete">{item.client}</div>
                <div className="truncate text-xs text-muted">{item.task}</div>
                {/* On mobile show tag inline */}
                <div className="mt-1 sm:hidden">
                  <StatusPill tone={item.tone}>{item.tag}</StatusPill>
                </div>
              </div>

              {/* Tag + detail — desktop only */}
              <div className="hidden shrink-0 text-right sm:block">
                <StatusPill tone={item.tone}>{item.tag}</StatusPill>
                <div className="mt-1 text-xs text-muted">{item.detail}</div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-muted/50" />
            </button>
          ))}
        </div>
      </Card>

      {/* Production Pipeline */}
      <Card className="p-5">
        <SectionHeader icon={<PipelineIcon />} title="Production Pipeline" action={<span className="text-xs text-muted">{tab}</span>} />
        {/* 3-col on mobile, 5-col on desktop */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <PipelineStage active label="Trial" value={snapshot.sampleVideoTrials} detail={money(snapshot.trialRevenue)} />
          <PipelineStage label="Interview" value={snapshot.interviewSessions} detail={money(snapshot.interviewSessions * SAMPLE_TRIAL_PRICE)} />
          <PipelineStage label="Production" value={snapshot.sampleVideosDelivered} detail="assets" />
          <PipelineStage label="Review" value={Math.max(snapshot.blockedClients, 0)} detail="blocked" warning={snapshot.blockedClients > 0} />
          <PipelineStage label="Delivered" value={snapshot.sampleVideosDelivered} detail={money(snapshot.sampleVideosDelivered * SAMPLE_TRIAL_PRICE)} />
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-5">
        <SectionHeader icon={<Plus className="h-5 w-5" />} title="Quick Actions" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ActionButton
            title="Log Interview"
            subtitle="Schedule & record"
            onClick={() => os.incrementStudio('interviewSessions', 1)}
            icon={<MessageSquareText className="h-6 w-6" />}
          />
          <ActionButton
            title="Open Client Queue"
            subtitle="View active packages"
            onClick={() => navigate('/revenue')}
            icon={<Users className="h-6 w-6" />}
          />
          <ActionButton
            title="Mark Delivered"
            subtitle="Complete sample video"
            onClick={() => {
              os.incrementStudio('sampleVideosDelivered', 1);
              useUserStore.getState().incrementMetric('production', 'videos', 1);
            }}
            icon={<CheckCircle2 className="h-6 w-6" />}
          />
        </div>
      </Card>
    </div>
  );
};

const ActionButton = ({ title, subtitle, icon, onClick }: { title: string; subtitle: string; icon: ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-4 rounded-xl border border-gold/20 bg-gold/5 p-4 text-left transition hover:border-gold/50 hover:bg-gold/10">
    <div className="text-gold">{icon}</div>
    <div>
      <div className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-gold">{title}</div>
      <div className="mt-1 text-sm text-muted">{subtitle}</div>
    </div>
  </button>
);

const PipelineStage = ({ active, label, value, detail, warning }: { active?: boolean; label: string; value: number; detail: string; warning?: boolean }) => (
  <div className={active ? 'rounded-2xl border border-gold/60 bg-gold/10 p-3 text-center shadow-glow-gold' : 'rounded-2xl border border-line bg-void/35 p-3 text-center'}>
    <div className={warning ? 'text-2xl font-black text-blood sm:text-3xl' : 'text-2xl font-black text-concrete sm:text-3xl'}>{value}</div>
    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:text-[10px] sm:tracking-[0.16em]">{label}</div>
    <div className="mt-1 text-xs text-gold sm:text-sm">{detail}</div>
  </div>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

const PipelineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h4v4H4zM16 14h4v4h-4zM10 8h4M14 8c2 0 3 1 3 3v3" />
  </svg>
);
