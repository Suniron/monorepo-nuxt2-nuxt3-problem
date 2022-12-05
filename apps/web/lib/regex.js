/**
 * Escapes special characters used in regexes
 *
 * @param {string} str String to be escaped
 * @returns A regex-escaped string
 */
export const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
