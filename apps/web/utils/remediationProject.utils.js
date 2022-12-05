/**
 * Parse, and clip HTML text to a given character limit
 * @param {String} remediationRawText
 * @param {Number} charLimit
 * @returns String
 */
export function parseRemediationHtml(remediationRawText, charLimit) {
  const div = document.createElement('div')
  div.innerHTML = (remediationRawText ?? '').replace(/\\n/g, ' ')
  if (charLimit) {
    // Break on the first word boundary after <charLimit> characters and replace with ellipsis if there is a match
    return div.textContent.replace(
      new RegExp(`(?<=.{${charLimit}}\\b).+`),
      '...'
    )
  }
  return div.textContent
}
