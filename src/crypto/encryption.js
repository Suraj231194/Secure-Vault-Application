/**
 * Cryptographic utilities using Web Crypto API.
 * Implements PBKDF2 key derivation and AES-GCM encryption.
 */

// Helper to encode/decode
const enc = new TextEncoder();
const dec = new TextDecoder();

// Convert ArrayBuffer to Base64 string for storage
export const bufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Convert Base64 string to ArrayBuffer for crypto ops
export const base64ToBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Generate a random salt
export const generateSalt = () => {
    return window.crypto.getRandomValues(new Uint8Array(16));
};

// Generate a random IV for AES-GCM
export const generateIV = () => {
    return window.crypto.getRandomValues(new Uint8Array(12));
};

// Derive a key from the master password using PBKDF2
export const deriveKey = async (password, saltBuffer) => {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false, // Key is not extractable
        ["encrypt", "decrypt"]
    );
};

// Encrypt data (object) using the derived key
export const encryptVault = async (dataObj, key) => {
    try {
        const iv = generateIV();
        const encodedData = enc.encode(JSON.stringify(dataObj));

        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encodedData
        );

        return {
            cipherText: bufferToBase64(encryptedContent),
            iv: bufferToBase64(iv),
        };
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Failed to encrypt vault data");
    }
};

// Decrypt data using the derived key
export const decryptVault = async (cipherTextBase64, ivBase64, key) => {
    try {
        const iv = base64ToBuffer(ivBase64);
        const cipherText = base64ToBuffer(cipherTextBase64);

        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            cipherText
        );

        const decodedString = dec.decode(decryptedContent);
        return JSON.parse(decodedString);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Invalid password or corrupted data");
    }
};
