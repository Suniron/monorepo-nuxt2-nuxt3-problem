// @ts-check
import _ from 'lodash'

/**
 * @typedef {{
 *  id: number,
 *  compliance: string
 *  chapter: string,
 *  chapter_small: string,
 *  title: string,
 *  section: string,
 *  description: string,
 *  non_existant_risk: 'Critical' | 'High' | 'Medium' | 'Low' | 'Ok' | null,
 *  inneffective_risk: 'Critical' | 'High' | 'Medium' | 'Low' | 'Ok' | null,
 *  partially_effective_risk: 'Critical' | 'High' | 'Medium' | 'Low' | 'Ok' | null,
 *  effective_risk: 'Critical' | 'High' | 'Medium' | 'Low' | 'Ok' | null,
 *  docs: string,
 *  asset_id: number,
 *  name: string,
 *  compliance_id: number,
 *  status: 'Critical' | 'High' | 'Medium' | 'Low' | 'Ok' | null,
 *  mitigation: string,
 *  residual_risk: 'Critical' | 'High' | 'Medium' | 'Low' | 'Ok' | null,
 *  response: {text: string, value: string}[]
 * }} compliance
 */

/**
 *
 * @param {compliance[]} compliances
 * @returns {{chapter: string, chapter_small: string, completion: number, maturity: number}[]}
 */
export const computeComplianceStatistics = (compliances: any) => {
  const results: any = []
  compliances.forEach((section: any) => {
    let completion = 0
    let maturity = 0
    if (section.status !== null) {
      completion = 1
      if (section.residual_risk === 'Critical') {
        maturity = 1
      } else if (section.residual_risk === 'High') {
        maturity = 2
      } else if (section.residual_risk === 'Medium') {
        maturity = 3
      } else if (section.residual_risk === 'Low') {
        maturity = 4
      } else if (section.residual_risk === 'Ok') {
        maturity = 5
      }
    }
    let i = results.findIndex(
      // @ts-expect-error TS(7006): Parameter 'chapter' implicitly has an 'any' type.
      (chapter) => chapter.chapter_small === section.chapter_small
    )
    if (i > -1) {
      results[i].completion.push(completion)
      results[i].maturity.push(maturity)
    } else {
      results.push({
        chapter: section.chapter,
        chapter_small: section.chapter_small,
        completion: [completion],
        maturity: [maturity],
      })
    }
  })
  // @ts-expect-error TS(7006): Parameter 'chapter' implicitly has an 'any' type.
  return results.map((chapter) => {
    chapter.completion =
      Math.round(
        (_.sum(chapter.completion) / chapter.completion.length) * 100
      ) / 10
    chapter.maturity =
      Math.round(
        (_.sum(chapter.maturity) / (chapter.maturity.length * 5)) * 100
      ) / 10
    return chapter
  })
}
