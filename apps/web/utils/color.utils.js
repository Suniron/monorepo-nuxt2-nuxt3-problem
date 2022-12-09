const COLORS = {
  CANCELED: '#BDBDBD',
  CATASTROPHIC: '#470E0E',
  COMPLETED: '#A5D6A7',
  CRITICAL: '#941e1e',
  HIGH: '#d92b2b',
  IN_PROGRESS: '#BBDEFB',
  LOW: '#f0d802',
  MEDIUM: '#ed9b0e',
  OPEN: '#E0E0E0',
  OVERDUE: '#EF9A9A',
  STATE_OF_THE_ART: '#22b14c',
  TO_REVIEW: '#FFE0B2',
}

/**
 * Returns the color associated with the severity level
 * @param {keyof typeof COLORS} severity
 * @returns {string} Hex color code prefixed with a hash
 */
export const severityColor = (severity) => {
  if (!severity)
    return '#b0b0b0'

  return COLORS[severity.toUpperCase()] ?? '#b0b0b0'
}

/**
 * Returns the color associated with the severity level
 * @param {import("~/types/remediationProject").RemediationProjectStatus} status
 * @returns {string} Hex color code prefixed with a hash
 */
export const statusColor = (status) => {
  if (!status)
    return '#b0b0b0'

  return COLORS[status.toUpperCase()] ?? '#b0b0b0'
}
