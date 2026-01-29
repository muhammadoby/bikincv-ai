import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jwt_refresh_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table
        .bigInteger('tokenable_id')
        .notNullable()
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash', 80).notNullable()
      table.text('abilities').notNullable()
      table.timestamp('created_at', { precision: 6, useTz: true }).notNullable()
      table.timestamp('updated_at', { precision: 6, useTz: true }).notNullable()
      table.timestamp('expires_at', { precision: 6, useTz: true }).nullable()
      table.timestamp('last_used_at', { precision: 6, useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
