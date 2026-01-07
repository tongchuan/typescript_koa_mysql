import Router from 'koa-router';
import { Context, Next } from 'koa';
import { ProductModel } from '../models/Product';

const router = new Router({ prefix: '/api/products' });

// Initialize the model
ProductModel.init();

// Get all products
router.get('/', async (ctx, next) => {
  try {
    const page = parseInt(ctx.query.page as string) || 1;
    const limit = parseInt(ctx.query.limit as string) || 10;
    const search = ctx.query.search ? ctx.query.search as string : '';
    
    const products = await ProductModel.findAll(page, limit, search);
    
    // Count total products (simplified for this example)
    const total = products.length; // In a real app, you'd have a separate count method
    const totalPages = Math.ceil(total / limit);
    
    ctx.body = {
      data: products,
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

// Get single product
router.get('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    const product = await ProductModel.findById(id);
    
    if (product) {
      ctx.body = product;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Product not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Create product
router.post('/', async (ctx, next) => {
  try {
    const { name, description, price, stock_quantity } = (ctx as any).request.body as {
      name: string;
      description: string;
      price: number;
      stock_quantity: number;
    };
    
    if (!name || price === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'Name and price are required' };
      return;
    }
    
    const newProduct = await ProductModel.create({
      name,
      description: description || '',
      price,
      stock_quantity: stock_quantity || 0
    });
    
    ctx.status = 201;
    ctx.body = newProduct;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Update product
router.put('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    const { name, description, price, stock_quantity } = (ctx as any).request.body as {
      name?: string;
      description?: string;
      price?: number;
      stock_quantity?: number;
    };
    
    const updatedProduct = await ProductModel.update(id, {
      name,
      description,
      price,
      stock_quantity
    });
    
    if (updatedProduct) {
      ctx.body = updatedProduct;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Product not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Delete product
router.delete('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    await ProductModel.delete(id);
    ctx.status = 204;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

export default router;