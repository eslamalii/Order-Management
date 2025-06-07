import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript'
import Category from './Category'
import Order from './Order'
import OrderItem from './OrderItem'

@Table({
  tableName: 'items',
  timestamps: true,
  underscored: true,
})
export default class Item extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  expiry_date!: Date

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock_qty!: number

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active!: boolean

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id!: number

  @BelongsTo(() => Category)
  category?: Category

  @BelongsToMany(() => Order, () => OrderItem)
  orders?: Order[]
}
