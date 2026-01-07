import { Pool, ResultSetHeader } from 'mysql2/promise';
import { connectDB } from '../config/database';

export interface Message {
  id: number;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'read' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export class MessageModel {
  private static db: Pool;

  static async init() {
    this.db = await connectDB();
  }

  static async findAll(page: number, limit: number, status?: string) {
    let query = 'SELECT * FROM messages';
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const [rows] = await this.db.query(query, params);
    return rows as Message[];
  }

  static async findById(id: number) {
    const [rows] = await this.db.execute('SELECT * FROM messages WHERE id = ?', [id]);
    const messageRows = rows as Message[];
    return messageRows[0];
  }

  static async create(message: Omit<Message, 'id' | 'status' | 'created_at' | 'updated_at'>) {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO messages (name, email, content) VALUES (?, ?, ?)',
      [message.name, message.email, message.content]
    );
    return { 
      id: result.insertId, 
      ...message, 
      status: 'pending',
      created_at: new Date(), 
      updated_at: new Date() 
    } as Message;
  }

  static async update(id: number, message: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(message)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    
    await this.db.execute(
      `UPDATE messages SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id: number) {
    await this.db.execute('DELETE FROM messages WHERE id = ?', [id]);
  }
}