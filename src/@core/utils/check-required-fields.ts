export default function checkRequiredFields<T>(requireds: string[], form: T): boolean {
  return requireds.some(field => !form[field as keyof typeof form])
}
