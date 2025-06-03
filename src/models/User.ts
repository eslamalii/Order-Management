import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript'
import Role from './Role'
import EmailVerificationToken from './EmailVerificationToken'
import PasswordResetToken from './PasswordResetToken'
import Order from './Order'

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  email!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_verified!: boolean

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id!: number

  @BelongsTo(() => Role)
  role?: Role

  @HasMany(() => EmailVerificationToken)
  emailVerificationTokens?: EmailVerificationToken[]

  @HasMany(() => PasswordResetToken)
  passwordResetTokens?: PasswordResetToken[]

  @HasMany(() => Order, 'cashier_id')
  orders_as_cashier?: Order[]

  @HasMany(() => Order, 'waiter_id')
  orders_as_waiter?: Order[]
}
