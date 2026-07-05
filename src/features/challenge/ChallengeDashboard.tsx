import type { ReactNode } from 'react';
import { CalendarDays, CheckCircle2, Flame, Target, Trophy, WalletCards } from 'lucide-react';
import { Card, ProgressBar, SectionHeader, SelectPill } from '../../components/fortress/ui';
import { deriveSnapshot, money, percent, SAMPLE_TRIAL_PRICE } from '../../lib/fortressMetrics';
import { useFortressOSStore } from '../../store/useFortressOSStore';
import { useUserStore } from '../../store/useUserStore';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const ChallengeDashboard = () => {
  const legacyToday = useUserStore((state) => state.today);
  const os = useFortressOSStore();
  const snapshot = deriveSnapshot(legacyToday, os);

  return (
    <div className="fortress-screen space-y-4">
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-3 text-sm font-semibold text-concrete">
          <CalendarDays className="h-4 w-4 text-gold" />
          {todayLabel}
        </div>
        <SelectPill>Mission View</SelectPill>
      </div>

      <Card gold className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-4 flex items-center gap-3 text-gold">
              <Trophy className="h-5 w-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em]">Active Campaign</span>
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-concrete md:text-6xl">Nourish & Reset</h2>
            <p className="mt-3 max-w-xl text-muted">A 90-day campaign that protects business momentum and the personal practice stack you cannot live without improving.</p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-void/35 p-5 text-center">
            <div className="text-6xl font-black text-gold">7</div>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Day / 90</div>
            <ProgressBar value={7} max={90} className="mt-4 w-36" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChallengeCard
          icon={<WalletCards className="h-7 w-7" />}
          label="Business Challenge"
          title={os.challenges.business.title}
          completed={os.challenges.business.completed}
          target={os.challenges.business.target}
          daysLeft={os.challenges.business.daysLeft}
          detail={`${money(os.challenges.business.completed * SAMPLE_TRIAL_PRICE)} trial revenue captured`}
          tone="gold"
          onAdd={() => os.updateChallenge('business', { completed: Math.min(os.challenges.business.target, os.challenges.business.completed + 1) })}
        />
        <ChallengeCard
          icon={<Flame className="h-7 w-7" />}
          label="Personal Challenge"
          title={os.challenges.personal.title}
          completed={os.challenges.personal.completed}
          target={os.challenges.personal.target}
          daysLeft={os.challenges.personal.daysLeft}
          detail={`${snapshot.operatorReadiness}% operator readiness`}
          tone="green"
          onAdd={() => os.updateChallenge('personal', { completed: Math.min(os.challenges.personal.target, os.challenges.personal.completed + 1) })}
        />
      </div>

      <Card className="p-5">
        <SectionHeader icon={<Target className="h-5 w-5" />} title="Challenge Scoreboard" />
        <div className="grid gap-3 md:grid-cols-4">
          <Score label="Trials Sold" value={os.studio.sampleVideoTrials} target={30} />
          <Score label="Sample Videos" value={snapshot.sampleVideosDelivered} target={snapshot.sampleVideosTarget} />
          <Score label="Core Passions" value={snapshot.corePassionScore} target={100} suffix="%" />
          <Score label="Operator Ready" value={snapshot.operatorReadiness} target={100} suffix="%" />
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<CheckCircle2 className="h-5 w-5" />} title="Rules of the Campaign" />
        <div className="grid gap-3 md:grid-cols-2">
          <Rule text="Business challenge and personal challenge both count. Do not let revenue growth erase the rest of your life." />
          <Rule text="Track sample video trials at $29 and active packages at $99 MRR separately." />
          <Rule text="Diet, investments, kegel, singing, boxing, and dancing are core modules, not bonus hobbies." />
          <Rule text="The dashboard’s job is to tell you the next action, not shame you with noise." />
        </div>
      </Card>
    </div>
  );
};

const ChallengeCard = ({ icon, label, title, completed, target, daysLeft, detail, tone, onAdd }: { icon: ReactNode; label: string; title: string; completed: number; target: number; daysLeft: number; detail: string; tone: 'gold' | 'green'; onAdd: () => void }) => {
  const color = tone === 'green' ? 'text-success border-success/35 bg-success/10' : 'text-gold border-gold/35 bg-gold/10';
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border ${color}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className={tone === 'green' ? 'font-mono text-xs uppercase tracking-[0.16em] text-success' : 'font-mono text-xs uppercase tracking-[0.16em] text-gold'}>{label}</div>
          <h3 className="mt-2 text-xl font-black leading-snug text-concrete">{title}</h3>
          <p className="mt-1 text-sm text-muted">{detail}</p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar value={completed} max={target} color={tone} className="flex-1" />
            <div className="font-mono text-xs text-muted">{completed} / {target}</div>
          </div>
        </div>
        <button onClick={onAdd} className="rounded-xl border border-line bg-void/35 px-4 py-3 text-center transition hover:border-gold/40">
          <div className={tone === 'green' ? 'text-3xl font-black text-success' : 'text-3xl font-black text-gold'}>{daysLeft}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Days Left</div>
        </button>
      </div>
    </Card>
  );
};

const Score = ({ label, value, target, suffix = '' }: { label: string; value: number; target: number; suffix?: string }) => (
  <div className="rounded-xl border border-line bg-void/35 p-4">
    <div className="fortress-label">{label}</div>
    <div className="mt-2 text-4xl font-black text-concrete">{value}{suffix}</div>
    <div className="mt-2 text-sm text-muted">Target: {target}{suffix}</div>
    <ProgressBar value={suffix ? value : percent(value, target)} max={suffix ? target : 100} className="mt-4" />
  </div>
);

const Rule = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 rounded-xl border border-line bg-void/35 p-4">
    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
    <p className="text-sm leading-relaxed text-muted">{text}</p>
  </div>
);
