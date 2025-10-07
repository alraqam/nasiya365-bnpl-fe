import IClient from 'src/@core/types/client'
import IDevice from 'src/@core/types/device'
import IOrder from 'src/@core/types/order'

export interface Payment {
  amount: number
  created_at: Date
  date: string
  discount: number
  id: number
}

export interface Response {
  status: boolean
  data: {
    client: IClient
    device: IDevice
    order: {
      monthlies: {
        comment: null | string
        created_at: Date
        id: number
        month: string
        order_id: number
        payment_month: number
        payments: Payment[]
        rest_summa: number
        status: number
        summa: number
      }[]
    } & IOrder
    phone: string[]
  }
}
