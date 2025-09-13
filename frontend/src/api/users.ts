import {api} from "./api"
import type { User } from "../types/user"

export const usersAPI = {
    getUsers: () => api.get<User[]>('/users'),
    getUsersByUsername: (username:string) => api.get<User[]>(`/users/${username}`)
}