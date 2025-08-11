export default interface IAccessory {
  id: number
  seria_number: string
  model: string
  provider: string
  account: string
  incoming_price: number
  status: number
  quantity: number
  created_at: string
  updated_at: Date
}
