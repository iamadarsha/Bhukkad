import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('kitchen:join', ({ outletId }) => {
      socket.join(`kitchen:${outletId}`);
      console.log(`Socket ${socket.id} joined kitchen:${outletId}`);
    });

    socket.on('pos:join', ({ outletId }) => {
      socket.join(`outlet:${outletId}`);
      console.log(`Socket ${socket.id} joined outlet:${outletId}`);
    });

    socket.on('table:select', ({ tableId }) => {
      socket.join(`table:${tableId}`);
      console.log(`Socket ${socket.id} selected table:${tableId}`);
    });

    socket.on('kot:markStatus', ({ kotId, status, outletId }) => {
      io.to(`kitchen:${outletId}`).to(`outlet:${outletId}`).emit('kot:updated', { kotId, status, updatedAt: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  // Make io accessible to API routes if needed (e.g., via global object)
  (global as any).io = io;

  server.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
