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

export interface Blog {
  category: string,
  createdAt: string,
  id: number,
  name: string,
  updatedAt: string,
  content?: string
}

export interface BlogListResponse {
  blogs: Array<Blog>,
  success: boolean
}

export interface BlogResponse {
  blog: Blog,
  success: boolean
}

export interface Interaction {
  message: string,
  senderId: number,
  receiverId: number,
  messageType: 'text' | 'video' | 'image',
  imagePath?: string,
  received: boolean,
  createdAt: Date
  updatedAt: Date,
  synced?: boolean
}