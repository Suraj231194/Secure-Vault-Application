# 🔐 Secure Vault

A **production-ready, robust password manager** built with **React**, **Tailwind CSS**, and the **Web Crypto API**. This application demonstrates a **zero-knowledge architecture** where secrets are encrypted and decrypted entirely within the browser, ensuring sensitive data never leaves the device in plaintext.

---

## 📖 Overview

The application utilizes **industry-standard security practices**, including **PBKDF2** for key derivation and **AES-GCM** for authenticated encryption. It is designed as a **standalone, offline-first secure vault** that persists only encrypted data to `localStorage`.

---

## ✨ Key Features

- 🔐 **Zero-Knowledge Privacy**: Secrets are encrypted client-side; no backend or server is involved.
- 🛡️ **Robust Encryption**: AES-256-GCM ensures both confidentiality and integrity of stored secrets.
- 🔑 **Secure Key Management**: Encryption keys are derived from a master password using PBKDF2 (100,000 iterations + unique salt).
- 🧠 **Ephemeral Access**: Decrypted secrets exist only in volatile memory and are wiped on page refresh or session end.
- 🧰 **Integrated Tools**: Includes a cryptographically secure password generator and strength analyzer.

---

## 🗝️ Vault & Secrets

Each stored secret contains:
- 📛 Name
- 👤 Username
- 🔑 Password
- 📝 Notes (optional)

Users can:
- ➕ Create a new secret
- 📋 View a list of stored secrets
- 🗑️ Delete secrets securely

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js v18+

### 📦 Installation

```bash
npm install
```

### 🧪 Development

```bash
npm run dev
```

### 🏗️ Production Build

```bash
npm run build
```

---

## 🔐 Security Architecture

All cryptographic operations rely on the native Browser Web Crypto API.

**🔑 Key Derivation**
A 256-bit symmetric key is derived from the master password using PBKDF2-SHA256 with a random 16-byte salt to prevent rainbow table attacks.

**🔒 Encryption**
Secrets are encrypted using AES-GCM, providing authenticated encryption and tamper detection.

**💾 Storage**
Only the encrypted ciphertext, initialization vector (IV), and salt are stored in `localStorage`.

**🧠 Memory Management**
Decrypted secrets and keys exist only in React state and are cleared on page refresh or lock.

---

## 🔓 Lock / Unlock Flow

- 🔒 The application starts in a locked state
- 🔑 Users unlock the vault using a master password
- 🔄 The vault auto-locks on page refresh
- 🧹 All decrypted data is removed from memory on lock

---

## 🧱 Project Structure

```text
src/
├── components/     # UI components (Dashboard, LockScreen, Modals)
├── crypto/         # Cryptographic logic (encryption, key derivation)
├── hooks/          # Vault state & lifecycle management
├── utils/          # Helpers (validators, generators, constants)
└── App.jsx         # Application entry & routing
```

---

## 📋 Constraints & Guarantees

- ❌ No backend or API routes
- ❌ No server actions
- ❌ No third-party crypto libraries
- ❌ No plaintext secret storage
- ✅ Encrypted persistence only
- ✅ In-memory decryption only

---

## 🧪 Bonus Features

- 🔐 Secure password generator
- 📋 Clear explanation of security decisions
- 🔍 In-memory search (no plaintext persistence)
- ⏱️ Auto-lock on refresh

---

## 🛣️ Roadmap

- 📤 Encrypted export/import
- 🔐 Biometric unlock (WebAuthn)
- ⏲️ Configurable inactivity auto-lock

---

## 🧑‍💻 Author

**Suraj Pawar**
Frontend Developer – React | Next.js | Tailwind CSS
