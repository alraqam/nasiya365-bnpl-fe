export default function setParams(obj: Record<string, string>) {
  const params = new URLSearchParams(window.location.search)

  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  return params.toString()
}
