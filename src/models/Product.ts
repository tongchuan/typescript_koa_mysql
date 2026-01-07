import { Pool, ResultSetHeader } from 'mysql2/promise';
import { connectDB } from '../config/database';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export class ProductModel {
  private static db: Pool;

  static async init() {
    this.db = await connectDB();
  }

  static async findAll(page: number, limit: number, search?: string) {
    let query = 'SELECT * FROM products';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const [rows] = await this.db.query(query, params);
    return rows as Product[];
  }

  static async findById(id: number) {
    const [rows] = await this.db.execute('SELECT * FROM products WHERE id = ?', [id]);
    const productRows = rows as Product[];
    return productRows[0];
  }

  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO products (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)',
      [product.name, product.description, product.price, product.stock_quantity]
    );
    return { id: result.insertId, ...product, created_at: new Date(), updated_at: new Date() } as Product;
  }

  static async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(product)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    
    await this.db.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id: number) {
    await this.db.execute('DELETE FROM products WHERE id = ?', [id]);
  }
}