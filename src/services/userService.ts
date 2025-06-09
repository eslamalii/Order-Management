import { injectable, inject } from 'inversify'
import { TYPES } from '../config/types'
import { IUserRepository } from '../repositories/Interfaces/IUserRepository'
import { IUserService } from './Interfaces/IUserService'
import { User, Role } from '../models'
import { Op } from 'sequelize'
import { UserRole } from '../enums/UserRole'

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: IUserRepository
  ) {}

  async getAdminsAndManagers(): Promise<any[]> {
    return await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          where: {
            name: {
              [Op.in]: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
            },
          },
        },
      ],
      attributes: ['id', 'email', 'name'],
    })
  }
}
