import { useState } from 'react';
import { useVault } from '../hooks/useVault';
import { X, RefreshCw, Save, ShieldAlert, ShieldCheck, Shield, Copy } from 'lucide-react';
import { generatePassword, calculateStrength } from '../utils/helpers';
import { toast } from 'sonner';

const AddSecretModal = ({ isOpen, onClose }) => {
    const { addSecret } = useVault();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        notes: ''
    });

    // Password Generator State
    const [genLength, setGenLength] = useState(16);
    const [genOptions, setGenOptions] = useState({
        upper: true,
        lower: true,
        numbers: true,
        symbols: true
    });
    // Initialize with a generated password immediately
    const [generatedPassword, setGeneratedPassword] = useState(() =>
        generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true })
    );

    const updateOption = (key) => {
        const newOptions = { ...genOptions, [key]: !genOptions[key] };
        // Prevent all false
        if (!newOptions.upper && !newOptions.lower && !newOptions.numbers && !newOptions.symbols) return;

        setGenOptions(newOptions);
        setGeneratedPassword(generatePassword(genLength, newOptions));
    };

    const updateLength = (val) => {
        setGenLength(val);
        setGeneratedPassword(generatePassword(val, genOptions));
    };

    if (!isOpen) return null;

    const strength = calculateStrength(formData.password);

    const getStrengthColor = (s) => {
        if (s <= 2) return 'bg-red-500';
        if (s <= 3) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    const getStrengthText = (s) => {
        if (s <= 2) return 'Weak';
        if (s <= 3) return 'Moderate';
        return 'Strong';
    };

    const handleUsePassword = () => {
        setFormData({ ...formData, password: generatedPassword });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSecret(formData);
        setFormData({ name: '', username: '', password: '', notes: '' });
        toast.success("Secret saved securely");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="w-full max-w-lg card relative animate-in zoom-in-95 duration-200 bg-slate-900 border-slate-700 my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield size={24} className="text-indigo-400" />
                    Add New Secret
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Account Name <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Gmail, GitHub, Netflix"
                            className="input-field"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Username / Email <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="your@email.com"
                            className="input-field"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Password <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="Enter or generate password"
                                className="input-field pr-12"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {formData.password && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden flex-1">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                                        style={{ width: `${(strength / 5) * 100}%` }}
                                    />
                                </div>
                                <span className={`text-xs font-medium ${strength > 3 ? 'text-emerald-400' : strength > 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {getStrengthText(strength)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Password Generator */}
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-300">Password Generator</label>
                            <button
                                type="button"
                                onClick={() => setGeneratedPassword(generatePassword(genLength, genOptions))}
                                className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                                title="Regenerate"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>

                        <div className="relative">
                            <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-center break-all font-mono text-indigo-100 min-h-[48px] flex items-center justify-center">
                                {generatedPassword || <span className="text-slate-600 italic">Select options to generate</span>}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedPassword);
                                    toast.success("Key copied");
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-emerald-400 transition-colors"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Length</span>
                                <span>{genLength}</span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="32"
                                value={genLength}
                                onChange={(e) => updateLength(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: 'upper', label: 'A-Z' },
                                { id: 'lower', label: 'a-z' },
                                { id: 'numbers', label: '0-9' },
                                { id: 'symbols', label: '!@#' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => updateOption(opt.id)}
                                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${genOptions[opt.id]
                                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'
                                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleUsePassword}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
                        >
                            Use This Password
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Notes (optional)</label>
                        <textarea
                            className="input-field min-h-[80px] py-3 resize-none"
                            placeholder="Add any additional notes..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            Add Secret
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSecretModal;
