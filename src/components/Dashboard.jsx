import { useState } from 'react';
import { useVault } from '../hooks/useVault';
import SecretCard from './SecretCard';
import AddSecretModal from './AddSecretModal';
import { Search, Plus, Lock, Shield, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { secrets, lockVault } = useVault();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // In-memory filter (secure, as secrets are decrypted in memory context)
    const filteredSecrets = secrets.filter(secret =>
        secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secret.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-500/10 p-2 rounded-lg">
                            <Shield className="text-indigo-400" size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-white hidden sm:block">Secure Vault</h1>
                    </div>

                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search secrets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add New</span>
                        </button>
                        <button
                            onClick={lockVault}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Lock Vault"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {secrets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 mb-6">
                            <Lock className="text-slate-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your vault is empty</h2>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                            Store your passwords securely. They are encrypted locally and never leave your device.
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-primary"
                        >
                            Add First Secret
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSecrets.map(secret => (
                                <SecretCard key={secret.id} secret={secret} />
                            ))}
                        </div>

                        {filteredSecrets.length === 0 && searchTerm && (
                            <div className="text-center py-12">
                                <p className="text-slate-500">No secrets found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <AddSecretModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
