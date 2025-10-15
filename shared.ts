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
    isVerified: boolean;
    isAdmin?: boolean;
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
    isFlagged?: boolean;
    location: 'Kampus Indralaya' | 'Kampus Bukit';
}

export interface AppNotification {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export interface AppState {
    isLoading: boolean;
    currentView: 'login' | 'register' | 'home' | 'profile' | 'productDetail';
    previousView: 'home' | 'profile' | null;
    isModalOpen: boolean;
    isLogoutModalOpen: boolean;
    isVerificationModalOpen: boolean;
    isProfileMenuOpen: boolean;
    isEditModalOpen: boolean;
    editingProduct: Product | null;
    isDeleteConfirmationOpen: boolean;
    deletingProductId: number | null;
    listings: Product[];
    filter: {
        query: string;
        faculty: string | null;
        location: 'Kampus Indralaya' | 'Kampus Bukit' | null;
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
// This initial data is now primarily used for fallback or local testing.
// The canonical source of truth is the Vercel KV store, managed by `/api/data`.
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
        location: 'Kampus Bukit',
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
        location: 'Kampus Bukit',
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
        location: 'Kampus Bukit',
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
        location: 'Kampus Indralaya',
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
        location: 'Kampus Indralaya',
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
        location: 'Kampus Indralaya',
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
        location: 'Kampus Bukit',
    }
];

const initialUsers: User[] = Array.from(new Set(rawInitialListingsData.map(p => p.seller.name)))
    .map((name, index) => {
        const sellerInfo = rawInitialListingsData.find(p => p.seller.name === name)!.seller;
        return {
            name: sellerInfo.name,
            faculty: sellerInfo.faculty,
            nim: `09011282328${String(index).padStart(3, '0')}`,
            email: `${name.toLowerCase().replace(/\s/g, '')}@unsri.ac.id`,
            password: 'password123',
            phone: `6281234567${String(index).padStart(3, '0')}`,
            isVerified: sellerInfo.isVerified,
            isAdmin: false,
        };
    });

const initialListings: Product[] = rawInitialListingsData.map(listingData => {
    const seller = initialUsers.find(u => u.name === listingData.seller.name)!;
    return {
        ...listingData,
        category: listingData.category as Product['category'],
        condition: listingData.condition as Product['condition'],
        location: listingData.location as Product['location'],
        sellerId: seller.nim,
        isFlagged: false,
    };
});


// =============== REMOTE DATA PERSISTENCE VIA SERVERLESS FUNCTION ===============
const API_URL = '/api/data'; // Points to the Vercel Serverless Function

async function saveDataToRemote(data: { users: User[], listings: Product[] }) {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save data');
        }
        console.log('Data saved successfully via API.');
    } catch (error) {
        console.error('Error saving data to remote:', error);
        showNotification('Gagal menyimpan data ke server.', 'error');
    }
}

// Debounce the save function to avoid excessive API calls
const debouncedSave = debounce(saveDataToRemote, 1000);

export async function initializeApp() {
    setState({ isLoading: true });
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
        }
        const data = await response.json();
        setState({
            users: data.users || initialUsers,
            listings: data.listings || initialListings,
            isLoading: false
        });
        console.log('Data loaded successfully from API.');
    } catch (error) {
        console.error('Could not initialize app with remote data:', error);
        showNotification('Gagal memuat data. Bekerja dalam mode offline.', 'error');
        // Fallback to local mock data if API fails
        setState({ users: initialUsers, listings: initialListings, isLoading: false });
    }
}


// =============== APP STATE ===============
export let state: AppState = {
    isLoading: true,
    currentView: 'login',
    previousView: null,
    isModalOpen: false,
    isLogoutModalOpen: false,
    isVerificationModalOpen: false,
    isProfileMenuOpen: false,
    isEditModalOpen: false,
    editingProduct: null,
    isDeleteConfirmationOpen: false,
    deletingProductId: null,
    listings: [],
    filter: { query: '', faculty: null, location: null },
    users: [],
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
    const shouldSave = newState.users || newState.listings;
    
    Object.assign(state, newState);

    // If users or listings data has changed, save the entire dataset to the remote bin.
    if (shouldSave) {
        // We pass the fully updated state to ensure the debounced function has the latest data.
        debouncedSave({ users: state.users, listings: state.listings });
    }

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
            const isLoginOrRegisterError = type === 'error' && (state.currentView === 'login' || state.currentView === 'register');
            // The request is to make it "10x louder". Setting loud volume to max (1.0)
            // and normal volume to 0.1 to create a significant difference.
            audio.volume = isLoginOrRegisterError ? 1.0 : 0.1;
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

export const ProductCard = (product: Product): string => {
    const isAdmin = state.currentUser?.isAdmin;
    const isFlagged = product.isFlagged;

    return `
    <div data-product-id="${product.id}" class="relative bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer ${isFlagged ? 'ring-2 ring-red-500' : ''}">
        ${isFlagged ? `<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center"><i class="fas fa-flag mr-1.5"></i>Di-flag</div>` : ''}
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
            <div class="text-xs text-gray-500 mt-2 flex items-center pointer-events-none">
                <i class="fas fa-map-marker-alt mr-1.5 text-gray-400"></i>
                <span class="font-medium">${product.location}</span>
            </div>
        </div>
        ${isAdmin ? `
            <div class="flex-shrink-0 bg-gray-50 p-2 flex justify-around items-center border-t">
                <button data-admin-edit-id="${product.id}" class="text-sm text-blue-600 hover:text-blue-800 transition" title="Edit Listing"><i class="fas fa-edit mr-1"></i>Edit</button>
                <button data-admin-flag-id="${product.id}" class="text-sm ${isFlagged ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-600 hover:text-gray-900'} transition" title="${isFlagged ? 'Un-flag Listing' : 'Flag Listing'}"><i class="fas fa-flag mr-1"></i>${isFlagged ? 'Un-flag' : 'Flag'}</button>
                <button data-admin-delete-id="${product.id}" class="text-sm text-red-600 hover:text-red-800 transition" title="Hapus Listing"><i class="fas fa-trash mr-1"></i>Hapus</button>
            </div>
        ` : ''}
    </div>
    `;
};


export const ProductDetailView = (): string => {
    const product = state.viewingProduct;
    if (!product) return `<p>Produk tidak ditemukan.</p>`;

    const seller = findUserByName(product.seller.name);
    const whatsappLink = seller ? `https://wa.me/${seller.phone}?text=Halo, saya tertarik dengan produk '${product.title}' di Pasar UNSRI.` : '#';
    const isAdmin = state.currentUser?.isAdmin;
    const isFlagged = product.isFlagged;

    return `
    <div class="min-h-screen bg-gray-100">
        <!-- Header will be rendered by home.ts -->
        <main class="container mx-auto p-4">
            <button id="back-from-detail" class="mb-4 text-sm text-red-600 hover:underline"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
            
            ${isFlagged ? `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4" role="alert">
                <div class="flex">
                    <div class="py-1"><i class="fas fa-flag fa-lg mr-4"></i></div>
                    <div>
                        <p class="font-bold">Listing Ini Di-flag</p>
                        <p class="text-sm">Listing ini sedang dalam peninjauan oleh administrator.</p>
                    </div>
                </div>
            </div>
            ` : ''}

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
                            <p><strong>Lokasi:</strong> ${product.location}</p>
                        </div>
                        
                        <div class="border-t my-4"></div>

                        <h3 class="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                        <p class="text-gray-600 text-sm whitespace-pre-wrap flex-grow">${product.description}</p>

                        ${isAdmin ? `
                        <div class="border-t mt-auto pt-4">
                            <h4 class="font-bold text-gray-700 mb-2">Panel Admin</h4>
                             <div class="flex justify-start space-x-3">
                                <button data-admin-edit-id="${product.id}" class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm"><i class="fas fa-edit mr-2"></i>Edit</button>
                                <button data-admin-flag-id="${product.id}" class="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition text-sm"><i class="fas fa-flag mr-2"></i>${isFlagged ? 'Un-flag' : 'Flag'}</button>
                                <button data-admin-delete-id="${product.id}" class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition text-sm"><i class="fas fa-trash mr-2"></i>Hapus</button>
                            </div>
                        </div>
                        ` : ''}
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

export const AdminDeleteConfirmationModal = (): string => `
    <div id="admin-delete-modal-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 modal-enter">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div id="admin-delete-modal-content" class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center modal-content-enter">
                <i class="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Konfirmasi Hapus</h2>
                <p class="text-gray-600 mb-6">Anda akan menghapus listing ini secara permanen. Tindakan ini tidak dapat diurungkan.</p>
                <div class="flex justify-center space-x-4">
                    <button id="cancel-admin-delete-button" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">Batal</button>
                    <button id="confirm-admin-delete-button" class="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition">Ya, Hapus</button>
                </div>
            </div>
        </div>
    </div>
`;

export const AdminEditModal = (): string => {
    const product = state.editingProduct;
    if (!product) return '';
    return `
    <div id="edit-modal-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 modal-enter">
        <div class="flex items-center justify-center min-h-screen p-4">
            <form id="admin-edit-listing-form" class="bg-white rounded-lg shadow-xl w-full max-w-lg relative modal-content-enter flex flex-col max-h-[90vh]">
                <div class="flex-shrink-0 p-6 border-b flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Edit Listing (Admin)</h2>
                    <button type="button" id="close-edit-modal-button" class="text-gray-500 hover:text-gray-800">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="overflow-y-auto p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Judul</label>
                        <input type="text" name="title" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" value="${product.title}" required maxlength="120">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Lokasi</label>
                         <select name="location" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
                            <option value="Kampus Indralaya" ${product.location === 'Kampus Indralaya' ? 'selected' : ''}>Kampus Indralaya</option>
                            <option value="Kampus Bukit" ${product.location === 'Kampus Bukit' ? 'selected' : ''}>Kampus Bukit</option>
                        </select>
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                        <input type="number" name="price" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" value="${product.price}" required min="1">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea name="description" rows="6" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required minlength="30">${product.description}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Gambar Produk</label>
                        <div class="mt-1 relative group">
                            <img id="admin-edit-image-preview" src="${product.imageUrl}" alt="Product image preview" class="w-full h-48 object-cover rounded-md bg-gray-100">
                            <button type="button" id="admin-change-image-button" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-md cursor-pointer">
                                <i class="fas fa-camera mr-2"></i> Ganti Gambar
                            </button>
                            <input type="file" id="admin-image-upload-input" accept="image/*" class="hidden">
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0 p-6 flex justify-end space-x-3 bg-gray-50 border-t">
                    <button type="button" id="cancel-edit-modal-button" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Batal</button>
                    <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    </div>
    `;
};