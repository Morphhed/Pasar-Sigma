/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// =============== INTERFACES & TYPES ===============
export interface User {
    name: string;
    nim: string;
    email: string;
    password: string;
    faculty: string;
    phone: string;
}

export interface Product {
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

export interface AppNotification {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export interface AppState {
    currentView: 'login' | 'register' | 'home' | 'profile' | 'productDetail';
    previousView: 'home' | 'profile' | null;
    isModalOpen: boolean;
    isLogoutModalOpen: boolean;
    isProfileMenuOpen: boolean;
    listings: Product[];
    filter: {
        query: string;
        faculty: string | null;
    };
    users: User[];
    currentUser: User | null;
    viewingProfileOf: User | null;
    viewingProduct: Product | null;
    notifications: AppNotification[];
    notificationMode: 'on' | 'muted' | 'off';
    isNotificationMenuOpen: boolean;
}

// =============== MOCK DATA & CONSTANTS ===============
export const faculties = ['FASILKOM', 'FISIP', 'FE', 'FT', 'FKIP', 'FMIPA', 'FK', 'FP', 'FH', 'FKM', 'Pascasarjana'];

// Raw data for initialization
const rawInitialListingsData = [
    {
        id: 1,
        title: 'Buku Kalkulus Lanjut Edisi 3 - Mulus',
        price: 150000,
        category: 'Buku',
        condition: 'Seperti Baru',
        imageUrl: 'https://picsum.photos/seed/kalkulus/400/300',
        seller: { name: 'Andi Pratama', faculty: 'FASILKOM', isVerified: true },
        description: 'Buku kalkulus edisi ketiga, kondisi sangat baik seperti baru, tidak ada coretan. Cocok untuk mahasiswa semester awal. Bonus sampul plastik.',
        dateListed: '2024-05-20',
    },
    {
        id: 2,
        title: 'Jasa Desain Grafis (Poster, Logo)',
        price: 200000,
        category: 'Jasa',
        condition: 'Baru',
        imageUrl: 'https://picsum.photos/seed/desain/400/300',
        seller: { name: 'Citra Lestari', faculty: 'FISIP', isVerified: true },
        description: 'Menerima jasa desain grafis untuk keperluan acara, tugas, atau bisnis. Pengerjaan cepat dan bisa revisi. Hubungi untuk portofolio.',
        dateListed: '2024-05-19',
    },
    {
        id: 3,
        title: 'Disewakan Kamar Kost Dekat Unsri Bukit',
        price: 800000,
        category: 'Kost',
        condition: 'Baru',
        imageUrl: 'https://picsum.photos/seed/kost/400/300',
        seller: { name: 'Budi Santoso', faculty: 'FE', isVerified: false },
        description: 'Kamar kost nyaman, fasilitas lengkap (AC, kamar mandi dalam, kasur, lemari). Lokasi strategis hanya 5 menit dari kampus Unsri Bukit Besar.',
        dateListed: '2024-05-18',
    },
    {
        id: 4,
        title: 'Mouse Gaming Logitech G102',
        price: 250000,
        category: 'Elektronik',
        condition: 'Bekas',
        imageUrl: 'https://picsum.photos/seed/mouse/400/300',
        seller: { name: 'Rina Wijaya', faculty: 'FT', isVerified: true },
        description: 'Mouse gaming second, pemakaian 6 bulan, kondisi 95% normal, klik empuk, RGB nyala. Alasan jual karena sudah upgrade.',
        dateListed: '2024-05-21',
    },
     {
        id: 5,
        title: 'Pempek Kapal Selam (Pre-Order)',
        price: 15000,
        category: 'Makanan',
        condition: 'Baru',
        imageUrl: 'https://picsum.photos/seed/pempek/400/300',
        seller: { name: 'Sari Murni', faculty: 'FKIP', isVerified: true },
        description: 'Open PO pempek kapal selam asli ikan tenggiri. Cuko kental dan pedas mantap. Dibuat setiap hari berdasarkan pesanan.',
        dateListed: '2024-05-22',
    },
    {
        id: 6,
        title: 'Modul Praktikum Kimia Dasar',
        price: 75000,
        category: 'Buku',
        condition: 'Bekas',
        imageUrl: 'https://picsum.photos/seed/kimia/400/300',
        seller: { name: 'Eko Nugroho', faculty: 'FMIPA', isVerified: true },
        description: 'Modul praktikum Kimia Dasar lengkap untuk 1 semester. Ada sedikit catatan tapi masih sangat layak pakai. Halaman lengkap.',
        dateListed: '2024-05-17',
    },
    {
        id: 7,
        title: 'Macbook Air M1 2020 Second Mulus',
        price: 11500000,
        category: 'Elektronik',
        condition: 'Seperti Baru',
        imageUrl: 'https://picsum.photos/seed/macbook/400/300',
        seller: { name: 'Andi Pratama', faculty: 'FASILKOM', isVerified: true },
        description: 'Macbook Air M1 2020 8/256GB Silver. Garansi habis. Fisik mulus 99% no dent. Cycle Count rendah. Fullset original.',
        dateListed: '2024-05-22',
    }
];

// Generate initial users from the raw listing data
const initialUsers: User[] = Array.from(new Set(rawInitialListingsData.map(p => p.seller.name)))
    .map((name, index) => {
        const sellerInfo = rawInitialListingsData.find(p => p.seller.name === name)!.seller;
        return {
            name: sellerInfo.name,
            faculty: sellerInfo.faculty,
            nim: `09011282328${String(index).padStart(3, '0')}`, // Mock NIM
            email: `${name.toLowerCase().replace(/\s/g, '')}@unsri.ac.id`,
            password: 'password123',
            phone: `6281234567${String(index).padStart(3, '0')}` // Mock Phone
        };
    });

// Generate initial listings with sellerId from the users created above
const initialListings: Product[] = rawInitialListingsData.map(listingData => {
    const seller = initialUsers.find(u => u.name === listingData.seller.name)!;
    // Fix: Explicitly cast category and condition to match the Product type.
    // TypeScript was inferring them as `string`, which is too wide for the specific literal types.
    return {
        ...listingData,
        category: listingData.category as Product['category'],
        condition: listingData.condition as Product['condition'],
        sellerId: seller.nim,
    };
});


// =============== DATA PERSISTENCE ===============
const USERS_STORAGE_KEY = 'pasarUnsriUsers';
const LISTINGS_STORAGE_KEY = 'pasarUnsriListings';

function saveToStorage<T>(key: string, data: T) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to save to localStorage key "${key}"`, e);
    }
}

function loadFromStorage<T>(key: string): T | null {
    try {
        const json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json) as T;
        }
        return null;
    } catch (e) {
        console.error(`Failed to load or parse from localStorage key "${key}"`, e);
        localStorage.removeItem(key); // Clear corrupted data
        return null;
    }
}

// Initialize users from storage, or use mock data and persist it.
const persistedUsers = loadFromStorage<User[]>(USERS_STORAGE_KEY);
const initialUsersData = persistedUsers || initialUsers;
if (!persistedUsers) {
    saveToStorage(USERS_STORAGE_KEY, initialUsersData);
}

// Initialize listings from storage, or use mock data and persist it.
const persistedListings = loadFromStorage<Product[]>(LISTINGS_STORAGE_KEY);
const initialListingsData = persistedListings || initialListings;
if (!persistedListings) {
    saveToStorage(LISTINGS_STORAGE_KEY, initialListingsData);
}

// =============== APP STATE ===============
export let state: AppState = {
    currentView: 'login',
    previousView: null,
    isModalOpen: false,
    isLogoutModalOpen: false,
    isProfileMenuOpen: false,
    listings: initialListingsData,
    filter: { query: '', faculty: null },
    users: initialUsersData,
    currentUser: null,
    viewingProfileOf: null,
    viewingProduct: null,
    notifications: [],
    notificationMode: 'on',
    isNotificationMenuOpen: false,
};

// =============== STATE MANAGEMENT ===============
let renderCallback: () => void = () => {};

export function subscribe(callback: () => void) {
    renderCallback = callback;
}

export function setState(newState: Partial<AppState>) {
    // If the users array is being updated, save it to localStorage.
    if (newState.users) {
        saveToStorage(USERS_STORAGE_KEY, newState.users);
    }
    // If the listings array is being updated, save it to localStorage.
    if (newState.listings) {
        saveToStorage(LISTINGS_STORAGE_KEY, newState.listings);
    }

    Object.assign(state, newState);
    renderCallback();
}

// =============== UTILITY FUNCTIONS ===============
export function findUserByName(name: string): User | undefined {
    return state.users.find(u => u.name === name);
}

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

export function showNotification(message: string, type: 'success' | 'error' = 'error', duration: number = 3000) {
    if (state.notificationMode === 'off') return;

    if (state.notificationMode === 'on') {
        const audio = document.getElementById('notification-sound') as HTMLAudioElement;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Error playing sound:", e));
        }
    }

    const id = Date.now();
    const newNotification: AppNotification = { id, message, type };
    
    setState({ notifications: [...state.notifications, newNotification] });

    setTimeout(() => {
        setState({
            notifications: state.notifications.filter(n => n.id !== id)
        });
    }, duration);
}

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: number;

    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
}


// =============== SHARED COMPONENT TEMPLATES ===============

export const NotificationToast = (notification: AppNotification): string => {
    const colors = {
        error: 'bg-red-500',
        success: 'bg-green-500'
    };
    const icons = {
        error: 'fa-exclamation-circle',
        success: 'fa-check-circle'
    }
    return `
        <div class="toast-enter flex items-center ${colors[notification.type]} text-white text-sm font-bold px-4 py-3 rounded-md shadow-lg" role="alert">
            <i class="fas ${icons[notification.type]} mr-2"></i>
            <p>${notification.message}</p>
        </div>
    `;
}

export const ProductCard = (product: Product): string => `
    <div data-product-id="${product.id}" class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer">
        <img src="${product.imageUrl}" alt="${product.title}" class="w-full h-40 object-cover pointer-events-none">
        <div class="p-4 flex-grow flex flex-col pointer-events-none">
            <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full self-start">${product.category}</span>
            <h3 class="font-semibold text-gray-800 mt-2 truncate flex-grow">${product.title}</h3>
            <p class="text-lg font-bold text-gray-900 mt-1">${formatRupiah(product.price)}</p>
            <div class="flex items-center mt-3 text-sm text-gray-600 pointer-events-auto">
                <a href="#" class="hover:underline" data-seller-name="${product.seller.name}">${product.seller.name}</a>
                ${product.seller.isVerified 
                    ? '<i class="fas fa-check-circle text-red-500 ml-1" title="Terverifikasi"></i>' 
                    : ''
                }
            </div>
            <div class="text-xs text-gray-500 mt-1 pointer-events-auto">
                 <a href="#" class="hover:underline" data-faculty="${product.seller.faculty}">${product.seller.faculty}</a>
            </div>
        </div>
    </div>
`;


export const ProductDetailView = (): string => {
    const product = state.viewingProduct;
    if (!product) return `<p>Produk tidak ditemukan.</p>`;

    const seller = findUserByName(product.seller.name);
    const whatsappLink = seller ? `https://wa.me/${seller.phone}?text=Halo, saya tertarik dengan produk '${product.title}' di Pasar UNSRI.` : '#';

    return `
    <div class="min-h-screen bg-gray-100">
        <!-- Header will be rendered by home.ts -->
        <main class="container mx-auto p-4">
            <button id="back-from-detail" class="mb-4 text-sm text-red-600 hover:underline"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="md:flex">
                    <div class="md:w-1/2">
                        <img src="${product.imageUrl}" alt="${product.title}" class="w-full h-64 md:h-full object-cover">
                    </div>
                    <div class="p-6 md:w-1/2 flex flex-col">
                        <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full self-start">${product.category}</span>
                        <h2 class="text-3xl font-bold text-gray-800 mt-2">${product.title}</h2>
                        <p class="text-2xl font-bold text-gray-900 mt-2 mb-4">${formatRupiah(product.price)}</p>
                        
                        <div class="flex items-center text-sm text-gray-600 mb-4 pointer-events-auto">
                            Dijual oleh 
                            <a href="#" class="font-semibold hover:underline ml-1" data-seller-name="${product.seller.name}">${product.seller.name}</a>
                            ${product.seller.isVerified ? '<i class="fas fa-check-circle text-red-500 ml-1" title="Terverifikasi"></i>' : ''}
                            <span class="mx-2">|</span>
                             <a href="#" class="hover:underline" data-faculty="${product.seller.faculty}">${product.seller.faculty}</a>
                        </div>
                        
                        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg text-center hover:bg-red-700 transition duration-300 flex items-center justify-center">
                            <i class="fab fa-whatsapp mr-2"></i>Hubungi Penjual
                        </a>

                        <div class="border-t my-4"></div>

                        <div class="space-y-2 text-sm text-gray-700">
                            <p><strong>Kondisi:</strong> ${product.condition}</p>
                            <p><strong>Tanggal Terbit:</strong> ${formatDate(product.dateListed)}</p>
                        </div>
                        
                        <div class="border-t my-4"></div>

                        <h3 class="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                        <p class="text-gray-600 text-sm whitespace-pre-wrap flex-grow">${product.description}</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `;
};


export const LogoutConfirmationModal = (): string => `
    <div id="logout-modal-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 modal-enter">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div id="logout-modal-content" class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center modal-content-enter">
                <i class="fas fa-question-circle text-5xl text-red-500 mb-4"></i>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Konfirmasi Keluar</h2>
                <p class="text-gray-600 mb-6">Apakah Anda yakin ingin keluar dari akun Anda?</p>
                <div class="flex justify-center space-x-4">
                    <button id="cancel-logout-button" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">Batal</button>
                    <button id="confirm-logout-button" class="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition">Ya, Keluar</button>
                </div>
            </div>
        </div>
    </div>
`;