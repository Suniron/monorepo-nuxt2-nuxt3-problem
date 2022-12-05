// Check if password is 12 chars long, has one lowercase character, one uppercase character, one number and one special character
export const PASSWORD_VALIDATION_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/
