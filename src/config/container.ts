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
import { IOrderRepository } from '../repositories/Interfaces/IOrderRepository'
import { OrderRepository } from '../repositories/OrderRepository'
import { IOrderService } from '../services/Interfaces/IOrderService'
import { OrderService } from '../services/OrderService'
import { OrderController } from '../controllers/orderController'
import { ICommissionService } from '../services/Interfaces/ICommissionService'
import { CommissionService } from '../services/CommissionService'
import { CommissionController } from '../controllers/commissionController'

export const setupContainer = () => {
  const container = new Container()

  // Repositories
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
  container.bind<IItemRepository>(TYPES.ItemRepository).to(ItemRepository)
  container.bind<IOrderRepository>(TYPES.OrderRepository).to(OrderRepository)

  // Services
  // container.bind<IUserService>(TYPES.UserService).to(UserService)
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService)
  container.bind<IItemService>(TYPES.ItemService).to(ItemService)
  container.bind<IOrderService>(TYPES.OrderService).to(OrderService)
  container
    .bind<ICommissionService>(TYPES.CommissionService)
    .to(CommissionService)

  // Controllers
  container.bind<AuthController>(TYPES.AuthController).to(AuthController)
  container.bind<ItemController>(TYPES.ItemController).to(ItemController)
  container.bind<OrderController>(TYPES.OrderController).to(OrderController)
  container
    .bind<CommissionController>(TYPES.CommissionController)
    .to(CommissionController)

  return container
}
