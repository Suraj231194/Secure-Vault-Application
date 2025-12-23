export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const calculateStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // Max 5
};

export const generatePassword = (length = 16, options = { upper: true, lower: true, numbers: true, symbols: true }) => {
    let charset = "";
    if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") return ""; // Fallback

    let retVal = "";
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
        retVal += charset[values[i] % charset.length];
    }
    return retVal;
};
