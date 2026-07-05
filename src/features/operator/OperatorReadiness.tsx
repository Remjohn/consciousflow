import type { ReactNode } from 'react';
import { Apple, CalendarDays, Check, Dumbbell, Flame, HeartPulse, Leaf, Mic, Plus, TrendingUp, Trophy, WalletCards } from 'lucide-react';
import { Card, ProgressBar, Ring, SectionHeader, SelectPill } from '../../components/fortress/ui';
import { deriveSnapshot, money, percent } from '../../lib/fortressMetrics';
import { useFortressOSStore } from '../../store/useFortressOSStore';
import { useUserStore } from '../../store/useUserStore';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const OperatorReadiness = () => {
  const legacyToday = useUserStore((state) => state.today);
  const os = useFortressOSStore();
  const snapshot = deriveSnapshot(legacyToday, os);
  const lifestyleScore = percent(snapshot.lifestyleCompleted, snapshot.lifestyleTarget);

  return (
    <div className="fortress-screen space-y-4">
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-3 text-sm font-semibold text-concrete">
          <CalendarDays className="h-4 w-4 text-gold" />
          {todayLabel}
        </div>
        <SelectPill>Day View</SelectPill>
      </div>

      <Card gold className="p-5 md:p-7">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-3 text-gold">
              <HeartPulse className="h-5 w-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em]">Operator Readiness</span>
            </div>
            <div className="fortress-number text-7xl md:text-8xl">{snapshot.operatorReadiness}<span className="text-4xl">%</span></div>
            <div className="mt-2 font-mono text-lg font-bold uppercase tracking-[0.16em] text-gold">Operator Prime</div>
            <p className="mt-3 max-w-md text-muted">Your work gives you learning and human connection. This screen protects the other side: body, nutrition, voice, rhythm, intimacy discipline, and wealth.</p>
            <button className="mt-5 rounded-xl border border-gold/35 bg-gold/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-gold hover:bg-gold/15">View Readiness Insights</button>
          </div>
          <Ring value={snapshot.operatorReadiness} size={180} color="#F4B930">
            <div className="text-center">
              <div className="text-4xl font-black text-concrete">{snapshot.operatorReadiness}%</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Ready</div>
            </div>
          </Ring>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <PrimeCard icon={<Dumbbell className="h-5 w-5" />} title="Fitness" score={snapshot.fitnessScore} detail={`${Math.round(snapshot.fitnessMinutes)} / 60 min`} />
        <PrimeCard icon={<Leaf className="h-5 w-5" />} title="Lifestyle" score={lifestyleScore} detail={`${snapshot.lifestyleCompleted} / ${snapshot.lifestyleTarget} habits`} color="#72D94F" />
        <PrimeCard icon={<Apple className="h-5 w-5" />} title="Diet" score={snapshot.dietScore} detail={`${os.passions.diet.calories} / ${os.passions.diet.targetCalories} kcal`} color="#FF9E3D" />
        <PrimeCard icon={<TrendingUp className="h-5 w-5" />} title="Investments" score={snapshot.investmentsScore} detail={`${money(os.passions.investments.monthlyContribution)} / ${money(os.passions.investments.monthlyGoal)}`} />
      </div>

      <Card className="p-5">
        <SectionHeader icon={<HeartPulse className="h-5 w-5" />} title="Practice Stack" action={<SelectPill>All Drills</SelectPill>} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <DrillCard
            icon={<KegelIcon />}
            title="Kegel"
            score={snapshot.kegelScore}
            detail={`${snapshot.kegelCompleted} / ${os.passions.kegel.target} sets`}
            color="purple"
            onAdd={() => {
              os.updatePractice('kegel', { completed: os.passions.kegel.completed + 1, minutes: os.passions.kegel.minutes + 3 });
              useUserStore.getState().incrementMetric('fitness', 'kegels', 3);
            }}
          />
          <DrillCard
            icon={<Mic className="h-6 w-6" />}
            title="Singing Drills"
            score={snapshot.singingScore}
            detail={`${snapshot.singingMinutes} / ${os.passions.singing.targetMinutes} min`}
            color="cyan"
            onAdd={() => {
              os.updatePractice('singing', { minutes: os.passions.singing.minutes + 5, completed: os.passions.singing.completed + 1 });
              useUserStore.getState().incrementMetric('fitness', 'singing', 5);
            }}
          />
          <DrillCard
            icon={<BoxingIcon />}
            title="Boxing Drills"
            score={snapshot.boxingScore}
            detail={`${snapshot.boxingMinutes} / ${os.passions.boxing.targetMinutes} min`}
            color="red"
            onAdd={() => {
              os.updatePractice('boxing', { minutes: os.passions.boxing.minutes + 5, completed: os.passions.boxing.completed + 1 });
              useUserStore.getState().incrementMetric('fitness', 'boxing', 5);
            }}
          />
          <DrillCard
            icon={<DancingIcon />}
            title="Dancing Drills"
            score={snapshot.dancingScore}
            detail={`${snapshot.dancingMinutes} / ${os.passions.dancing.targetMinutes} min`}
            color="gold"
            onAdd={() => {
              os.updatePractice('dancing', { minutes: os.passions.dancing.minutes + 5, completed: os.passions.dancing.completed + 1 });
              useUserStore.getState().incrementMetric('fitness', 'dancing', 5);
            }}
          />
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<Leaf className="h-5 w-5" />} title="Lifestyle Habits" action={<SelectPill>Today</SelectPill>} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.entries(os.passions.lifestyle).map(([key, value]) => {
            const isActive = key === 'coldShower' ? snapshot.coldShowerActive : value;
            return (
              <button
                key={key}
                onClick={() => {
                  os.toggleLifestyleHabit(key as keyof typeof os.passions.lifestyle);
                  if (key === 'coldShower') {
                    useUserStore.getState().setMetric('lifestyle', 'coldShower', !isActive);
                  }
                }}
                className={isActive ? 'rounded-xl border border-success/40 bg-success/10 p-4 text-center text-success' : 'rounded-xl border border-line bg-void/35 p-4 text-center text-muted hover:border-gold/30 hover:text-gold'}
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-current/30">
                  <Check className="h-5 w-5" />
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.14em]">{labelize(key)}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<Trophy className="h-5 w-5" />} title="Challenges" action={<div className="flex gap-4 text-xs font-mono uppercase tracking-[0.16em]"><span className="text-gold">Active</span><span className="text-muted">Completed</span></div>} />
        <ChallengeRow icon={<WalletCards className="h-6 w-6" />} label="Business Challenge" title={os.challenges.business.title} completed={os.challenges.business.completed} target={os.challenges.business.target} daysLeft={os.challenges.business.daysLeft} tone="gold" onAdd={() => os.updateChallenge('business', { completed: Math.min(os.challenges.business.target, os.challenges.business.completed + 1) })} />
        <ChallengeRow icon={<Flame className="h-6 w-6" />} label="Personal Challenge" title={os.challenges.personal.title} completed={os.challenges.personal.completed} target={os.challenges.personal.target} daysLeft={os.challenges.personal.daysLeft} tone="green" onAdd={() => os.updateChallenge('personal', { completed: Math.min(os.challenges.personal.target, os.challenges.personal.completed + 1) })} />
      </Card>

      <Card className="p-5">
        <SectionHeader icon={<CalendarDays className="h-5 w-5" />} title="Weekly Activity" action={<div className="text-sm text-muted">7-Day Streak <span className="text-warning">🔥 12</span></div>} />
        <div className="flex items-center justify-between gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={`${day}-${index}`} className={index < 6 ? 'flex h-10 w-10 items-center justify-center rounded-full border border-success/50 text-success' : 'flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold'}>
              <Check className="h-5 w-5" />
            </div>
          ))}
          <div className="ml-4 hidden rounded-xl border border-line bg-void/35 p-4 md:block">
            <div className="fortress-label">Longest Streak</div>
            <div className="mt-1 text-xl font-black text-gold">12 Days</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PrimeCard = ({ icon, title, score, detail, color = '#F4B930' }: { icon: ReactNode; title: string; score: number; detail: string; color?: string }) => (
  <Card className="p-4">
    <div className="mb-3 flex items-center gap-2 text-gold">{icon}<span className="fortress-label text-concrete">{title}</span></div>
    <div className="flex items-end justify-between gap-2">
      <div>
        <div className="fortress-number text-5xl">{score}<span className="text-2xl">%</span></div>
        <div className="mt-1 text-sm text-muted">{detail}</div>
      </div>
      <Ring value={score} size={70} color={color}>{icon}</Ring>
    </div>
  </Card>
);

const DrillCard = ({ icon, title, score, detail, color, onAdd }: { icon: ReactNode; title: string; score: number; detail: string; color: 'gold' | 'green' | 'red' | 'purple' | 'cyan'; onAdd: () => void }) => (
  <div className="rounded-xl border border-line bg-void/35 p-4">
    <div className="mb-4 flex items-start justify-between">
      <div className={color === 'purple' ? 'text-purplepulse' : color === 'cyan' ? 'text-hologram' : color === 'red' ? 'text-blood' : 'text-gold'}>{icon}</div>
      <button onClick={onAdd} className="rounded-full border border-line p-1 text-muted hover:border-gold/40 hover:text-gold"><Plus className="h-4 w-4" /></button>
    </div>
    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{title}</div>
    <div className="mt-2 fortress-number text-4xl">{score}<span className="text-xl">%</span></div>
    <div className="mt-1 text-sm text-muted">{detail}</div>
    <ProgressBar value={score} max={100} color={color} className="mt-4" />
  </div>
);

const ChallengeRow = ({ icon, label, title, completed, target, daysLeft, tone, onAdd }: { icon: ReactNode; label: string; title: string; completed: number; target: number; daysLeft: number; tone: 'gold' | 'green'; onAdd: () => void }) => (
  <div className="mb-3 rounded-xl border border-line bg-void/35 p-4 last:mb-0">
    <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className={tone === 'green' ? 'flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success' : 'flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold'}>{icon}</div>
      <div>
        <div className={tone === 'green' ? 'font-mono text-xs uppercase tracking-[0.16em] text-success' : 'font-mono text-xs uppercase tracking-[0.16em] text-gold'}>{label}</div>
        <div className="mt-1 text-lg font-bold text-concrete">{title}</div>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={completed} max={target} color={tone} className="flex-1" />
          <span className="text-sm text-muted">{completed} / {target}</span>
        </div>
      </div>
      <button onClick={onAdd} className="rounded-xl border border-line bg-panel/70 px-5 py-3 text-center hover:border-gold/40">
        <div className={tone === 'green' ? 'text-3xl font-black text-success' : 'text-3xl font-black text-gold'}>{daysLeft}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Days Left</div>
      </button>
    </div>
  </div>
);

const labelize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());

const KegelIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4c-2 2-3 4-3 7 0 5 3 8 7 9 4-1 7-4 7-9 0-3-1-5-3-7" />
    <path d="M9 6c1.5 1.2 4.5 1.2 6 0" />
    <path d="M12 8v10" />
  </svg>
);

const BoxingIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 13h7a4 4 0 0 0 0-8h-2" />
    <path d="M8 13V6a2 2 0 0 1 4 0v2" />
    <path d="M8 13l-1 6h8l-1-6" />
    <path d="M6 19h10" />
  </svg>
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
