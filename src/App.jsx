import { useEffect } from 'react';
import { useVault, VaultProvider } from './hooks/useVault';
import Dashboard from './components/Dashboard';
import LockScreen from './components/LockScreen';
import { Toaster, toast } from 'sonner';
import { useIdle } from './hooks/useIdle';

const VaultApp = () => {
  const { vaultStatus, lockVault } = useVault();

  // Auto-lock after 5 minutes (300000ms) of inactivity
  useIdle(300000, () => {
    if (vaultStatus === 'unlocked') {
      lockVault();
      toast.info("Vault locked due to inactivity");
    }
  });

  if (vaultStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {vaultStatus === 'unlocked' ? <Dashboard /> : <LockScreen />}
      <Toaster position="top-right" theme="dark" richColors />
    </>
  );
};

function App() {
  return (
    <VaultProvider>
      <VaultApp />
    </VaultProvider>
  );
}


export default App;
