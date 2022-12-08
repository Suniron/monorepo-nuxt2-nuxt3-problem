// @ts-check

// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'

/**
 * @param {Number | null} score
 * @param {Boolean} hasVuln
 * @param {Boolean} scanned
 * @returns {"A" | "B" | "C" | "D" | "E" | "F"}
 */
export function riskScoreLetter(score: any, hasVuln = false, scanned = false) {
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
      log.error('riskScoreLetter: score out of range:', score)
      throw new Error('riskScoreLetter: score out of range: ' + score)
  }
}
