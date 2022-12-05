// @ts-check

/**
 * This function is used to update the list of Business Impact attached to a Business Unit.
 *
 * // TODO: use give severity id instead of name
 *
 * @param {any} axios
 * @param {string} severityName Name of the Severity like C1, C2, C3, etc
 * @param {number[]} fearedEventId Id of the Feared Event
 */
export const updateFearedEventSeverity = async (
  axios,
  severityName,
  fearedEventId
) => {
  /**
   * @type {{data: import('@/types/businessImpactAnalysis').Severity[]}} severities
   */
  const { data: allSeverities } = await axios.get(`/severities/`)

  const severity = allSeverities.find(
    (severity) => severity.name.toUpperCase() === severityName.toUpperCase()
  )

  if (!severity) {
    throw new Error(`Severity ${severityName} not found`)
  }

  const { data } = await axios.patch('/feared-events/' + fearedEventId, {
    severityId: severity.id
  })
  return data
}
