import { useState, useContext, createContext, useEffect, useCallback } from 'react';
import {
    generateSalt,
    deriveKey,
    encryptVault,
    decryptVault,
    bufferToBase64,
    base64ToBuffer
} from '../crypto/encryption';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
    const [vaultStatus, setVaultStatus] = useState('loading'); // 'loading', 'new', 'locked', 'unlocked'
    const [secrets, setSecrets] = useState([]);
    const [encryptionKey, setEncryptionKey] = useState(null);
    const [error, setError] = useState(null);

    // Check initial state on mount
    useEffect(() => {
        const salt = localStorage.getItem('app_vault_salt');
        const data = localStorage.getItem('app_vault_data');

        // Determine initial vault state
        if (!salt || !data) {
            setVaultStatus('new');
        } else {
            setVaultStatus('locked');
        }
    }, []);

    // Lock the vault (clear memory)
    const lockVault = useCallback(() => {
        setSecrets([]);
        setEncryptionKey(null);
        setVaultStatus('locked');
        setError(null);
    }, []);

    // Initialize a new vault
    const setupVault = async (masterPassword) => {
        try {
            const salt = generateSalt();
            const key = await deriveKey(masterPassword, salt);

            const initialData = [];
            const { cipherText, iv } = await encryptVault(initialData, key);

            // Store Salt and Encrypted Data
            localStorage.setItem('app_vault_salt', bufferToBase64(salt));
            localStorage.setItem('app_vault_data', JSON.stringify({ cipherText, iv }));

            setEncryptionKey(key);
            setSecrets(initialData);
            setVaultStatus('unlocked');
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to setup vault');
        }
    };

    // Unlock existing vault
    const unlockVault = async (masterPassword) => {
        try {
            const saltBase64 = localStorage.getItem('app_vault_salt');
            const dataString = localStorage.getItem('app_vault_data');

            if (!saltBase64 || !dataString) {
                throw new Error("Vault data missing");
            }

            const salt = base64ToBuffer(saltBase64);
            const { cipherText, iv } = JSON.parse(dataString);

            // Derive key (expensive operation)
            const key = await deriveKey(masterPassword, salt);

            // Attempt decrypt
            const decryptedData = await decryptVault(cipherText, iv, key);

            setEncryptionKey(key);
            setSecrets(decryptedData);
            setVaultStatus('unlocked');
            setError(null);
        } catch (err) {
            console.error("Unlock failed", err);
            // Determine if it's password error or corruption
            // Usually decryption failure means wrong key => wrong password
            setError('Incorrect Password');
        }
    };

    // Add secret
    const addSecret = async (secretData) => {
        if (!encryptionKey) { return; }

        const newSecret = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...secretData
        };

        const newSecrets = [...secrets, newSecret];

        // Encrypt and Save
        try {
            const { cipherText, iv } = await encryptVault(newSecrets, encryptionKey);
            localStorage.setItem('app_vault_data', JSON.stringify({ cipherText, iv }));
            setSecrets(newSecrets); // Update UI only after successful save
        } catch (err) {
            setError('Failed to save secret');
        }
    };

    // Delete secret
    const deleteSecret = async (id) => {
        if (!encryptionKey) { return; }

        const newSecrets = secrets.filter(s => s.id !== id);

        try {
            const { cipherText, iv } = await encryptVault(newSecrets, encryptionKey);
            localStorage.setItem('app_vault_data', JSON.stringify({ cipherText, iv }));
            setSecrets(newSecrets);
        } catch (err) {
            setError('Failed to delete secret');
        }
    };

    return (
        <VaultContext.Provider value={{
            vaultStatus,
            secrets,
            error,
            lockVault,
            setupVault,
            unlockVault,
            addSecret,
            deleteSecret
        }}>
            {children}
        </VaultContext.Provider>
    );
};

export const useVault = () => useContext(VaultContext);
