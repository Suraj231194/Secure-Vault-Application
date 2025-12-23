import { useState, useEffect } from 'react';
import { useVault } from '../hooks/useVault';
import { Lock, Unlock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const LockScreen = () => {
    const { vaultStatus, setupVault, unlockVault, error } = useVault();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isNew = vaultStatus === 'new';

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Slight delay to prevent brute-force (simulated for UI feel)
        await new Promise(r => setTimeout(r, 500));

        if (isNew) {
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                setIsLoading(false);
                return;
            }
            if (password.length < 8) {
                toast.error("Password must be at least 8 characters");
                setIsLoading(false);
                return;
            }
            await setupVault(password);
        } else {
            await unlockVault(password);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/10">
                        {isNew ? <ShieldCheck size={32} /> : <Lock size={32} />}
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isNew ? 'Setup Secure Vault' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-400">
                        {isNew
                            ? 'Create a master password to encrypt your local vault.'
                            : 'Enter your master password to unlock secure storage.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Master Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder={isNew ? "Create a strong password..." : "Enter password..."}
                                autoFocus
                            />
                        </div>

                        {isNew && (
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="Repeat password..."
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                            <AlertCircle size={16} />
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isNew ? 'Create Vault' : 'Unlock Vault'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        {isNew
                            ? 'Your password is used to derive the encryption key. It is never stored and cannot be recovered if lost.'
                            : 'Securely encrypted with AES-256-GCM. Decrypted only in memory.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LockScreen;
