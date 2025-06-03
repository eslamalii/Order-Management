import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript'
import Order from './Order'
import Item from './Item'

@Table({
  tableName: 'order_items',
  timestamps: false,
  underscored: true,
})
export default class OrderItem extends Model {
  @PrimaryKey
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id!: number

  @BelongsTo(() => Order)
  order?: Order

  @PrimaryKey
  @ForeignKey(() => Item)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  item_id!: number

  @BelongsTo(() => Item)
  item?: Item

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  unit_price!: number
}
