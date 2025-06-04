import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript'
import User from './User'
import Item from './Item'
import OrderItem from './OrderItem'
import { OrderStatus } from '../constants/OrderStatus'

@Table({
  tableName: 'orders',
  timestamps: true,
  underscored: true,
})
export default class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Default(OrderStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  status!: OrderStatus

  @Default(0)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total_cost!: number

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cashier_id!: number

  @BelongsTo(() => User, 'cashier_id')
  cashier?: User

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  waiter_id?: number

  @BelongsTo(() => User, 'waiter_id')
  waiter?: User

  @BelongsToMany(() => Item, () => OrderItem)
  items?: Item[]

  @HasMany(() => OrderItem)
  orderItems?: OrderItem[]
}
