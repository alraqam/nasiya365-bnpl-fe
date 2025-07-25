function formatDate(oldDate: string) {
  const date = oldDate.split('T')[0]
  const time = oldDate.split('T')[1].split('.')[0]

  return `${date} ${time}`
}

export default formatDate
