import { getDb } from './db.js';

const db = getDb();

const categories = [
    { id: 'floral', name: 'Bunga (Floral)', description: 'Segar, manis, dan mekar dengan nuansa alam.' },
    { id: 'woody', name: 'Kayu (Woody)', description: 'Mendalam, hangat, dan elegan.' },
    { id: 'fresh', name: 'Segar (Fresh)', description: 'Rennyah, bersih, dan membangkitkan semangat.' },
    { id: 'oriental', name: 'Timur (Oriental)', description: 'Kaya, eksotis, dan sensual.' }
];

const products = [
    {
        id: 'p1',
        name: 'Awan Berarak',
        description: 'Paduan lembut bunga putih dan vanila, sempurna untuk penggunaan sehari-hari.',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        categoryId: 'floral',
        notes: 'Melati, Lili Putih, Biji Vanila',
        featured: 1
    },
    {
        id: 'p2',
        name: 'Malam Kayu Aras',
        description: 'Aroma malam yang elegan dengan kayu aras yang kaya, amber, dan sentuhan rempah gelap.',
        price: 650000,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
        categoryId: 'woody',
        notes: 'Kayu Aras, Amber, Lada Hitam',
        featured: 1
    },
    {
        id: 'p3',
        name: 'Angin Samudra',
        description: 'Aroma yang membangkitkan semangat dan bersih, menangkap esensi laut.',
        price: 400000,
        image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=800',
        categoryId: 'fresh',
        notes: 'Garam Laut, Bergamot, Jeruk',
        featured: 0
    },
    {
        id: 'p4',
        name: 'Cahaya Amber',
        description: 'Parfum yang hangat dan mengundang dengan nuansa oriental yang kaya.',
        price: 550000,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
        categoryId: 'oriental',
        notes: 'Amber, Kayu Cendana, Kesturi',
        featured: 1
    },
    {
        id: 'p5',
        name: 'Buket Mawar',
        description: 'Aroma mawar klasik yang kaya dengan nuansa hijau modern.',
        price: 500000,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&grayscale=1',
        categoryId: 'floral',
        notes: 'Mawar Bulgaria, Daun Hijau, Peony',
        featured: 0
    },
    {
        id: 'p6',
        name: 'Pagi Musim Semi',
        description: 'Ringan, berangin, dan penuh keluhuran embun.',
        price: 380000,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
        categoryId: 'fresh',
        notes: 'Lily of the Valley, Tetes Embun, Lemon',
        featured: 1
    }
];

function seed() {
    console.log('Menghapus data yang ada...');
    db.exec('DELETE FROM cart_items');
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM categories');

    console.log('Memasukkan data kategori...');
    const insertCategory = db.prepare('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)');
    for (const cat of categories) {
        insertCategory.run(cat.id, cat.name, cat.description);
    }

    console.log('Memasukkan data produk...');
    const insertProduct = db.prepare('INSERT INTO products (id, name, description, price, image, categoryId, notes, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const prod of products) {
        insertProduct.run(prod.id, prod.name, prod.description, prod.price, prod.image, prod.categoryId, prod.notes, prod.featured);
    }

    console.log('Selesai!');

    const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    console.log(`Memverifikasi: ${count.count} produk ditambahkan.`);
}

seed();
