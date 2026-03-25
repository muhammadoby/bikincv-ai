import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_cv_analyzers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('user_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .notNullable()

      table.bigInteger('order_id').notNullable().unique()
      table.bigInteger('order_number').notNullable().unique()
      table.json('request_payload').notNullable()
      table.text('cv_raw_text').notNullable()
      table.json('cv_parsed_json').notNullable()
      table.text('cv_markdown').notNullable()
      table.json('ai_response').notNullable()
      table.string('ai_model').notNullable()
      table.string('cv_path').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['id', 'user_id'], 'user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
