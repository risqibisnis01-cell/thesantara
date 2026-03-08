import type { APIRoute } from 'astro';
import { getDb, type Product } from '../../lib/db';

export const GET: APIRoute = ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');

    const db = getDb();
    let query = 'SELECT * FROM products';
    const params: any[] = [];

    if (category) {
        query += ' WHERE categoryId = ?';
        params.push(category);
    } else if (featured === 'true') {
        query += ' WHERE featured = 1';
    }

    try {
        const products = db.prepare(query).all(...params) as Product[];
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
            status: 500
        });
    }
};
