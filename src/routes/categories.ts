import Router from 'koa-router';
import { Context, Next } from 'koa';
import { CategoryModel } from '../models/Category';

const router = new Router({ prefix: '/api/categories' });

// Initialize the model
CategoryModel.init();

// Get all categories
router.get('/', async (ctx, next) => {
  try {
    const page = parseInt(ctx.query.page as string) || 1;
    const limit = parseInt(ctx.query.limit as string) || 10;
    const search = ctx.query.search ? ctx.query.search as string : '';
    // console.log(page, limit, search);
    const categories = await CategoryModel.findAll(page, limit, search);
    // console.log(categories);
    // Count total categories (simplified for this example)
    const total = categories.length; // In a real app, you'd have a separate count method
    const totalPages = Math.ceil(total / limit);
    
    ctx.body = {
      data: categories,
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

// Get single category
router.get('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    const category = await CategoryModel.findById(id);
    
    if (category) {
      ctx.body = category;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Category not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Create category
router.post('/', async (ctx, next) => {
  try {
    const { name, description } = (ctx as any).request.body as {
      name: string;
      description: string;
    };
    
    if (!name) {
      ctx.status = 400;
      ctx.body = { error: 'Name is required' };
      return;
    }
    
    const newCategory = await CategoryModel.create({
      name,
      description: description || ''
    });
    
    ctx.status = 201;
    ctx.body = newCategory;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Update category
router.put('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    const { name, description } = (ctx as any).request.body as {
      name?: string;
      description?: string;
    };
    
    const updatedCategory = await CategoryModel.update(id, {
      name,
      description
    });
    
    if (updatedCategory) {
      ctx.body = updatedCategory;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Category not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Delete category
router.delete('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    await CategoryModel.delete(id);
    ctx.status = 204;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

export default router;