import type { APIRoute } from 'astro';
import { getDb, type CartItemWithProduct, type Product, type CartItem } from '../../lib/db';
import { randomUUID } from 'crypto';

export const GET: APIRoute = () => {
    const db = getDb();

    try {
        const items = db.prepare(`
      SELECT c.id, c.productId, c.quantity, 
             p.name, p.price, p.image, p.categoryId, p.description, p.notes, p.featured
      FROM cart_items c
      JOIN products p ON c.productId = p.id
    `).all() as any[];

        // Format response to match CartItemWithProduct
        const formattedItems = items.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            product: {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                categoryId: item.categoryId,
                description: item.description,
                notes: item.notes,
                featured: item.featured
            }
        }));

        return new Response(JSON.stringify({ items: formattedItems }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request }) => {
    const db = getDb();

    try {
        const body = await request.json();
        const { productId, quantity = 1 } = body;

        if (!productId) {
            return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
        }

        // Check if product exists
        const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }

        // Check if item already in cart
        const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE productId = ?').get(productId) as CartItem | undefined;

        if (existing) {
            db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
        } else {
            const id = randomUUID();
            db.prepare('INSERT INTO cart_items (id, productId, quantity) VALUES (?, ?, ?)').run(id, productId, quantity);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to add to cart' }), { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ request }) => {
    const db = getDb();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: 'Cart item ID is required' }), { status: 400 });
    }

    try {
        db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to remove from cart' }), { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request }) => {
    const db = getDb();

    try {
        const body = await request.json();
        const { id, quantity } = body;

        if (!id || quantity === undefined) {
            return new Response(JSON.stringify({ error: 'Cart item ID and quantity required' }), { status: 400 });
        }

        if (quantity <= 0) {
            db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
        } else {
            db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, id);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to update cart' }), { status: 500 });
    }
}
