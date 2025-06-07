import { sequelize } from '../config/database'
import Role from '../models/Role'
import Category from '../models/Category'
import { UserRole } from '../enums/UserRole'
import { ItemCategory } from '../enums/ItemCategory'

async function seed() {
  try {
    await sequelize.authenticate()
    console.log('✅ DB connected for seeding.')

    // Seed Roles
    const roles = Object.values(UserRole)
    for (const name of roles) {
      await Role.findOrCreate({ where: { name } })
    }
    console.log('✅ Roles seeded.')

    // Seed Categories
    const categories = Object.values(ItemCategory)
    for (const name of categories) {
      await Category.findOrCreate({ where: { name } })
    }
    console.log('✅ Categories seeded.')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()
