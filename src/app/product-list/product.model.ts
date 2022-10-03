export interface Product {
    title: string;
    price: number;
    image: string;
    rating: {
        rate: number,
        count: number
    }
    category: string;
    description: string;
    id: number;
}
