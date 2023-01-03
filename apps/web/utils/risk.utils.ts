import { severityColor } from './color.utils'
import { logDebug } from '~/lib/logger'

export function severityLevelString(score: number): 'high' | 'medium' | 'low' | 'critical' | 'info' {
  if (score > 0 && score < 4)
    return 'low'

  if (score >= 4 && score < 7)
    return 'medium'

  if (score >= 7 && score < 9)
    return 'high'

  if (score >= 9 && score <= 10)
    return 'critical'

  return 'info'
}

export const getRiskScoreColor = (score: number | null, hasVuln = false, scanned = false): string => {
  if ((!hasVuln && !scanned) || score === null || score === -1)
    return severityColor('CATASTROPHIC')

  if (score === 0)
    return severityColor('STATE_OF_THE_ART')

  if (score > 0 && score < 4)
    return severityColor('LOW')

  if (score >= 4 && score < 7)
    return severityColor('MEDIUM')

  if (score >= 7 && score < 9)
    return severityColor('HIGH')

  if (score >= 9 && score <= 10)
    return severityColor('CRITICAL')

  return severityColor('CATASTROPHIC')
}

export const getRiskScoreLetter = (score: number | null, hasVuln = false, scanned = false): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
  if ((!hasVuln && !scanned) || score === null || score === -1)
    return 'F'

  switch (true) {
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
      console.error(`getRiskScoreLetter: score out of range: ${score}`)
      return 'F'
  }
}

/**
  *
  * [0]: GOOD or A
  * ]0; 4[: LOW or B
  * [4; 7[: MEDIUM or C
  * [7; 9[: HIGH or D
  * [9; 10[: CRITICAL or E
  * [10]: CATASTROPHIC or F
*/
export function globalRiskScoreDisplays(score: number): ({ letter: string; color: string; subtitle: string }) {
  if (score === 0) {
    return {
      color: severityColor('STATE_OF_THE_ART'),
      letter: 'A',
      subtitle: 'Good Compliance',
    }
  }
  if (score > 0 && score < 4) {
    return {
      color: severityColor('LOW'),
      letter: 'B',
      subtitle: 'Low Risk',
    }
  }
  if (score >= 4 && score < 7) {
    return {
      color: severityColor('MEDIUM'),
      letter: 'C',
      subtitle: 'Medium Risk',
    }
  }
  if (score >= 7 && score < 9) {
    return {
      color: severityColor('HIGH'),
      letter: 'D',
      subtitle: 'High Risk',
    }
  }
  if (score >= 9 && score < 10) {
    return {
      color: severityColor('CRITICAL'),
      letter: 'E',
      subtitle: 'Critical Risk',
    }
  }
  if (score >= 10) {
    return {
      color: severityColor('CATASTROPHIC'),
      letter: 'F',
      subtitle: 'Catastrophic Risk',
    }
  }
  return {
    color: severityColor('OPEN'),
    letter: 'N/A',
    subtitle: 'No Business Mission Score',
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
 */
export const roundScore = (score: number): number => {
  if (!score && score !== 0)
    return -1

  if (score < 0 || score > 10) {
    logDebug(`roundScore: score out of range: ${score}`)
    return -1
  }

  return Math.round(score * 1e2) / 1e2
}
