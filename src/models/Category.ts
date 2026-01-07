import { Pool, ResultSetHeader } from 'mysql2/promise';
import { connectDB } from '../config/database';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export class CategoryModel {
  private static db: Pool;

  static async init() {
    this.db = await connectDB();
  }

  static async findAll(page: number, limit: number, search?: string) {
    let query = 'SELECT * FROM categories';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    // console.log(query, params);
    const [rows] = await this.db.query(query, params);
    return rows as Category[];
  }

  static async findById(id: number) {
    const [rows] = await this.db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    const categoryRows = rows as Category[];
    return categoryRows[0];
  }

  static async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [category.name, category.description]
    );
    return { id: result.insertId, ...category, created_at: new Date(), updated_at: new Date() } as Category;
  }

  static async update(id: number, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(category)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    
    await this.db.execute(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id: number) {
    await this.db.execute('DELETE FROM categories WHERE id = ?', [id]);
  }
}