import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import User from './User'

@Table({
  tableName: 'email_verification_tokens',
  timestamps: false,
  underscored: true,
})
export default class EmailVerificationToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number

  @BelongsTo(() => User)
  user?: User

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expires_at!: Date
}
