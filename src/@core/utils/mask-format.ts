function maskFormat(value: string, format: string): string {
  const digits = value.replace(/\D/g, '') // Remove all non-digit characters
  let result = ''
  let digitIndex = 0

  for (let i = 0; i < format.length; i++) {
    const char = format[i]

    if (char === '#') {
      if (digitIndex < digits.length) {
        result += digits[digitIndex]
        digitIndex++
      } else {
        break // Stop when there are no more digits
      }
    } else {
      result += char // Add static formatting characters
    }
  }

  return result
}

export default maskFormat
