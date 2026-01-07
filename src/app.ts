import Koa, { Context, Next } from 'koa';
import serve from 'koa-static';
import path from 'path';
import fs from 'fs';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { connectDB } from './config/database';
import newsRoutes from './routes/news';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import messageRoutes from './routes/messages';

const app = new Koa();
const port = process.env.PORT || 8080;
const router = new Router();

// Connect to database
connectDB();

// Serve static files from public directory
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyParser());
// Register all routes with the main router
router.use(newsRoutes.routes());
router.use(productRoutes.routes());
router.use(categoryRoutes.routes());
router.use(messageRoutes.routes());

// Custom routing for index.html and resources
router.get('/', async (ctx) => {
  const indexPath = path.join(__dirname, '../index.html');
  if (fs.existsSync(indexPath)) {
    ctx.type = 'text/html';
    ctx.body = fs.readFileSync(indexPath, 'utf8');
  } else {
    ctx.status = 404;
    ctx.body = 'File not found';
  }
});

// router.get('/resources/*', async (ctx) => {
//   const resourcePath = path.join(__dirname, '../resources', ctx.path.substring(11));
//   if (fs.existsSync(resourcePath) && !fs.statSync(resourcePath).isDirectory()) {
//     ctx.body = fs.createReadStream(resourcePath);
//   } else {
//     ctx.status = 404;
//     ctx.body = 'Resource not found';
//   }
// });

// Apply the router middleware to the app
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});