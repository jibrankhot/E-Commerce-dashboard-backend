export interface Product {
    id: string;                 // UUID
    sku: string;
    name: string;
    slug: string;

    category: string;
    subcategory?: string | null;
    brand?: string | null;

    price: number;
    discount: number;
    quantity: number;

    thumbnail_url?: string | null;
    description?: string | null;

    featured: boolean;
    is_active: boolean;

    tags: string[];             // Postgres text[]
    created_at?: string;
}
