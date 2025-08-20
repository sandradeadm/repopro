// ========== PASSWORD VALIDATION ==========

// Verify that password meets security requirements
function validarPassword(password) {
    const minLength = 8;
    const maxLength = 16;
    if (password.length < minLength || password.length > maxLength) return false;
    if (!/[A-Z]/.test(password)) return false; // At least one uppercase
    if (!/[a-z]/.test(password)) return false; // At least one lowercase
    if (!/[0-9]/.test(password)) return false; // At least one number
    if (!/[!@#$%^&*()_\-+=\[\]{};:,.<>|\/?]/.test(password)) return false; // At least one special character
    return true;
}