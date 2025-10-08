/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

// NOTE: Interfaces and initial data are duplicated here to make the serverless function self-contained.
// This avoids complex build configurations for sharing code between frontend and backend.
interface User {
    name: string;
    nim: string;
    email: string;
    password: string;
    faculty: string;
    phone: string;
}

interface Product {
    id: number;
    sellerId: string;
    title: string;
    price: number;
    category: 'Buku' | 'Elektronik' | 'Jasa' | 'Kost' | 'Makanan';
    condition: 'Baru' | 'Seperti Baru' | 'Bekas';
    imageUrl: string;
    seller: {
        name: string;
        faculty: string;
        isVerified: boolean;
    };
    description: string;
    dateListed: string;
}

// Raw data for initialization if the database is empty
const rawInitialListingsData = [
    {
        id: 1, title: 'Buku Kalkulus Lanjut Edisi 3 - Mulus', price: 150000, category: 'Buku', condition: 'Seperti Baru', imageUrl: 'https://picsum.photos/seed/kalkulus/400/300', seller: { name: 'Andi Pratama', faculty: 'FASILKOM', isVerified: true }, description: 'Buku kalkulus edisi ketiga, kondisi sangat baik seperti baru, tidak ada coretan. Cocok untuk mahasiswa semester awal. Bonus sampul plastik.', dateListed: '2024-05-20',
    },
    {
        id: 2, title: 'Jasa Desain Grafis (Poster, Logo)', price: 200000, category: 'Jasa', condition: 'Baru', imageUrl: 'https://picsum.photos/seed/desain/400/300', seller: { name: 'Citra Lestari', faculty: 'FISIP', isVerified: true }, description: 'Menerima jasa desain grafis untuk keperluan acara, tugas, atau bisnis. Pengerjaan cepat dan bisa revisi. Hubungi untuk portofolio.', dateListed: '2024-05-19',
    },
    {
        id: 3, title: 'Disewakan Kamar Kost Dekat Unsri Bukit', price: 800000, category: 'Kost', condition: 'Baru', imageUrl: 'https://picsum.photos/seed/kost/400/300', seller: { name: 'Budi Santoso', faculty: 'FE', isVerified: false }, description: 'Kamar kost nyaman, fasilitas lengkap (AC, kamar mandi dalam, kasur, lemari). Lokasi strategis hanya 5 menit dari kampus Unsri Bukit Besar.', dateListed: '2024-05-18',
    }
];

const initialUsers: User[] = Array.from(new Set(rawInitialListingsData.map(p => p.seller.name)))
    .map((name, index) => {
        const sellerInfo = rawInitialListingsData.find(p => p.seller.name === name)!.seller;
        return {
            name: sellerInfo.name, faculty: sellerInfo.faculty, nim: `09011282328${String(index).padStart(3, '0')}`, email: `${name.toLowerCase().replace(/\s/g, '')}@unsri.ac.id`, password: 'password123', phone: `6281234567${String(index).padStart(3, '0')}`
        };
    });

const initialListings: Product[] = rawInitialListingsData.map(listingData => {
    const seller = initialUsers.find(u => u.name === listingData.seller.name)!;
    return {
        ...listingData, category: listingData.category as Product['category'], condition: listingData.condition as Product['condition'], sellerId: seller.nim,
    };
});

const initialDbState = {
    users: initialUsers,
    listings: initialListings
};

const DATABASE_KEY = 'pasardb_v1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            let data = await kv.get(DATABASE_KEY);
            if (!data) {
                // If DB is empty, initialize it with mock data
                await kv.set(DATABASE_KEY, initialDbState);
                data = initialDbState;
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching data from Vercel KV.', error: (error as Error).message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const dataToSave = req.body;
            if (!dataToSave || !dataToSave.users || !dataToSave.listings) {
                return res.status(400).json({ message: 'Invalid data format.' });
            }
            await kv.set(DATABASE_KEY, dataToSave);
            return res.status(200).json({ message: 'Data saved successfully.' });
        } catch (error) {
            return res.status(500).json({ message: 'Error saving data to Vercel KV.', error: (error as Error).message });
        }
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}