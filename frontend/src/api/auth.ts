import {api} from "./api"
import type {AuthData, AuthResponse} from "../types/auth"
import type { User } from "../types/user"

export const authAPI = {
    login: (data:AuthData) => api.post<AuthResponse>('/login', data),
    register: (data:AuthData) => api.post<User>('/register', data),
    get_current_user: () => api.get<User>('/me'),
    logout: () => api.post('/logout')
}