const resolveStatus = (status: number): { color: 'success' | 'error' | 'warning' | 'default'; label: string } => {
  switch (status) {
    case 0:
      return {
        color: 'success',
        label: 'Aktiv'
      }
    case 1:
      return {
        color: 'error',
        label: 'Passiv'
      }
    case 2:
      return {
        color: 'warning',
        label: 'Bekor qilindi'
      }
    default:
      return {
        color: 'default',
        label: 'Bekor qilindi'
      }
  }
}

export default resolveStatus
