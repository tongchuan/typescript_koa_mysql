import { Pool, ResultSetHeader } from 'mysql2/promise';
import { connectDB } from '../config/database';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export class NewsModel {
  private static db: Pool;

  static async init() {
    this.db = await connectDB();
  }

  static async findAll(page: number, limit: number, search?: string) {
    let query = 'SELECT * FROM news';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE title LIKE ? OR content LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const [rows] = await this.db.query(query, params);
    return rows as NewsItem[];
  }

  static async findById(id: number) {
    const [rows] = await this.db.execute('SELECT * FROM news WHERE id = ?', [id]);
    const newsRows = rows as NewsItem[];
    return newsRows[0];
  }

  static async create(news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO news (title, content, category_id) VALUES (?, ?, ?)',
      [news.title, news.content, news.category_id]
    );
    return { id: result.insertId, ...news, created_at: new Date(), updated_at: new Date() } as NewsItem;
  }

  static async update(id: number, news: Partial<Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>>) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(news)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    
    await this.db.execute(
      `UPDATE news SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id: number) {
    await this.db.execute('DELETE FROM news WHERE id = ?', [id]);
  }

  static async deleteMany(ids: number[]) {
    const placeholders = ids.map(() => '?').join(',');
    await this.db.execute(`DELETE FROM news WHERE id IN (${placeholders})`, ids);
  }

  static async count(search?: string) {
    let query = 'SELECT COUNT(*) as count FROM news';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE title LIKE ? OR content LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const [rows] = await this.db.execute(query, params);
    const result = (rows as any)[0] as { count: number };
    return result.count;
  }
}