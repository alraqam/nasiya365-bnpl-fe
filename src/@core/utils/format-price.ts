const formatPrice = (value: string) => {
  // Remove all non-digit characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '')

  // Handle multiple decimal points
  const parts = cleaned.split('.')
  const integerPart = parts[0]
  const decimalPart = parts.length > 1 ? parts[1].substring(0, 2) : ''

  // Format integer part with spaces
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  // Combine parts
  let formatted = formattedInteger
  if (parts.length > 1) {
    formatted += '.' + decimalPart
  }

  return formatted
}

export default formatPrice
