const COLORS = {
  LOW: '#f0d802',
  MEDIUM: '#ed9b0e',
  HIGH: '#d92b2b',
  CRITICAL: '#941e1e',
  STATE_OF_THE_ART: '#22b14c',
  OPEN: '#E0E0E0',
  IN_PROGRESS: '#BBDEFB',
  TO_REVIEW: '#FFE0B2',
  COMPLETED: '#A5D6A7',
  CANCELED: '#BDBDBD',
  CATASTROPHIC: '#470E0E',
  OVERDUE: '#EF9A9A'
}

/**
 * Returns the color associated with the severity level
 * @param {keyof typeof COLORS} severity
 * @returns {string} Hex color code prefixed with a hash
 */
export const severityColor = (severity) => {
  if (!severity) {
    return '#b0b0b0'
  }

  return COLORS[severity.toUpperCase()] ?? '#b0b0b0'
}

/**
 * Returns the color associated with the severity level
 * @param {import("~/types/remediationProject").RemediationProjectStatus} status
 * @returns {string} Hex color code prefixed with a hash
 */
export const statusColor = (status) => {
  if (!status) {
    return '#b0b0b0'
  }

  return COLORS[status.toUpperCase()] ?? '#b0b0b0'
}
