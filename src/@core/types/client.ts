export default interface IClient {
  id: number
  name: string
  surname: string
  middle_name: null | string
  passport: null | string
  place_of_issue: null | string
  date_of_issue: null | string
  file_passport: 'undefined' | string
  date_of_birth: null | string
  gender: number
  place_of_birth: null | string
  place_of_registration: null | string
  place_of_residence: null | string
  workplace: null | string
  specialization: null | string
  family_status: null | string
  number_of_children: null | string
  phones: string
  email: null | string
  file: 'undefined' | string
  status: number
  bail_name: null | string
  bail_phone: null | string
  guarantor: null | string
  passport_status: null | string
  created_at: string
  updated_at: string
  file_url: string
  file_passport_url: string
  phone: string[]
}
