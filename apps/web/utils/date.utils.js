// @ts-check
import { differenceInSeconds } from 'date-fns'
/**
 * Get the duration between **date** param and the current date.
 * @param {string} date
 * @returns {string} Duration like like 3 hours ago, 1 day ago, 4 weeks ago, etc
 */
export const getDurationFromDate = (date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60)
    return `${seconds} second${seconds > 1 ? 's' : ''}`
  else if (minutes < 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  else if (hours < 24)
    return `${hours} hour${hours > 1 ? 's' : ''}`
  else if (days < 7)
    return `${days} day${days > 1 ? 's' : ''}`
  else if (weeks < 4)
    return `${weeks} week${weeks > 1 ? 's' : ''}`
  else if (months < 12)
    return `${months} month${months > 1 ? 's' : ''}`
  else
    return `${years} year${years > 1 ? 's' : ''}`
}

/**
 * Return the interval of time between two dates
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string} Time interval like X days, X hours, X min, X sec
 */
export const getTimeInterval = (startDate, endDate) => {
  if (!startDate || !endDate)
    return ''

  let diff = differenceInSeconds(new Date(endDate), new Date(startDate))
  const days = Math.floor(diff / (60 * 60 * 24))
  diff -= days * 24 * 60 * 60
  const hours = Math.floor(diff / (60 * 60))
  diff -= hours * 60 * 60
  const minutes = Math.floor(diff / 60)
  diff -= minutes * 60
  const secondes = Math.floor(diff)
  return days
    ? `${days
        } days, ${
        hours
        } hours, ${
        minutes
        } min, ${
        secondes
        } sec`
    : hours
      ? `${hours} hours, ${minutes} min, ${secondes} sec`
      : minutes
        ? `${minutes} min, ${secondes} sec`
        : `${secondes} sec`
}
