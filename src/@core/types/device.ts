export default interface IDevice {
  id: number
  imei: string
  imei_2: null | string
  model: string
  provider: string
  account: null | string
  incoming_price: number
  status: number
  created_at: Date
  updated_at: Date
  order: {
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
    notes: string
    type: string
    is_cash: number
    quantity: number
    account: string
  }
}
