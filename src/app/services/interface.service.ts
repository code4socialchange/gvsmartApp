export interface User {
  id: number,
  firstName: string,
  lastName: string,
  phone: number,
  role: string,
  active: boolean,
  VillageId: number,
  village?: Village
}

export interface LoginRequest {
  username: number,
  password: string,
  source?: string
}

export interface LoginResponse {
  success: boolean,
  token: string,
  user: User
}

export interface Village {
  id: number,
  name: string,
  district: string,
  pincode: string,
}

export interface getContactsResponse {
  success: boolean,
  users: Array<User>
}