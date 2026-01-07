import Router from 'koa-router';
import { Context, Next } from 'koa';
import { MessageModel } from '../models/Message';

const router = new Router({ prefix: '/api/messages' });

// Initialize the model
MessageModel.init();

// Get all messages
router.get('/', async (ctx, next) => {
  try {
    const page = parseInt(ctx.query.page as string) || 1;
    const limit = parseInt(ctx.query.limit as string) || 10;
    const status = ctx.query.status ? ctx.query.status as string : '';
    
    const messages = await MessageModel.findAll(page, limit, status);
    
    // Count total messages (simplified for this example)
    const total = messages.length; // In a real app, you'd have a separate count method
    const totalPages = Math.ceil(total / limit);
    
    ctx.body = {
      data: messages,
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

// Get single message
router.get('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    const message = await MessageModel.findById(id);
    
    if (message) {
      ctx.body = message;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Message not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Create message
router.post('/', async (ctx, next) => {
  try {
    const { name, email, content } = (ctx as any).request.body as {
      name: string;
      email: string;
      content: string;
    };
    
    if (!name || !content) {
      ctx.status = 400;
      ctx.body = { error: 'Name and content are required' };
      return;
    }
    
    const newMessage = await MessageModel.create({
      name,
      email: email || '',
      content
    });
    
    ctx.status = 201;
    ctx.body = newMessage;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Update message
router.put('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    const { status } = (ctx as any).request.body as {
      status?: 'pending' | 'read' | 'archived';
    };
    
    const updatedMessage = await MessageModel.update(id, {
      status
    });
    
    if (updatedMessage) {
      ctx.body = updatedMessage;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Message not found' };
    }
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// Delete message
router.delete('/:id', async (ctx, next) => {
  try {
    const id = parseInt(ctx.params.id);
    await MessageModel.delete(id);
    ctx.status = 204;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

export default router;