export default interface IEmployee {
  id: number
  name: string
  surname: string
  middle_name: null | string
  email: null | string
  phone1: string
  phone2: null | string
  email_verified_at: null | string
  passport: string
  place_of_issue: null | string
  date_of_issue: null | string
  date_of_birth: string
  gender: number
  place_of_birth: null | string
  place_of_residence: null | string
  family_status: null | string
  number_of_children: null | number
  status: number
  created_at: Date
  updated_at: Date
  role_id: number
}
