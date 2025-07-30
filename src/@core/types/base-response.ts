export interface Response<T> {
  status: boolean
  data: {
    current_page: string
    data: T
    first_page_url: string
    last_page_url: string
    next_page_url: string
    prev_page_url: string
    path: string
    per_page: number
    from: number
    to: number
    last_page: number
    total: number
    links: {
      active: boolean
      label: string
      url: string
    }[]
  }
}

export type PostResponse<T extends string> =
  | {
      status: true
      messages: string[]
    }
  | {
      status: false
      errors: Partial<Record<T, string[]>>
    }
