function dashToDotFormat(date: string) {
  const [day, month, year] = date.split('-')
  return `${year}.${month}.${day}`
}

export default dashToDotFormat
