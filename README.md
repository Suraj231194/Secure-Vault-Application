# Secure Vault

A production-ready robust password manager built with React, Tailwind CSS, and the Web Crypto API. This application demonstrates a zero-knowledge architecture where secrets are encrypted and decrypted entirely within the browser, ensuring sensitive data never leaves the device in plaintext.

## Overview

The application utilizes industry-standard security practices, including PBKDF2 for key derivation and AES-GCM for authenticated encryption. It is designed to be a standalone, offline-first secure storage solution that persists encrypted blobs to `localStorage`.

### Key Features
- **Zero-Knowledge Privacy**: Secrets are encrypted client-side; no server is involved.
- **Robust Encryption**: AES-256-GCM ensures both confidentiality and integrity.
- **Secure Key Management**: Encryption keys are derived from a master password using PBKDF2 with 100,000 iterations and a unique salt.
- **Ephemeral Access**: Decrypted secrets exist only in volatile memory and are wiped on page reload or inactivity.
- **Integrated Tools**: Includes a cryptographically secure password generator and strength analyzer.

## Getting Started

### Prerequisites
- Node.js v18+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Security Architecture

The application's security model relies on the native Web Crypto API for all cryptographic operations.

1.  **Key Derivation**: When a vault is created or unlocked, a 256-bit symmetric key is derived from the user's master password using PBKDF2-SHA256. A random 16-byte salt prevents rainbow table attacks.
2.  **Encryption**: Data is encrypted using AES-GCM, which provides authenticated encryption. This prevents attackers from tampering with the ciphertext without detection.
3.  **Storage**: The application only stores the `ciphertext`, `IV`, and `salt` in `localStorage`.
4.  **Memory Management**: Sensitive keys and plaintext data are held in React state and are automatically cleared when the application session ends (tab closure or refresh).

## Roadmap

- **Export/Import**: Encrypted JSON export for data portability.
- **Biometrics**: WebAuthn integration for seamless unlocking.
- **Timeout**: Configurable auto-lock duration.
