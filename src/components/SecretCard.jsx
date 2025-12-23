import { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, Trash2, Key, Check } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useVault } from '../hooks/useVault';
import { toast } from 'sonner';

const SecretCard = ({ secret }) => {
    const { deleteSecret } = useVault();
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    // Auto-clear clipboard state
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    // Clean password visibility after 10 seconds
    useEffect(() => {
        if (showPassword) {
            const timer = setTimeout(() => setShowPassword(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [showPassword]);

    const handleCopy = () => {
        navigator.clipboard.writeText(secret.password);
        setCopied(true);
        toast.success("Password copied to clipboard");
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this secret?')) {
            deleteSecret(secret.id);
            toast.success("Secret deleted");
        }
    };

    return (
        <div className="card hover:border-indigo-500/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                        <Key size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white leading-tight">{secret.name}</h3>
                        <p className="text-sm text-slate-400">{secret.username}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Secret"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 mb-4 flex items-center justify-between group-hover:border-slate-700 transition-colors">
                <code className="text-sm font-mono text-slate-300 truncate max-w-[140px] select-all">
                    {showPassword ? secret.password : '••••••••••••'}
                </code>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                        title={showPassword ? "Hide Password" : "Show Password"}
                    >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                        title="Copy Password"
                    >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            {secret.notes && (
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {secret.notes}
                </p>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-800">
                <span>Created {formatDate(secret.timestamp)}</span>
            </div>
        </div>
    );
};

export default SecretCard;
