import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'promos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('thumbnail').nullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('code').notNullable().unique()
      table.string('slug').notNullable().unique()
      table.date('start_date').notNullable()
      table.date('end_date').nullable()
      table.decimal('discount_value', 10, 2).notNullable()
      table.enum('discount_type', ['percentage', 'amount']).notNullable()
      table.boolean('is_auto_use').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['code', 'id'], 'idx_promos_code')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
