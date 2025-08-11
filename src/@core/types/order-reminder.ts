export default interface IReminder {
  id: number
  NumberOrder: number
  client_id: number
  device_id: number
  user_id: number
  pay_type: number
  body_price: number
  summa: number
  initial_payment: number
  rest_summa: number
  discount: number
  benefit: number
  box: number
  pay_day: number
  status: number
  startDate: string
  created_at: Date
  updated_at: Date
  notes: null | string
  type: string
  is_cash: number
  quantity: number
  account: string
  name: string
  surname: string
  phones: string
  model: string
  imei: string
  monthly_id: number
  phone: string[]
}
