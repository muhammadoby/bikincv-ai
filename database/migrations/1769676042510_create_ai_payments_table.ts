import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ai_cv_id')
        .unsigned()
        .references('id')
        .inTable('ai_cv_analyzers')
        .onDelete('RESTRICT')
        .notNullable()
      table.enum('payment_method', ['midtrans', 'xendit']).notNullable()
      table.decimal('total_amount', 12, 2).notNullable()
      table.integer('promo_id')
        .unsigned()
        .references('id')
        .inTable('promos')
        .onDelete('RESTRICT')
        .nullable()
      table.string('order_id').notNullable().unique()
      table.decimal('total_paid', 12, 2).notNullable()
      table.enum('status', ['pending', 'paid', 'failed', 'expired']).notNullable().defaultTo('pending')
      table.json('gateway_response').nullable()
      table.string('channel').nullable()
      table.string('gateway_token').nullable()
      table.timestamp('expires_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['ai_cv_id', 'id'], 'idx_ai_payments_ai_cv_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
