import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Grid, List, Columns, Image, Check, X, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { API_URL } from '../../lib/api';

type ViewMode = 'GRID' | 'GALLERY' | 'LIST' | 'KANBAN';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Category = 'TECH' | 'VEHICLE' | 'HEALTH' | 'GROCERY' | 'LIFESTYLE' | 'BUSINESS' | 'GENERAL' | 'CAR' | 'RENT' | 'WEDDING';

interface Investment {
    id: number;
    title: string;
    description?: string;
    price: string;
    priority: Priority;
    category: Category;
    imageUrl?: string;
    parentId?: number;
    isRecurring: boolean;
    recurringInterval?: string;
    status: string;
    purchasedAt?: string;
    targetDate?: string;
    quantity: number;
    unitPrice?: string;
    subItems?: Investment[];
    computedPrice?: number;
    monthlyAllocation?: number;
    isAffordable?: boolean;
    affordabilityType?: 'SINGLE_PURCHASE' | 'MONTHLY_ALLOCATION';
    ruleViolation?: string;
    shortfall?: number;
    packagesNeeded?: number;
}

interface AffordabilityData {
    weeklyRevenue: number;
    weeklyPackages: number;
    monthlyRevenue: number;
    monthlyPackages: number;
    maxMonthlyCapacity: number;
    allocatedMonthlyCosts: number;
    buckets: Record<string, { capacity: number, allocated: number }>;
    investments: Investment[];
}

export const Investments = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('GRID');
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [affordability, setAffordability] = useState<AffordabilityData | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PURCHASED'>('PENDING');
    const [editingItem, setEditingItem] = useState<Investment | null>(null);
    const [addingSubItemTo, setAddingSubItemTo] = useState<Investment | null>(null);

    useEffect(() => {
        // Auto-renew recurring investments on mount
        fetch(`${API_URL}/api/investments/renew`, { method: 'POST' })
            .then(() => fetchAffordability())
            .catch(() => fetchAffordability());
    }, []);

    const fetchAffordability = async () => {
        try {
            const res = await fetch(`${API_URL}/api/investments/affordability`);
            const data = await res.json();
            setAffordability(data);
            setInvestments(data.investments || []);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleExpand = (id: number) => {
        const newSet = new Set(expandedItems);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedItems(newSet);
    };

    const markPurchased = async (id: number) => {
        await fetch(`${API_URL}/api/investments/${id}/purchase`, { method: 'PUT' });
        setFilter('PURCHASED'); // Auto-switch to show purchased item
        fetchAffordability();
    };

    const archiveInvestment = async (id: number) => {
        await fetch(`${API_URL}/api/investments/${id}`, { method: 'DELETE' });
        fetchAffordability();
    };

    const updateInvestment = async (id: number, data: Partial<Investment>) => {
        await fetch(`${API_URL}/api/investments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        fetchAffordability();
        setEditingItem(null);
    };

    const addSubItem = async (parentId: number, data: any) => {
        await fetch(`${API_URL}/api/investments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, parentId })
        });
        fetchAffordability();
        setAddingSubItemTo(null);
    };

    const priorityColors: Record<Priority, string> = {
        LOW: 'bg-steel/30 text-concrete/50',
        MEDIUM: 'bg-gold/20 text-gold',
        HIGH: 'bg-orange-500/20 text-orange-500',
        CRITICAL: 'bg-blood/20 text-blood'
    };

    const categoryIcons: Record<string, string> = {
        WIFE: '❤️',
        DAUGHTER: '👧',
        ME: '🧍‍♂️',
        RENT: '🏠',
        CAR: '🏎️',
        WEDDING: '💍',
        GROCERIES: '🛒'
    };

    return (
        <div className="flex flex-col p-4 gap-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-gold" />
                    <h1 className="font-display font-black text-2xl text-concrete uppercase tracking-wider">Acquisitions</h1>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="bg-gold text-void px-4 py-2 flex items-center gap-2 font-bold text-sm uppercase"
                >
                    <Plus size={16} /> Add Investment
                </button>
            </div>

            {/* BUDGET BUCKETS SUMMARY */}
            {affordability && affordability.buckets && (
                <div className="bg-steel/5 border border-steel/20 p-4 mb-2">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-steel/20">
                        <div className="font-display font-black text-lg text-concrete uppercase tracking-widest">
                            Baseline Allocation 
                            <span className="text-[10px] font-mono text-concrete/40 ml-2">(${affordability.allocatedMonthlyCosts} / ${affordability.maxMonthlyCapacity} USED)</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-500 uppercase font-bold">
                            REST OF REVENUE: SECURED TO SAVINGS
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(affordability.buckets).map(([key, bucket]) => {
                            const available = bucket.capacity - bucket.allocated;
                            const isFull = available <= 0;
                            return (
                                <div key={key} className={`border p-2 flex flex-col justify-between ${isFull ? 'border-blood/50 bg-blood/5' : 'border-steel/20 bg-void'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[10px] font-mono text-concrete/70 uppercase flex items-center gap-1">
                                            {categoryIcons[key] || '📦'} {key}
                                        </div>
                                        <div className="text-[9px] font-mono text-concrete/40">
                                            ${bucket.capacity} Cap
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`text-xl font-black ${isFull ? 'text-blood' : 'text-emerald-500'}`}>
                                            ${available.toFixed(0)} <span className="text-[10px] font-mono text-concrete/40">LEFT</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VIEW MODE TOGGLE */}
            <div className="flex gap-1 bg-steel/10 p-1 rounded-sm border border-steel/20 w-fit">
                {[
                    { mode: 'GRID' as ViewMode, icon: Grid },
                    { mode: 'GALLERY' as ViewMode, icon: Image },
                    { mode: 'LIST' as ViewMode, icon: List },
                    { mode: 'KANBAN' as ViewMode, icon: Columns }
                ].map(({ mode, icon: Icon }) => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`p-2 ${viewMode === mode ? 'bg-concrete text-void' : 'text-concrete/40 hover:text-concrete'}`}
                    >
                        <Icon size={16} />
                    </button>
                ))}
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-2">
                {(['PENDING', 'PURCHASED', 'ALL'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-[10px] font-mono uppercase px-3 py-1 border ${filter === f ? 'bg-concrete text-void border-concrete' : 'text-concrete/50 border-steel/20'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* INVESTMENT GRID/LIST */}
            <div className={`${viewMode === 'LIST' ? 'flex flex-col gap-2' : viewMode === 'GALLERY' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : viewMode === 'KANBAN' ? 'grid grid-cols-3 gap-4' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}`}>
                {investments
                    .filter(inv => filter === 'ALL' || (filter === 'PENDING' && inv.status === 'PENDING') || (filter === 'PURCHASED' && inv.status === 'PURCHASED'))
                    .map(inv => (
                        <div
                            key={inv.id}
                            className={`border-2 ${inv.isAffordable ? 'border-emerald-500 bg-emerald-500/5' : 'border-blood bg-blood/5'} p-3 flex flex-col gap-2`}
                        >
                            {/* Image - 1:1 Aspect Ratio for Vision Board */}
                            {inv.imageUrl && viewMode !== 'LIST' && (
                                <div className={`relative overflow-hidden ${viewMode === 'GALLERY' ? 'aspect-square' : 'h-32'}`}>
                                    <img
                                        src={inv.imageUrl}
                                        alt={inv.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                    {/* Gradient overlay for text readability in Gallery mode */}
                                    {viewMode === 'GALLERY' && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent" />
                                    )}
                                    {/* Title overlay in Gallery mode */}
                                    {viewMode === 'GALLERY' && (
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <h3 className="font-display font-black text-lg text-white drop-shadow-lg">{inv.title}</h3>
                                            {inv.description && (
                                                <p className="text-[10px] text-white/70 italic line-clamp-2 mt-1">{inv.description}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span>{categoryIcons[inv.category as string] || '📦'}</span>
                                    <h3 className="font-bold text-sm text-concrete">{inv.title}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    {inv.isRecurring && (
                                        <span className="text-[9px] px-2 py-0.5 rounded-sm bg-purple-500/20 text-purple-400">
                                            🔄 {inv.recurringInterval?.toLowerCase()}
                                        </span>
                                    )}
                                    <span className={`text-[9px] px-2 py-0.5 rounded-sm ${priorityColors[inv.priority as Priority] || priorityColors.MEDIUM}`}>
                                        {inv.priority}
                                    </span>
                                </div>
                            </div>

                            {/* Description (WHY) */}
                            {inv.description && (
                                <p className="text-[10px] text-concrete/50 italic line-clamp-2">{inv.description}</p>
                            )}

                            {/* Price */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-lg font-black text-gold">
                                        ${(inv.computedPrice || parseFloat(inv.price || '0')).toFixed(2)}
                                    </div>
                                    {inv.affordabilityType === 'MONTHLY_ALLOCATION' && (
                                        <div className="text-[9px] font-mono text-orange-400">
                                            Auto-allocating ${inv.monthlyAllocation}/mo
                                        </div>
                                    )}
                                </div>
                                <div className={`text-[9px] font-mono ${inv.isAffordable ? 'text-emerald-500' : 'text-blood'}`}>
                                    {inv.affordabilityType === 'MONTHLY_ALLOCATION' ? 'MONTHLY DRAW' : 'SINGLE BUY'}
                                </div>
                            </div>

                            {/* Sub-Items Toggle */}
                            {inv.subItems && inv.subItems.length > 0 && (
                                <button
                                    onClick={() => toggleExpand(inv.id)}
                                    className="flex items-center gap-1 text-[10px] font-mono text-concrete/50 hover:text-concrete"
                                >
                                    {expandedItems.has(inv.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    {inv.subItems.length} sub-items
                                </button>
                            )}

                            {/* Expanded Sub-Items */}
                            {expandedItems.has(inv.id) && inv.subItems && (
                                <div className="border-t border-steel/20 pt-2 space-y-1">
                                    {inv.subItems.map(sub => (
                                        <div key={sub.id} className="flex justify-between items-center text-[10px] font-mono text-concrete/70 group">
                                            <span>{sub.title} ({sub.quantity}×)</span>
                                            <div className="flex items-center gap-2">
                                                <span>${((sub.quantity || 1) * parseFloat(sub.unitPrice || sub.price || '0')).toFixed(2)}</span>
                                                <button
                                                    onClick={() => setEditingItem(sub)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-steel/20 text-gold transition-opacity"
                                                    title="Edit sub-item"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Affordability Badge */}
                            {inv.ruleViolation ? (
                                <div className="mt-auto py-1.5 text-center text-[10px] font-bold uppercase bg-blood text-white truncate px-2">
                                    {inv.ruleViolation}
                                </div>
                            ) : (
                                <div className={`mt-auto py-1.5 text-center text-[10px] font-bold uppercase ${inv.isAffordable ? 'bg-emerald-500 text-void' : 'bg-blood text-white'}`}>
                                    {inv.isAffordable ? '✓ CAN AFFORD' : `NEED ${inv.packagesNeeded} MORE PACKS`}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setEditingItem(inv)}
                                    className="flex-1 bg-steel/20 hover:bg-steel/40 text-concrete py-1.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                                >
                                    ✏️ Edit
                                </button>
                                {!inv.parentId && (
                                    <button
                                        onClick={() => setAddingSubItemTo(inv)}
                                        className="flex-1 bg-gold/20 hover:bg-gold/40 text-gold py-1.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                                    >
                                        + Sub
                                    </button>
                                )}
                                {inv.status === 'PENDING' && (
                                    <button
                                        onClick={() => markPurchased(inv.id)}
                                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1 ${inv.isAffordable ? 'bg-emerald-500 text-void' : 'bg-steel/30 text-concrete/50'}`}
                                    >
                                        <Check size={12} /> {inv.isAffordable ? 'Buy' : 'Force Buy'}
                                    </button>
                                )}
                                <button
                                    onClick={() => archiveInvestment(inv.id)}
                                    className="p-1.5 text-concrete/30 hover:text-blood"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* NEW INVESTMENT MODAL */}
            {showNewModal && (
                <NewInvestmentModal
                    onClose={() => setShowNewModal(false)}
                    onCreated={fetchAffordability}
                />
            )}

            {/* EDIT MODAL */}
            {editingItem && (
                <EditInvestmentModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={(data) => updateInvestment(editingItem.id, data)}
                />
            )}

            {/* ADD SUB-ITEM MODAL */}
            {addingSubItemTo && (
                <AddSubItemModal
                    parent={addingSubItemTo}
                    onClose={() => setAddingSubItemTo(null)}
                    onAdd={(data) => addSubItem(addingSubItemTo.id, data)}
                />
            )}
        </div>
    );
};

// New Investment Modal Component
const NewInvestmentModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        priority: 'MEDIUM',
        category: 'GROCERIES',
        imageUrl: '',
        targetDate: '',
        isRecurring: false,
        recurringInterval: 'WEEKLY'
    });

    const handleSubmit = async () => {
        if (!form.title || !form.price || !form.imageUrl) {
            alert('Title, Price, and Image are required!');
            return;
        }

        await fetch(`${API_URL}/api/investments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-void/80 flex items-center justify-center z-50 p-4">
            <div className="bg-void border-2 border-gold w-full max-w-md p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-display font-bold text-xl text-gold uppercase">New Investment</h2>
                    <button onClick={onClose} className="text-concrete/50 hover:text-blood">
                        <X size={20} />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                />

                <textarea
                    placeholder="Why do you need this? (Functional improvement)"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete h-20"
                />

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Price ($)"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                    />
                    <select
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                    >
                        <option value="LOW">Low Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="HIGH">High Priority</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>

                <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                >
                    <option value="GROCERIES">🛒 Groceries & Lifestyle ($510)</option>
                    <option value="ME">🧍‍♂️ Me ($330)</option>
                    <option value="WIFE">❤️ Wife ($330)</option>
                    <option value="DAUGHTER">👧 Daughter ($330)</option>
                    <option value="RENT">🏠 Rent ($600/mo)</option>
                    <option value="CAR">🏎️ Car / Emergency ($600/mo)</option>
                    <option value="WEDDING">💍 Wedding / Emergency ($600/mo)</option>
                </select>

                {/* Recurring Toggle */}
                <div className="border border-steel/20 p-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isRecurring}
                            onChange={e => setForm({ ...form, isRecurring: e.target.checked })}
                            className="w-4 h-4 accent-gold"
                        />
                        <span className="text-sm font-mono text-concrete">🔄 Make Recurring</span>
                    </label>
                    {form.isRecurring && (
                        <select
                            value={form.recurringInterval}
                            onChange={e => setForm({ ...form, recurringInterval: e.target.value })}
                            className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                        >
                            <option value="WEEKLY">Weekly (Groceries, etc.)</option>
                            <option value="MONTHLY">Monthly (Subscriptions, etc.)</option>
                        </select>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-blood uppercase">* Image (Required)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Paste URL or upload..."
                            value={form.imageUrl}
                            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                            className={`flex-1 bg-steel/10 border p-3 text-sm font-mono text-concrete ${form.imageUrl ? 'border-emerald-500' : 'border-blood'}`}
                        />
                        <label className="bg-gold hover:bg-gold/80 text-void px-4 py-3 text-sm font-bold uppercase cursor-pointer flex items-center">
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('photo', file);
                                    try {
                                        const res = await fetch(`${API_URL}/api/upload/photo`, {
                                            method: 'POST',
                                            body: formData
                                        });
                                        if (res.ok) {
                                            const data = await res.json();
                                            setForm(f => ({ ...f, imageUrl: data.url }));
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {form.imageUrl && (
                        <div className="aspect-square w-full max-w-[200px] mx-auto border border-emerald-500 overflow-hidden">
                            <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <input
                    type="date"
                    placeholder="Target Date"
                    value={form.targetDate}
                    onChange={e => setForm({ ...form, targetDate: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-gold text-void py-3 font-bold text-sm uppercase"
                >
                    Add Investment
                </button>
            </div>
        </div>
    );
};

// Edit Investment Modal Component
const EditInvestmentModal = ({ item, onClose, onSave }: { item: Investment; onClose: () => void; onSave: (data: Partial<Investment>) => void }) => {
    const [form, setForm] = useState({
        title: item.title,
        description: item.description || '',
        price: item.price,
        priority: item.priority,
        category: item.category,
        imageUrl: item.imageUrl || '',
        targetDate: item.targetDate || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || ''
    });

    const handleSave = () => {
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-void/80 flex items-center justify-center z-50 p-4">
            <div className="bg-void border-2 border-gold w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="font-display font-bold text-xl text-gold uppercase">Edit Investment</h2>
                    <button onClick={onClose} className="text-concrete/50 hover:text-blood">
                        <X size={20} />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                />

                <textarea
                    placeholder="Why do you need this?"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete h-20"
                />

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Price ($)"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                    />
                    <select
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
                        className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                    />
                    <input
                        type="text"
                        placeholder="Unit Price"
                        value={form.unitPrice}
                        onChange={e => setForm({ ...form, unitPrice: e.target.value })}
                        className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                />
                {form.imageUrl && (
                    <div className="aspect-square w-full max-w-[150px] mx-auto border border-steel/20 overflow-hidden">
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <button
                    onClick={handleSave}
                    className="w-full bg-gold text-void py-3 font-bold text-sm uppercase"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

// Add Sub-Item Modal Component
const AddSubItemModal = ({ parent, onClose, onAdd }: { parent: Investment; onClose: () => void; onAdd: (data: any) => void }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        quantity: 1,
        unitPrice: '',
        category: 'GROCERIES'
    });

    const handleAdd = () => {
        if (!form.title || !form.unitPrice) return;
        onAdd({
            ...form,
            price: '0',
            priority: 'MEDIUM'
        });
    };

    return (
        <div className="fixed inset-0 bg-void/80 flex items-center justify-center z-50 p-4">
            <div className="bg-void border-2 border-gold w-full max-w-md p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-display font-bold text-xl text-gold uppercase">Add Sub-Item</h2>
                        <p className="text-[10px] font-mono text-concrete/50">Parent: {parent.title}</p>
                    </div>
                    <button onClick={onClose} className="text-concrete/50 hover:text-blood">
                        <X size={20} />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Item Name (e.g., Œufs entiers)"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                />

                <input
                    type="text"
                    placeholder="Description (e.g., 6/jour)"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                />

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] font-mono text-concrete/50 block mb-1">Quantity</label>
                        <input
                            type="number"
                            placeholder="42"
                            value={form.quantity}
                            onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                            className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-mono text-concrete/50 block mb-1">Unit Price ($)</label>
                        <input
                            type="text"
                            placeholder="0.20"
                            value={form.unitPrice}
                            onChange={e => setForm({ ...form, unitPrice: e.target.value })}
                            className="w-full bg-steel/10 border border-steel/20 p-3 text-sm font-mono text-concrete"
                        />
                    </div>
                </div>

                <div className="bg-steel/10 p-3 border border-steel/20">
                    <span className="text-[10px] font-mono text-concrete/50">Subtotal: </span>
                    <span className="text-gold font-bold">${(form.quantity * parseFloat(form.unitPrice || '0')).toFixed(2)}</span>
                </div>

                <button
                    onClick={handleAdd}
                    className="w-full bg-gold text-void py-3 font-bold text-sm uppercase"
                >
                    Add Sub-Item
                </button>
            </div>
        </div>
    );
};

export default Investments;
