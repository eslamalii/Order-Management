import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import Item from './Item'

@Table({
  tableName: 'categories',
  timestamps: false,
  underscored: true,
})
export default class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  name!: string

  @HasMany(() => Item)
  items?: Item[]
}
