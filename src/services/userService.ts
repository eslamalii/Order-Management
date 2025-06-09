import { injectable, inject } from 'inversify'
import { TYPES } from '../config/types'
import { IUserRepository } from '../repositories/Interfaces/IUserRepository'
import { IUserService } from './Interfaces/IUserService'

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async getAdminsAndManagers(): Promise<any[]> {
    return await this.userRepository.findAdminsAndManagers()
  }
}
