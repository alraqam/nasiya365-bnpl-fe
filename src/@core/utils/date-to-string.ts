function dateToString(
  date: Date | string | null,
  expected: 'year-month-day' | 'day-month-year' | 'month-day-year' = 'year-month-day',
  separator: string = '-'
): string | null {
  if (!date) return null

  // If date is a string, convert to Date object
  const d = typeof date === 'string' ? new Date(date) : date

  // Check if valid date
  if (isNaN(d.getTime())) return null

  const year = d.getFullYear().toString()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')

  switch (expected) {
    case 'day-month-year':
      return `${day}${separator}${month}${separator}${year}`
    case 'month-day-year':
      return `${month}${separator}${day}${separator}${year}`
    case 'year-month-day':
    default:
      return `${year}${separator}${month}${separator}${day}`
  }
}

export default dateToString
