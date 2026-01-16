import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { API_URL } from '../../lib/api';

interface CorrelationData {
    period: string;
    fullSessionDays: number;
    avgVideosOnFullDays: string;
    partialSessionDays: number;
    avgVideosOnPartialDays: string;
    correlationStrength: 'STRONG' | 'MODERATE' | 'WEAK';
    insight: string;
}

export const DisciplineCorrelation = () => {
    const [data, setData] = useState<CorrelationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCorrelation();
    }, []);

    const fetchCorrelation = async () => {
        try {
            const res = await fetch(`${API_URL}/api/fitness/correlation`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="border border-steel/30 p-3 animate-pulse">
                <div className="h-16 bg-steel/10 rounded" />
            </div>
        );
    }

    if (!data) return null;

    const strengthColors = {
        STRONG: 'text-emerald-500',
        MODERATE: 'text-gold',
        WEAK: 'text-blood'
    };

    return (
        <div className="border border-steel/30 bg-void p-3">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={12} className="text-emerald-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-concrete">
                    Discipline Correlation
                </span>
                <span className={`text-[9px] font-mono ${strengthColors[data.correlationStrength]}`}>
                    {data.correlationStrength}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Full Sessions Days */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 text-center">
                    <div className="text-lg font-black text-emerald-500">
                        {parseFloat(data.avgVideosOnFullDays).toFixed(1)}
                    </div>
                    <div className="text-[8px] font-mono text-emerald-500/70 uppercase">
                        Avg Videos (4/4 days)
                    </div>
                    <div className="text-[8px] font-mono text-concrete/40">
                        {data.fullSessionDays} days
                    </div>
                </div>

                {/* Partial Sessions Days */}
                <div className="bg-blood/10 border border-blood/30 p-2 text-center">
                    <div className="text-lg font-black text-blood">
                        {parseFloat(data.avgVideosOnPartialDays).toFixed(1)}
                    </div>
                    <div className="text-[8px] font-mono text-blood/70 uppercase">
                        Avg Videos (&lt;4 days)
                    </div>
                    <div className="text-[8px] font-mono text-concrete/40">
                        {data.partialSessionDays} days
                    </div>
                </div>
            </div>

            {/* Insight */}
            <div className="bg-steel/10 p-2 text-[9px] font-mono text-concrete/70 italic">
                💡 {data.insight}
            </div>
        </div>
    );
};

export default DisciplineCorrelation;
