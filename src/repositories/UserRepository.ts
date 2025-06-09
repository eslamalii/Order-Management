import { injectable } from 'inversify'
import { Role, User } from '../models'
import { IUserRepository } from './Interfaces/IUserRepository'
import { Op } from 'sequelize'
import { UserRole } from '../enums/UserRole'

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email }, include: [Role] })
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id, { include: [Role] })
  }

  async create(data: {
    name: string
    email: string
    password: string
    roleId: number
  }): Promise<User> {
    const { name, email, password, roleId } = data
    const user = await User.create({
      name,
      email,
      password,
      role_id: roleId,
    })
    return user
  }

  async save(user: User): Promise<User> {
    return user.save()
  }

  async findAdminsAndManagers(): Promise<User[]> {
    return User.findAll({
      include: [
        {
          model: Role,
          where: {
            name: {
              [Op.in]: [UserRole.MANAGER, UserRole.SUPER_ADMIN],
            },
          },
        },
      ],
      attributes: ['id', 'email', 'name'],
    })
  }
}
