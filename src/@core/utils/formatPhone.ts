function formatPhoneNumber(phone: string | number): string {
  const digits = phone.toString().replace(/\D/g, '')

  if (digits.length !== 9) return phone.toString()

  const code = digits.slice(0, 2)
  const part1 = digits.slice(2, 5)
  const part2 = digits.slice(5, 7)
  const part3 = digits.slice(7, 9)

  return `+998 ${code} ${part1} ${part2} ${part3}`
}

export default formatPhoneNumber
