export default interface IExpense {
  id: number
  type: string
  name: string
  amount: number
  model: null | string
  imei: null | string
  created_at: string
}
