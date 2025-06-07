import { Container } from 'inversify'
import { IUserRepository } from '../repositories/Interfaces/IUserRepository'
import { TYPES } from './types'
import { UserRepository } from '../repositories/UserRepository'
import { AuthController } from '../controllers/authController'
import { IAuthService } from '../services/Interfaces/IAuthService'
import { AuthService } from '../services/AuthService'
import { IItemRepository } from '../repositories/Interfaces/IItemRepository'
import { ItemRepository } from '../repositories/ItemRepository'
import { IItemService } from '../services/Interfaces/IItemService'
import { ItemService } from '../services/ItemService'
import { ItemController } from '../controllers/itemController'

export const setupContainer = () => {
  const container = new Container()

  // Repositories
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
  container.bind<IItemRepository>(TYPES.ItemRepository).to(ItemRepository)

  // Services
  // container.bind<IUserService>(TYPES.UserService).to(UserService)
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService)
  container.bind<IItemService>(TYPES.ItemService).to(ItemService)

  // Controllers
  container.bind<AuthController>(TYPES.AuthController).to(AuthController)
  container.bind<ItemController>(TYPES.ItemController).to(ItemController)

  return container
}
