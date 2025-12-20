export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    categoryId?: string;
    status: 'ACTIVE' | 'INACTIVE';
    images: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
