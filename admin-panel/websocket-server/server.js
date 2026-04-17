const WebSocket = require('ws');
const http = require('http');

// Store connected clients
const clients = new Map();
const channels = new Map();

// Create HTTP server (for health checks)
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      connections: clients.size,
      channels: Array.from(channels.keys())
    }));
    return;
  }
  res.writeHead(404);
  res.end();
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const clientId = generateClientId();
  const clientInfo = {
    id: clientId,
    ws: ws,
    channels: new Set(),
    connectedAt: new Date(),
    lastPing: Date.now()
  };
  
  clients.set(clientId, clientInfo);
  console.log(`🔌 Client connected: ${clientId} (Total: ${clients.size})`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    clientId: clientId,
    message: 'Connected to Fleish Real-time Sync',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(clientId, message);
    } catch (err) {
      console.error('Invalid message format:', err);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON format'
      }));
    }
  });

  ws.on('close', () => {
    const client = clients.get(clientId);
    if (client) {
      // Unsubscribe from all channels
      client.channels.forEach(channel => {
        const channelClients = channels.get(channel);
        if (channelClients) {
          channelClients.delete(clientId);
          if (channelClients.size === 0) {
            channels.delete(channel);
          }
        }
      });
    }
    clients.delete(clientId);
    console.log(`🔌 Client disconnected: ${clientId} (Total: ${clients.size})`);
  });

  ws.on('error', (err) => {
    console.error(`WebSocket error for client ${clientId}:`, err);
  });
});

function handleMessage(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;

  switch (message.type) {
    case 'ping':
      client.lastPing = Date.now();
      client.ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      break;

    case 'subscribe':
      if (Array.isArray(message.channels)) {
        message.channels.forEach(channel => {
          subscribeToChannel(clientId, channel);
        });
      }
      break;

    case 'unsubscribe':
      if (Array.isArray(message.channels)) {
        message.channels.forEach(channel => {
          unsubscribeFromChannel(clientId, channel);
        });
      }
      break;

    case 'publish':
      // Broadcast event to channel subscribers
      if (message.channel && message.event) {
        broadcast(message.channel, {
          type: message.event,
          data: message.data,
          timestamp: new Date().toISOString(),
          source: clientId
        });
      }
      break;

    // Order events
    case 'order.created':
    case 'order.updated':
    case 'order.cancelled':
      broadcast('orders', message);
      broadcast('admin', message);
      break;

    // Payment events
    case 'payment.received':
    case 'payment.refunded':
      broadcast('payments', message);
      broadcast('admin', message);
      break;

    // Vendor events
    case 'vendor.registered':
    case 'vendor.approved':
    case 'vendor.rejected':
      broadcast('vendors', message);
      broadcast('admin', message);
      break;

    // Delivery events
    case 'delivery.assigned':
    case 'delivery.completed':
    case 'delivery.failed':
      broadcast('delivery', message);
      broadcast('admin', message);
      break;

    // Subscription events
    case 'subscription.created':
    case 'subscription.cancelled':
    case 'subscription.renewed':
      broadcast('subscriptions', message);
      broadcast('admin', message);
      break;

    // Job events
    case 'job.application':
    case 'application.status':
      broadcast('jobs', message);
      broadcast('admin', message);
      break;

    // Testimonial events
    case 'testimonial.submitted':
    case 'testimonial.approved':
      broadcast('testimonials', message);
      broadcast('admin', message);
      break;

    // User events
    case 'user.registered':
    case 'user.updated':
      broadcast('users', message);
      broadcast('admin', message);
      break;

    default:
      // Echo back unknown message types
      client.ws.send(JSON.stringify({
        type: 'echo',
        original: message
      }));
  }
}

function subscribeToChannel(clientId, channel) {
  const client = clients.get(clientId);
  if (!client) return;

  // Add to channel
  if (!channels.has(channel)) {
    channels.set(channel, new Set());
  }
  channels.get(channel).add(clientId);
  client.channels.add(channel);

  console.log(`📡 ${clientId} subscribed to ${channel}`);
  
  client.ws.send(JSON.stringify({
    type: 'subscribed',
    channel: channel
  }));
}

function unsubscribeFromChannel(clientId, channel) {
  const client = clients.get(clientId);
  if (!client) return;

  const channelClients = channels.get(channel);
  if (channelClients) {
    channelClients.delete(clientId);
    if (channelClients.size === 0) {
      channels.delete(channel);
    }
  }
  client.channels.delete(channel);

  console.log(`📡 ${clientId} unsubscribed from ${channel}`);
}

function broadcast(channel, message) {
  const channelClients = channels.get(channel);
  if (!channelClients) return;

  const messageStr = JSON.stringify(message);
  
  channelClients.forEach(clientId => {
    const client = clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageStr);
    }
  });
}

function generateClientId() {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Cleanup inactive clients every 30 seconds
setInterval(() => {
  const now = Date.now();
  const timeout = 60000; // 60 seconds
  
  clients.forEach((client, clientId) => {
    if (now - client.lastPing > timeout) {
      console.log(`🧹 Cleaning up inactive client: ${clientId}`);
      client.ws.close();
    }
  });
}, 30000);

const PORT = process.env.WS_PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
});
