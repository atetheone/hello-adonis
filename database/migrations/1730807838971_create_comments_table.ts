import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('content').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
