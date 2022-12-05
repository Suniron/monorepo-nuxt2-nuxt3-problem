// @ts-check
import { severityColor } from './color.utils'

/**
 * @param {Number} score
 * @returns {String}
 */
export function severityLevelString(score) {
  // [0]: INFO
  // ]0; 4[: LOW
  // [4; 7[: MEDIUM
  // [7; 9[: HIGH
  // [9; 10]: CRITICAL
  if (score > 0 && score < 4) {
    return 'low'
  }
  if (score >= 4 && score < 7) {
    return 'medium'
  }
  if (score >= 7 && score < 9) {
    return 'high'
  }
  if (score >= 9 && score <= 10) {
    return 'critical'
  }
  return 'info'
}

/**
 * @param {Number} score
 * @param {Boolean} hasVuln
 * @param {Boolean} scanned
 * @returns {String}
 */
export function riskScoreColor(score, hasVuln = false, scanned = false) {
  // [0]: GOOD or A
  // ]0; 4[: LOW or B
  // [4; 7[: MEDIUM or C
  // [7; 9[: HIGH or D
  // [9; 10]: CRITICAL or E
  if (hasVuln || scanned) {
    if (score === 0) {
      return severityColor('STATE_OF_THE_ART')
    }
    if (score > 0 && score < 4) {
      return severityColor('LOW')
    }
    if (score >= 4 && score < 7) {
      return severityColor('MEDIUM')
    }
    if (score >= 7 && score < 9) {
      return severityColor('HIGH')
    }
    if (score >= 9 && score <= 10) {
      return severityColor('CRITICAL')
    }
  }
  return severityColor('CATASTROPHIC')
}

/**
 * @param {Number} score
 * @param {Boolean} hasVuln
 * @param {Boolean} scanned
 * @returns {"A" | "B" | "C" | "D" | "E" | "F"}
 */
export function riskScoreLetter(score, hasVuln = false, scanned = false) {
  // [0]: GOOD or A
  // ]0; 4[: LOW or B
  // [4; 7[: MEDIUM or C
  // [7; 9[: HIGH or D
  // [9; 10]: CRITICAL or E
  switch (true) {
    case !hasVuln && !scanned:
    case score === null:
    case score === -1:
      return 'F'
    case score === 0:
      return 'A'
    case score > 0 && score < 4:
      return 'B'
    case score >= 4 && score < 7:
      return 'C'
    case score >= 7 && score < 9:
      return 'D'
    case score >= 9 && score <= 10:
      return 'E'
    default:
      // TODO: send by Elastic
      console.error('riskScoreLetter: score out of range: ' + score)
  }
}

/**
 * @param {Number} score
 * @returns {{letter: String, color: String, subtitle: String}}
 */
export function globalRiskScoreDisplays(score) {
  // [0]: GOOD or A
  // ]0; 4[: LOW or B
  // [4; 7[: MEDIUM or C
  // [7; 9[: HIGH or D
  // [9; 10[: CRITICAL or E
  // [10]: CATASTROPHIC or F
  if (score === 0) {
    return {
      letter: 'A',
      color: severityColor('STATE_OF_THE_ART'),
      subtitle: 'Good Compliance'
    }
  }
  if (score > 0 && score < 4) {
    return {
      letter: 'B',
      color: severityColor('LOW'),
      subtitle: 'Low Risk'
    }
  }
  if (score >= 4 && score < 7) {
    return {
      letter: 'C',
      color: severityColor('MEDIUM'),
      subtitle: 'Medium Risk'
    }
  }
  if (score >= 7 && score < 9) {
    return {
      letter: 'D',
      color: severityColor('HIGH'),
      subtitle: 'High Risk'
    }
  }
  if (score >= 9 && score < 10) {
    return {
      letter: 'E',
      color: severityColor('CRITICAL'),
      subtitle: 'Critical Risk'
    }
  }
  if (score >= 10) {
    return {
      letter: 'F',
      color: severityColor('CATASTROPHIC'),
      subtitle: 'Catastrophic Risk'
    }
  }
  return {
    letter: 'N/A',
    color: severityColor('OPEN'),
    subtitle: 'No Business Mission Score'
  }
}

/**
 * It returns the rounded risk score.
 *
 * If the score is not 0 or 10 or between, it returns -1 (= N/A)
 *
 * Examples:
 * - 3.324 => 3.32
 * - 3.325 => 3.33
 * - 12 => -1
 * @param {number} score
 * @returns number
 */
export const roundScore = (score) => {
  if (!score || score < 0 || score > 10) {
    return -1
  }

  return Math.round(score * 1e2) / 1e2
}
