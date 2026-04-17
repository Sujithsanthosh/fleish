import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * API Route for On-Demand Revalidation
 * Allows admin panel to trigger website page revalidation when content changes
 */

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');
    const secret = searchParams.get('secret') || process.env.REVALIDATION_SECRET;

    // Verify secret for security
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret', revalidated: false },
        { status: 401 }
      );
    }

    // Revalidate by path
    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
      
      // Also broadcast to website to refresh
      broadcastToWebsite({ type: 'revalidate', path });
      
      return NextResponse.json({ 
        revalidated: true, 
        path,
        message: `Path ${path} revalidated successfully` 
      });
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
      
      broadcastToWebsite({ type: 'revalidate', tag });
      
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        message: `Tag ${tag} revalidated successfully` 
      });
    }

    return NextResponse.json(
      { message: 'Missing path or tag parameter', revalidated: false },
      { status: 400 }
    );
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', revalidated: false },
      { status: 500 }
    );
  }
}

/**
 * Broadcast revalidation event to website
 */
function broadcastToWebsite(data: { type: string; path?: string; tag?: string }) {
  // This would typically send to a WebSocket or webhook
  // For now, we log it
  console.log('📡 Broadcasting to website:', data);
}

// Also handle GET requests for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({
      message: 'Revalidation API - Use POST with path or tag parameter',
      usage: '/api/revalidate?path=/products',
    });
  }

  // For testing, allow GET with bypass in dev mode
  if (process.env.NODE_ENV === 'development') {
    try {
      revalidatePath(path);
      return NextResponse.json({ 
        revalidated: true, 
        path,
        message: 'DEV MODE: Revalidation successful' 
      });
    } catch (err) {
      return NextResponse.json({ revalidated: false, error: String(err) });
    }
  }

  return NextResponse.json(
    { message: 'Use POST method for revalidation', revalidated: false },
    { status: 405 }
  );
}
