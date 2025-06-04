import { Container } from 'inversify'
import { IUserRepository } from '../repositories/Interfaces/IUserRepository'
import { TYPES } from './types'
import { UserRepository } from '../repositories/UserRepository'
import { AuthController } from '../controllers/authController'
import { IAuthService } from '../services/Interfaces/IAuthService'
import { AuthService } from '../services/AuthService'

const container = new Container()

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)

// Services
// container.bind<IUserService>(TYPES.UserService).to(UserService)
container.bind<IAuthService>(TYPES.AuthService).to(AuthService)

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

export { container }
