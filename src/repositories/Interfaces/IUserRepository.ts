import { User } from '../../models'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
  create(data: {
    name: string
    email: string
    password: string
    roleId: number
  }): Promise<User>
  save(user: User): Promise<User>
}
