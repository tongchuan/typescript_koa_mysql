import Router from 'koa-router';
import { Context, Next } from 'koa';
import { NewsModel } from '../models/News';

const router = new Router({ prefix: '/api/news' });

// Initialize the model
NewsModel.init();

// Get all news
router.get('/', async (ctx) => {
  try {
    const page = parseInt(ctx.query.page as string) || 1;
    const limit = parseInt(ctx.query.limit as string) || 10;
    const search = ctx.query.search ? ctx.query.search as string : '';
    
    const news = await NewsModel.findAll(page, limit, search);
    const total = await NewsModel.count(search);
    const totalPages = Math.ceil(total / limit);
    
    ctx.body = {
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Get single news item
router.get('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const news = await NewsModel.findById(id);
    
    if (news) {
      ctx.body = news;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'News item not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Create news item
router.post('/', async (ctx) => {
  try {
    const { title, content, category_id } = (ctx.request as any).body as {
      title: string;
      content: string;
      category_id?: number;
    };
    
    if (!title || !content) {
      ctx.status = 400;
      ctx.body = { error: 'Title and content are required' };
      return;
    }
    
    const newNews = await NewsModel.create({
      title,
      content,
      category_id: category_id || null
    });
    
    ctx.status = 201;
    ctx.body = newNews;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Update news item
router.put('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const { title, content, category_id } = (ctx.request as any).body as {
      title?: string;
      content?: string;
      category_id?: number;
    };
    
    const updatedNews = await NewsModel.update(id, {
      title,
      content,
      category_id: category_id || null
    });
    
    if (updatedNews) {
      ctx.body = updatedNews;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'News item not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Delete news item
router.delete('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    await NewsModel.delete(id);
    ctx.status = 204;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Batch delete news items
router.delete('/', async (ctx) => {
  try {
    const { ids } = (ctx.request as any).body as { ids: number[] };
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      ctx.status = 400;
      ctx.body = { error: 'Ids array is required and cannot be empty' };
      return;
    }
    
    await NewsModel.deleteMany(ids);
    ctx.status = 204;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

export default router;