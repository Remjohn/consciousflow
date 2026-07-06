import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarDays, CircleDollarSign, CreditCard, Layers, PiggyBank, RefreshCcw, ShieldCheck, Target, TrendingUp, WalletCards } from 'lucide-react';
import { Card, MetricTile, ProgressBar, SectionHeader, SelectPill, StatusPill } from '../../components/fortress/ui';
import { deriveSnapshot, money, monthlyTrend, percent, SAMPLE_TRIAL_PRICE, MONTHLY_PACKAGE_PRICE } from '../../lib/fortressMetrics';
import { useFortressOSStore } from '../../store/useFortressOSStore';
import { useUserStore } from '../../store/useUserStore';
import { Investments } from '../investments/Investments';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const FinanceTracker = () => {
  const [tab, setTab] = useState<'REVENUE' | 'EXPENSES'>('REVENUE');
  const [period, setPeriod] = useState<string>('This Month');
  const legacyToday = useUserStore((state) => state.today);
  const os = useFortressOSStore();
  const snapshot = deriveSnapshot(legacyToday, os);
  const trend = monthlyTrend(snapshot.mrr);
  const monthlyGoal = Math.max(snapshot.mrr + 297, 3200);
  const mrrGoalPct = percent(snapshot.mrr, monthlyGoal);
  const conversionRate = snapshot.sampleVideoTrials > 0 ? (snapshot.activeMonthlyPackages / snapshot.sampleVideoTrials) * 100 : 0;

  return (
    <div className="fortress-screen space-y-4">
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-3 text-sm font-semibold text-concrete">
          <CalendarDays className="h-4 w-4 text-gold" />
          {todayLabel}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('REVENUE')}
            className={`rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition ${
              tab === 'REVENUE' ? 'bg-gold/15 text-gold border border-gold/30 font-bold' : 'border border-transparent text-muted hover:text-concrete'
            }`}
          >
            CMF Revenue
          </button>
          <button
            onClick={() => setTab('EXPENSES')}
            className={`rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition ${
              tab === 'EXPENSES' ? 'bg-gold/15 text-gold border border-gold/30 font-bold' : 'border border-transparent text-muted hover:text-concrete'
            }`}
          >
            Investments & Groceries
          </button>
        </div>
      </div>

      {tab === 'EXPENSES' ? (
        <Investments />
      ) : (
        <>
          <Card gold className="p-5 md:p-6">
            <SectionHeader icon={<CircleDollarSign className="h-5 w-5" />} title="Business Revenue" action={<SelectPill options={['This Month', 'Last 3M', 'Last 6M']} value={period} onChange={setPeriod} />} />
            <div className="grid gap-4 md:grid-cols-[1.3fr_.7fr_.7fr]">
              <div className="rounded-xl border border-line bg-void/35 p-5">
                <div className="fortress-label">Monthly Recurring Revenue</div>
                <div className="fortress-number mt-3 text-6xl">{money(snapshot.mrr)} <span className="text-2xl text-gold">MRR</span></div>
                <div className="mt-3 text-sm font-semibold text-success">↑ {snapshot.activeMonthlyPackages > 0 ? 'Live from active packages' : 'Set active packages to start tracking'}</div>
                <ProgressBar value={snapshot.mrr} max={monthlyGoal} className="mt-4" />
                <div className="mt-2 text-xs text-muted">{mrrGoalPct}% of {money(monthlyGoal)} monthly goal</div>
              </div>
              <PriceCard title="Sample Video Trial" price={SAMPLE_TRIAL_PRICE} detail="One-time" footer={`${snapshot.sampleVideoTrials} trials`} tone="purple" />
              <PriceCard title="Active Monthly Package" price={MONTHLY_PACKAGE_PRICE} detail="Recurring / mo" footer={`${snapshot.activeMonthlyPackages} active`} tone="gold" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6">
              <MetricTile icon={<Layers className="h-5 w-5" />} label="Active Packages" value={snapshot.activeMonthlyPackages} detail={<QuickAdjust onMinus={() => os.incrementStudio('activeMonthlyPackages', -1)} onPlus={() => os.incrementStudio('activeMonthlyPackages', 1)} />} trend="MRR" />
              <MetricTile icon={<CircleDollarSign className="h-5 w-5" />} label="MRR" value={money(snapshot.mrr)} trend="Live" />
              <MetricTile icon={<TrendingUp className="h-5 w-5" />} label="ARR" value={money(snapshot.mrr * 12)} />
              <MetricTile icon={<WalletCards className="h-5 w-5" />} label="Trial Revenue" value={money(snapshot.trialRevenue)} detail={<QuickAdjust onMinus={() => os.incrementStudio('sampleVideoTrials', -1)} onPlus={() => os.incrementStudio('sampleVideoTrials', 1)} />} />
              <MetricTile icon={<RefreshCcw className="h-5 w-5" />} label="Trial → Paying" value={`${conversionRate.toFixed(1)}%`} trend={snapshot.sampleVideoTrials > 0 ? 'tracked' : 'n/a'} />
              <MetricTile icon={<CreditCard className="h-5 w-5" />} label="ARPPU" value={money(MONTHLY_PACKAGE_PRICE, 2)} />
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="p-5">
              <SectionHeader icon={<TrendingUp className="h-5 w-5" />} title="MRR Over Time" action={<SelectPill options={['This Month', 'Last 3M', 'Last 6M']} value={period} onChange={setPeriod} />} />
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mrrGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F4B930" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#F4B930" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(141,150,165,.12)" vertical={false} />
                    <XAxis dataKey="month" stroke="#8D96A5" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8D96A5" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}K`} />
                    <Tooltip
                      cursor={{ stroke: '#F4B930', strokeWidth: 1 }}
                      contentStyle={{ background: '#0E1115', border: '1px solid rgba(244,185,48,.25)', borderRadius: 12, color: '#E6E8EC' }}
                      formatter={(value) => [money(Number(value)), 'MRR']}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="#F4B930" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrGold)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <SectionHeader icon={<Target className="h-5 w-5" />} title="Revenue Funnel" action={<SelectPill options={['This Month', 'Last 3M', 'Last 6M']} value={period} onChange={setPeriod} />} />
              <div className="flex flex-col justify-center">
                <FunnelRow label="Trials Started" value={257} pct="49.8%" />
                <FunnelRow label="Trials Completed" value={128} pct="6.3%" />
                <FunnelRow label="Paid Conversions" value={8} pct="21.1%" />
                <FunnelRow label="Active Packages" value={snapshot.activeMonthlyPackages} pct="21.1%" />
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <SectionHeader icon={<ShieldCheck className="h-5 w-5" />} title="Account Health" />
            <div className="grid gap-3 md:grid-cols-5">
              <div className="rounded-xl border border-line bg-void/35 p-4 text-center">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                  <div className="text-xl font-black">86</div>
                </div>
                <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Health Score</div>
                <div className="mt-1 text-xs text-success">↑ 6 pts vs last month</div>
              </div>
              <HealthTile label="Churn Risk" value="Low" detail="3 at risk" tone="green" />
              <HealthTile label="Revenue Quality" value="Excellent" detail="94% recurring" tone="green" />
              <HealthTile label="Payment Health" value="Excellent" detail="0 overdue" tone="green" />
              <HealthTile label="Engagement" value="High" detail="82% active" tone="green" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <SectionHeader icon={<PiggyBank className="h-5 w-5" />} title="Wealth Position" className="mb-0" />
              <div className="text-sm text-muted">As of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <MetricTile label="Portfolio Value" value={money(os.passions.investments.portfolioValue)} detail="Personal capital" trend={os.passions.investments.portfolioValue > 0 ? 'tracked' : 'set value'} />
              <MetricTile label="Monthly Contribution" value={money(os.passions.investments.monthlyContribution)} detail="Auto-invest target" />
              <div className="rounded-xl border border-line bg-void/35 p-4">
                <div className="fortress-label">Contribution Goal</div>
                <div className="mt-2 fortress-number text-4xl">{percent(os.passions.investments.monthlyContribution, os.passions.investments.monthlyGoal)}%</div>
                <div className="mt-2 text-sm text-muted">{money(os.passions.investments.monthlyContribution)} / {money(os.passions.investments.monthlyGoal)}</div>
                <ProgressBar value={os.passions.investments.monthlyContribution} max={os.passions.investments.monthlyGoal} className="mt-4" />
              </div>
              <MetricTile label="Portfolio Health" value={`${os.passions.investments.portfolioHealth}%`} detail={`${os.passions.investments.watchlistCount} watchlist items`} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

const PriceCard = ({ title, price, detail, footer, tone }: { title: string; price: number; detail: string; footer: string; tone: 'gold' | 'purple' }) => (
  <div className="rounded-xl border border-gold/25 bg-void/40 p-5">
    <div className="mb-4"><StatusPill tone={tone}>{title}</StatusPill></div>
    <div className="fortress-number text-5xl">{money(price)}</div>
    <div className="mt-1 text-sm text-muted">{detail}</div>
    <div className="mt-6 text-sm font-semibold text-gold">{footer}</div>
  </div>
);

const QuickAdjust = ({ onMinus, onPlus }: { onMinus: () => void; onPlus: () => void }) => (
  <div className="mt-2 flex items-center gap-2">
    <button onClick={onMinus} className="rounded-lg border border-line px-2 py-1 text-xs text-muted hover:border-gold/40 hover:text-gold">−</button>
    <button onClick={onPlus} className="rounded-lg border border-gold/30 px-2 py-1 text-xs text-gold hover:bg-gold/10">+</button>
  </div>
);

const FunnelRow = ({ label, value, pct }: { label: string; value: number; pct: string }) => (
  <div className="mb-3 rounded-xl border border-gold/25 bg-gold/10 px-4 py-3">
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className="mt-1 text-2xl font-black text-concrete">{value}</div>
      </div>
      <div className="text-sm font-bold text-gold">{pct}</div>
    </div>
  </div>
);

const HealthTile = ({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: 'gold' | 'green' }) => (
  <div className="rounded-xl border border-line bg-void/35 p-4">
    <div className="fortress-label">{label}</div>
    <div className={tone === 'green' ? 'mt-2 text-2xl font-black text-success' : 'mt-2 text-2xl font-black text-gold'}>{value}</div>
    <div className="mt-1 text-sm text-muted">{detail}</div>
  </div>
);
