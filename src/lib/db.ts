import Database from 'better-sqlite3';
import path from 'path';

// Define the path to the database file
const dbPath = path.resolve(process.cwd(), 'santara.db');

let dbInstance: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    // Use WAL mode for better concurrency
    dbInstance.pragma('journal_mode = WAL');
    
    // Initialize tables if they don't exist
    initDb(dbInstance);
  }
  return dbInstance;
}

function initDb(db: ReturnType<typeof Database>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      categoryId TEXT NOT NULL,
      notes TEXT,
      featured INTEGER DEFAULT 0,
      FOREIGN KEY(categoryId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(productId) REFERENCES products(id)
    );
  `);
}

// Helper types
export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  notes: string | null;
  featured: number; // 0 or 1
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}
