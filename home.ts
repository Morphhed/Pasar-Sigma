/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, setState, showNotification, formatRupiah, debounce, ProductCard, findUserByName, navigateTo, categories } from './shared';
import type { Product } from './shared';

// =============== LOCAL STATE FOR MODALS ===============
// Using local variables to manage image files for modal forms
// to avoid cluttering the global state.
let uploadedImages: { file: File, dataUrl: string }[] = [];
let editingImage: { file: File, dataUrl: string } | null = null;


// =============== COMPONENT TEMPLATES ===============

export const FilterModal = (): string => {
    const conditions: ('Baru' | 'Seperti Baru' | 'Bekas')[] = ['Baru', 'Seperti Baru', 'Bekas'];

    return `
    <div id="filter-modal-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 modal-enter">
        <div class="flex items-center justify-center min-h-screen p-4">
            <form id="filter-form" class="bg-white rounded-lg shadow-xl w-full max-w-md relative modal-content-enter flex flex-col max-h-[90vh]">
                <div class="flex-shrink-0 p-6 border-b flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Filter Pencarian</h2>
                    <button type="button" id="close-filter-modal-button" class="text-gray-500 hover:text-gray-800">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="overflow-y-auto p-6 space-y-6">
                    <!-- Lokasi -->
                    <div>
                        <label class="block text-lg font-semibold text-gray-700 mb-3">Lokasi</label>
                        <div class="flex items-center space-x-6">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="location" value="Kampus Indralaya" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300" ${state.filter.location === 'Kampus Indralaya' ? 'checked' : ''}>
                                <span class="ml-2 text-sm text-gray-700">Kampus Indralaya</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="location" value="Kampus Bukit" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300" ${state.filter.location === 'Kampus Bukit' ? 'checked' : ''}>
                                <span class="ml-2 text-sm text-gray-700">Kampus Bukit</span>
                            </label>
                        </div>
                    </div>
                    <!-- Kategori -->
                    <div>
                        <label for="filter-category" class="block text-lg font-semibold text-gray-700 mb-3">Kategori</label>
                        <select id="filter-category" name="category" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500">
                            <option value="">Semua Kategori</option>
                            ${categories.map(cat => `<option value="${cat}" ${state.filter.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                        </select>
                    </div>
                    <!-- Kondisi -->
                    <div>
                        <label class="block text-lg font-semibold text-gray-700 mb-3">Kondisi Barang</label>
                        <div class="space-y-2">
                        ${conditions.map(condition => `
                            <label class="flex items-center cursor-pointer">
                                <input type="checkbox" name="condition" value="${condition}" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded" ${state.filter.conditions.includes(condition) ? 'checked' : ''}>
                                <span class="ml-3 text-sm text-gray-700">${condition}</span>
                            </label>
                        `).join('')}
                        </div>
                    </div>
                    <!-- Jangkauan Harga -->
                    <div>
                         <label class="block text-lg font-semibold text-gray-700 mb-3">Jangkauan Harga (Rp)</label>
                         <div class="flex items-center space-x-2">
                            <input type="number" name="minPrice" placeholder="Harga Minimum" class="w-full p-2 border border-gray-300 rounded-md" value="${state.filter.minPrice || ''}" min="0">
                            <span class="text-gray-500">-</span>
                            <input type="number" name="maxPrice" placeholder="Harga Maksimum" class="w-full p-2 border border-gray-300 rounded-md" value="${state.filter.maxPrice || ''}" min="0">
                         </div>
                    </div>
                </div>
                <div class="flex-shrink-0 p-6 flex justify-between items-center bg-gray-50 border-t">
                    <button type="button" id="reset-filters-button" class="text-gray-600 font-bold py-2 px-6 rounded-lg hover:underline">Hapus Semua Filter</button>
                    <button type="submit" class="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400">Terapkan</button>
                </div>
            </form>
        </div>
    </div>
    `;
};

const NotificationMenu = (): string => {
    const options = [
        { mode: 'on', icon: 'fa-bell', text: 'Hidupkan Notifikasi' },
        { mode: 'muted', icon: 'fa-bell-slash', text: 'Heningkan Notifikasi' },
        { mode: 'off', icon: 'fa-ban', text: 'Matikan Notifikasi' },
    ];
    return `
        <div id="notification-menu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div class="py-1" role="menu" aria-orientation="vertical">
                ${options.map(option => `
                    <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${state.notificationMode === option.mode ? 'bg-gray-100 font-semibold' : ''}" role="menuitem" data-mode="${option.mode}">
                        <i class="fas ${option.icon} w-5 mr-3 text-gray-500"></i>
                        <span>${option.text}</span>
                        ${state.notificationMode === option.mode ? '<i class="fas fa-check text-green-500 ml-auto"></i>' : ''}
                    </a>
                `).join('')}
            </div>
        </div>
    `;
};

const HomeHeader = (): string => {
    const getNotificationIcon = () => {
        switch(state.notificationMode) {
            case 'on': return 'fa-bell';
            case 'muted': return 'fa-bell-slash';
            case 'off': return 'fa-bell-slash';
            default: return 'fa-bell';
        }
    };
    const activeFilterCount =
        (state.filter.location ? 1 : 0) +
        state.filter.conditions.length +
        (state.filter.minPrice ? 1 : 0) +
        (state.filter.maxPrice ? 1 : 0) +
        (state.filter.faculty ? 1 : 0) +
        (state.filter.category ? 1 : 0);

    return `
        <header class="bg-white shadow-md sticky top-0 z-10">
            <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 class="text-4xl font-bold text-yellow-500 cursor-pointer" id="home-logo">Pasar <span class="text-gray-800">UNSRI</span></h1>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <button id="notification-bell-icon" class="text-gray-600 text-xl hover:text-yellow-500 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${state.notificationMode === 'off' ? 'text-gray-400' : ''}" title="Pengaturan Notifikasi">
                            <i class="fas ${getNotificationIcon()}"></i>
                        </button>
                        ${state.isNotificationMenuOpen ? NotificationMenu() : ''}
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <span class="font-semibold text-gray-700 hidden sm:block">${state.currentUser?.name}</span>
                        ${state.currentUser?.isAdmin ? '<i class="fas fa-user-shield text-green-500" title="Super Admin"></i>' : ''}
                        
                        <button id="view-profile-btn" class="text-gray-600 text-xl hover:text-yellow-500 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="${state.currentUser?.isAdmin ? 'Panel Admin' : 'Cek Profil'}">
                            <i class="fas fa-user-circle"></i>
                        </button>

                        <button id="logout-btn" class="text-gray-600 text-xl hover:text-red-500 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="container mx-auto px-4 pb-3 border-t border-gray-200 pt-3">
                 <div class="flex items-center space-x-2">
                    <div class="relative flex-grow">
                        <input id="search-input" type="text" placeholder="Cari buku, jasa, atau kost..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" value="${state.filter.query}">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <button id="open-filter-modal-button" class="relative flex-shrink-0 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition">
                        <i class="fas fa-filter mr-2"></i>
                        <span>Filter</span>
                        ${activeFilterCount > 0 ? `<span class="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">${activeFilterCount}</span>` : ''}
                    </button>
                </div>
            </div>
        </header>
    `;
}

export const HomeView = (): string => {
    const { query, faculty, location, conditions, minPrice, maxPrice, category } = state.filter;
    const filteredListings = state.listings
        .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        .filter(p => faculty ? p.seller.faculty === faculty : true)
        .filter(p => location ? p.location === location : true)
        .filter(p => category ? p.category === category : true)
        .filter(p => conditions.length > 0 ? conditions.includes(p.condition) : true)
        .filter(p => minPrice !== null ? p.price >= minPrice : true)
        .filter(p => maxPrice !== null ? p.price <= maxPrice : true);


    return `
    <div class="min-h-screen bg-gray-100">
        ${HomeHeader()}
        <main class="container mx-auto p-4">
            ${state.filter.faculty ? `
                <div class="flex justify-between items-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg mb-4">
                    <span>Menampilkan produk dari <strong>${state.filter.faculty}</strong></span>
                    <button id="clear-faculty-filter" class="font-bold hover:underline">Hapus Filter &times;</button>
                </div>
            ` : ''}
            
            ${state.filter.location ? `
                <div class="flex justify-between items-center bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg mb-4">
                    <span>Menampilkan produk dari area <strong>${state.filter.location}</strong></span>
                    <button id="clear-location-filter" class="font-bold hover:underline">Hapus Filter &times;</button>
                </div>
            ` : ''}
            
            ${state.filter.category ? `
                <div class="flex justify-between items-center bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg mb-4">
                    <span>Menampilkan produk dari kategori <strong>${state.filter.category}</strong></span>
                    <button id="clear-category-filter" class="font-bold hover:underline">Hapus Filter &times;</button>
                </div>
            ` : ''}

            <div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                ${filteredListings.length > 0 ? filteredListings.map(ProductCard).join('') : `<p class="col-span-full text-center text-gray-500 mt-8">Tidak ada produk yang ditemukan.</p>`}
            </div>
        </main>
        
        <button id="sell-button" class="fixed bottom-6 right-6 bg-yellow-500 text-gray-900 font-bold rounded-full h-16 w-16 flex items-center justify-center shadow-lg text-2xl hover:bg-yellow-400 transition">
            <i class="fas fa-plus"></i>
        </button>
    </div>
`;
}


export const CreateListingModal = (): string => `
    <div id="modal-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 modal-enter">
        <div class="flex items-center justify-center min-h-screen p-4">
            <form id="create-listing-form" class="bg-white rounded-lg shadow-xl w-full max-w-lg relative modal-content-enter flex flex-col max-h-[90vh]">
                <div class="flex-shrink-0 p-6 border-b flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Buat Listing Baru</h2>
                    <button type="button" id="close-modal-button" class="text-gray-500 hover:text-gray-800">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="overflow-y-auto p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Judul (maks 120 karakter)</label>
                        <input type="text" name="title" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required maxlength="120">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Lokasi Penjual</label>
                        <p class="text-xs text-gray-500">Pilih lokasi utama Anda (Indralaya atau Bukit)</p>
                        <div class="mt-2 flex items-center space-x-6">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="location" value="Kampus Indralaya" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300" required>
                                <span class="ml-2 text-sm text-gray-700">Kampus Indralaya</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="location" value="Kampus Bukit" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300" required>
                                <span class="ml-2 text-sm text-gray-700">Kampus Bukit</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Kategori</label>
                        <select name="category" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500">
                            <option>Buku</option>
                            <option>Elektronik</option>
                            <option>Jasa</option>
                            <option>Kost</option>
                            <option>Makanan</option>
                            <option>Miscellanious</option>
                            <option>Barang Hobi</option>
                            <option>kendaraan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                        <input type="number" name="price" placeholder="Contoh: 150000" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required min="1">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Kondisi</label>
                        <div class="mt-2 flex items-center space-x-6">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="condition" value="Baru" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300" checked>
                                <span class="ml-2 text-sm text-gray-700">Baru</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="condition" value="Seperti Baru" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300">
                                <span class="ml-2 text-sm text-gray-700">Seperti Baru</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="condition" value="Bekas" class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300">
                                <span class="ml-2 text-sm text-gray-700">Bekas</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea name="description" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required minlength="30"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Upload Foto (min 1, max 8)</label>
                         <div id="image-drop-zone" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-yellow-400 transition-colors">
                            <div class="space-y-1 text-center">
                                <i class="fas fa-image text-4xl text-gray-400"></i>
                                <p class="text-sm text-gray-600">Drag & drop atau klik untuk upload</p>
                            </div>
                        </div>
                        <input type="file" id="image-upload-input" multiple accept="image/*" class="hidden">
                        <div id="image-preview-container" class="mt-4 grid grid-cols-4 gap-4"></div>
                    </div>
                </div>
                <div class="flex-shrink-0 p-6 flex justify-end space-x-3 bg-gray-50 border-t">
                    <button type="button" id="cancel-modal-button" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Batal</button>
                    <button type="submit" class="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400">Terbitkan</button>
                </div>
            </form>
        </div>
    </div>
`;


// =============== EVENT HANDLERS ===============
function handleOpenLogoutModal() {
    setState({ isLogoutModalOpen: true });
}

function handleConfirmLogout() {
    setState({ isLogoutModalOpen: false });
    navigateTo('login', { currentUser: null });
}

function handleCancelLogout() {
    setState({ isLogoutModalOpen: false });
}

function handleOpenModal() {
    if (state.currentUser && !state.currentUser.isVerified) {
        showNotification('Akun Anda belum terverifikasi. Silakan verifikasi di halaman profil untuk mulai menjual.', 'error');
        navigateTo('profile', { viewingProfileOf: state.currentUser });
    } else {
        setState({ isModalOpen: true });
    }
}

function handleCloseModal() {
    uploadedImages = []; // Clear images when modal is closed
    setState({ isModalOpen: false });
}

const debouncedSearch = debounce((query: string) => {
    setState({ filter: { ...state.filter, query } });
}, 300);

function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    debouncedSearch(target.value);
}

function handleCreateListing(event: Event) {
    event.preventDefault();
    if (!state.currentUser) {
        showNotification('Anda harus login untuk membuat listing.');
        return;
    }
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (uploadedImages.length === 0) {
        showNotification('Silakan upload minimal satu foto produk.');
        return;
    }
    
    if (!formData.get('location')) {
        showNotification('Silakan pilih lokasi penjual.');
        return;
    }

    const newListing: Product = {
        id: Date.now(),
        sellerId: state.currentUser.nim,
        title: formData.get('title') as string,
        location: formData.get('location') as 'Kampus Indralaya' | 'Kampus Bukit',
        price: Number(formData.get('price')),
        category: formData.get('category') as 'Buku' | 'Elektronik' | 'Jasa' | 'Kost' | 'Makanan' | 'Miscellanious' | 'Barang Hobi' | 'kendaraan',
        condition: formData.get('condition') as 'Baru' | 'Seperti Baru' | 'Bekas',
        imageUrl: uploadedImages[0].dataUrl, // Use the first uploaded image
        seller: { name: state.currentUser.name, faculty: state.currentUser.faculty, isVerified: state.currentUser.isVerified },
        description: formData.get('description') as string,
        dateListed: new Date().toISOString().split('T')[0],
        isFlagged: false,
    };
    
    setState({ listings: [newListing, ...state.listings], isModalOpen: false });
    uploadedImages = []; // Clear images after successful submission
}

function handleToggleNotificationMenu() {
    setState({ isNotificationMenuOpen: !state.isNotificationMenuOpen });
}

function handleChangeNotificationMode(event: Event) {
    event.preventDefault();
    const target = (event.currentTarget as HTMLElement);
    const mode = target.dataset.mode as 'on' | 'muted' | 'off';
    if (mode) {
        setState({ notificationMode: mode, isNotificationMenuOpen: false });
    }
}

function handleViewOwnProfile() {
    navigateTo('profile', { viewingProfileOf: state.currentUser });
}

function handleGoBackHome() {
    navigateTo('home', { viewingProfileOf: null, filter: { query: '', faculty: null, location: null, conditions: [], minPrice: null, maxPrice: null, category: null } });
}

function handleGoBackFromDetail() {
    navigateTo(state.previousView || 'home', { viewingProduct: null, previousView: null });
}

// ----- FILTER MODAL HANDLERS -----

function handleOpenFilterModal() {
    setState({ isFilterModalOpen: true });
}

function handleCloseFilterModal() {
    setState({ isFilterModalOpen: false });
}

function handleApplyFilters(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const location = formData.get('location') as 'Kampus Indralaya' | 'Kampus Bukit' | null;
    const category = formData.get('category') as string | null;
    const conditions = formData.getAll('condition') as ('Baru' | 'Seperti Baru' | 'Bekas')[];
    const minPrice = formData.get('minPrice') ? Number(formData.get('minPrice')) : null;
    const maxPrice = formData.get('maxPrice') ? Number(formData.get('maxPrice')) : null;

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
        showNotification('Harga minimum tidak boleh lebih besar dari harga maksimum.');
        return;
    }

    setState({
        filter: {
            ...state.filter,
            location,
            conditions,
            minPrice,
            maxPrice,
            category: category === '' ? null : category,
        },
        isFilterModalOpen: false,
    });
}

function handleResetFilters() {
    setState({
        filter: {
            query: state.filter.query, // Keep the search query
            faculty: null,
            location: null,
            conditions: [],
            minPrice: null,
            maxPrice: null,
            category: null,
        },
        isFilterModalOpen: false,
    });
}


// ----- USER & ADMIN ACTION HANDLERS -----

function handleOpenDeleteModal(productId: number) {
    setState({ isDeleteConfirmationOpen: true, deletingProductId: productId });
}

function handleConfirmDelete() {
    if (state.deletingProductId === null) return;
    const updatedListings = state.listings.filter(p => p.id !== state.deletingProductId);
    setState({ 
        listings: updatedListings, 
        isDeleteConfirmationOpen: false, 
        deletingProductId: null 
    });
    showNotification('Listing berhasil dihapus.', 'success');

    // If deleting from detail view, navigate back
    if (state.currentView === 'productDetail') {
        navigateTo('home');
    }
}

function handleCancelDelete() {
    setState({ isDeleteConfirmationOpen: false, deletingProductId: null });
}

function handleToggleFlag(productId: number) {
    const updatedListings = state.listings.map(p => {
        if (p.id === productId) {
            return { ...p, isFlagged: !p.isFlagged };
        }
        return p;
    });
    setState({ listings: updatedListings });
    const product = state.listings.find(p => p.id === productId);
    showNotification(`Listing ${product?.isFlagged ? 'ditandai' : 'tidak ditandai'}.`, 'success');
}

function handleOpenEditModal(productId: number) {
    const product = state.listings.find(p => p.id === productId);
    if (product) {
        setState({ isEditModalOpen: true, editingProduct: product });
    }
}

function handleCloseEditModal() {
    editingImage = null;
    setState({ isEditModalOpen: false, editingProduct: null });
}

function handleEditTriggerImageUpload() {
    document.getElementById('edit-image-upload-input')?.click();
}

function handleEditImageSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            showNotification(`File yang dipilih bukan gambar.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            editingImage = { file, dataUrl };
            
            const previewEl = document.getElementById('edit-image-preview') as HTMLImageElement;
            if (previewEl) {
                previewEl.src = dataUrl;
            }
        };
        reader.readAsDataURL(file);
    }
}

function handleUpdateListing(event: Event) {
    event.preventDefault();
    if (!state.editingProduct) return;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedProduct: Product = {
        ...state.editingProduct,
        title: formData.get('title') as string,
        price: Number(formData.get('price')),
        description: formData.get('description') as string,
        imageUrl: editingImage ? editingImage.dataUrl : state.editingProduct.imageUrl,
        location: formData.get('location') as 'Kampus Indralaya' | 'Kampus Bukit',
    };

    const updatedListings = state.listings.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    
    editingImage = null;

    setState({
        listings: updatedListings,
        isEditModalOpen: false,
        editingProduct: null,
        viewingProduct: state.currentView === 'productDetail' ? updatedProduct : state.viewingProduct,
    });
    showNotification('Listing berhasil diperbarui.', 'success');
}


function handleProductGridClick(event: Event) {
    const target = event.target as HTMLElement;

    // Admin buttons
    const adminEditBtn = target.closest<HTMLElement>('[data-admin-edit-id]');
    if (adminEditBtn) {
        event.preventDefault();
        event.stopPropagation();
        const productId = Number(adminEditBtn.dataset.adminEditId);
        handleOpenEditModal(productId);
        return;
    }
    const flagBtn = target.closest<HTMLElement>('[data-admin-flag-id]');
    if (flagBtn) {
        event.preventDefault();
        event.stopPropagation();
        const productId = Number(flagBtn.dataset.adminFlagId);
        handleToggleFlag(productId);
        return;
    }
    const adminDeleteBtn = target.closest<HTMLElement>('[data-admin-delete-id]');
    if (adminDeleteBtn) {
        event.preventDefault();
        event.stopPropagation();
        const productId = Number(adminDeleteBtn.dataset.adminDeleteId);
        handleOpenDeleteModal(productId);
        return;
    }

    // User (owner) buttons
    const userEditBtn = target.closest<HTMLElement>('[data-user-edit-id]');
    if (userEditBtn) {
        event.preventDefault();
        event.stopPropagation();
        const productId = Number(userEditBtn.dataset.userEditId);
        handleOpenEditModal(productId);
        return;
    }
    const userDeleteBtn = target.closest<HTMLElement>('[data-user-delete-id]');
    if (userDeleteBtn) {
        event.preventDefault();
        event.stopPropagation();
        const productId = Number(userDeleteBtn.dataset.userDeleteId);
        handleOpenDeleteModal(productId);
        return;
    }


    // Regular user actions
    const sellerName = target.closest<HTMLElement>('[data-seller-name]')?.dataset.sellerName;
    const faculty = target.closest<HTMLElement>('[data-faculty]')?.dataset.faculty;
    const category = target.closest<HTMLElement>('[data-category]')?.dataset.category;

    if (sellerName) {
        event.preventDefault();
        const user = findUserByName(sellerName);
        if (user) {
            navigateTo('profile', { viewingProfileOf: user });
        } else {
            showNotification(`Profil untuk ${sellerName} tidak ditemukan.`);
        }
        return;
    }
    
    if (faculty) {
        event.preventDefault();
        setState({ filter: { ...state.filter, faculty }});
        return;
    }
    
    if (category) {
        event.preventDefault();
        setState({ filter: { ...state.filter, category }});
        return;
    }

    const productCard = target.closest<HTMLElement>('[data-product-id]');
    if (productCard) {
        const productId = Number(productCard.dataset.productId);
        const product = state.listings.find(p => p.id === productId);
        if (product) {
            navigateTo('productDetail', { 
                viewingProduct: product,
                previousView: state.currentView as 'home' | 'profile'
            });
        }
    }
}

function handleClearFacultyFilter() {
    setState({ filter: { ...state.filter, faculty: null } });
}

function handleClearLocationFilter() {
     setState({ filter: { ...state.filter, location: null } });
}

function handleClearCategoryFilter() {
    setState({ filter: { ...state.filter, category: null } });
}


// ----- IMAGE UPLOAD HANDLERS -----

function renderImagePreviews() {
    const container = document.getElementById('image-preview-container');
    if (!container) return;
    container.innerHTML = uploadedImages.map((img, index) => `
        <div class="relative group">
            <img src="${img.dataUrl}" alt="Preview ${index + 1}" class="w-full h-24 object-cover rounded-md">
            <button data-index="${index}" class="remove-image-btn absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
        </div>
    `).join('');
}

function processFiles(files: FileList) {
    const MAX_FILES = 8;
    const availableSlots = MAX_FILES - uploadedImages.length;
    if (files.length > availableSlots) {
        showNotification(`Anda hanya bisa mengupload ${availableSlots} foto lagi.`);
    }

    Array.from(files).slice(0, availableSlots).forEach(file => {
        if (!file.type.startsWith('image/')) {
            showNotification(`File '${file.name}' bukan gambar dan akan dilewati.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push({ file, dataUrl: e.target?.result as string });
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

function handleImageSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        processFiles(input.files);
    }
}

function handleImageDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.getElementById('image-drop-zone');
    dropZone?.classList.remove('border-yellow-400', 'border-solid');
    dropZone?.classList.add('border-gray-300', 'border-dashed');

    if (event.dataTransfer?.files) {
        processFiles(event.dataTransfer.files);
    }
}

function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.getElementById('image-drop-zone');
    dropZone?.classList.add('border-yellow-400', 'border-solid');
    dropZone?.classList.remove('border-gray-300', 'border-dashed');
}

function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.getElementById('image-drop-zone');
    dropZone?.classList.remove('border-yellow-400', 'border-solid');
    dropZone?.classList.add('border-gray-300', 'border-dashed');
}

function handleRemoveImage(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('.remove-image-btn');
    if (button) {
        const index = parseInt(button.getAttribute('data-index')!, 10);
        uploadedImages.splice(index, 1);
        renderImagePreviews();
    }
}


// =============== EVENT ATTACHMENT ===============
export function attachHomeEventListeners() {
    // Header listeners
    document.getElementById('home-logo')?.addEventListener('click', handleGoBackHome);
    document.getElementById('notification-bell-icon')?.addEventListener('click', handleToggleNotificationMenu);
    document.getElementById('open-filter-modal-button')?.addEventListener('click', handleOpenFilterModal);
    document.getElementById('view-profile-btn')?.addEventListener('click', handleViewOwnProfile);
    document.getElementById('logout-btn')?.addEventListener('click', handleOpenLogoutModal);

    // Page-specific listeners
    document.getElementById('search-input')?.addEventListener('input', handleSearch);
    document.getElementById('product-grid')?.addEventListener('click', handleProductGridClick);
    // Use querySelector for product detail admin buttons as the grid is not always present
    document.querySelector('.container')?.addEventListener('click', handleProductGridClick);
    document.getElementById('sell-button')?.addEventListener('click', handleOpenModal);
    document.getElementById('clear-faculty-filter')?.addEventListener('click', handleClearFacultyFilter);
    document.getElementById('clear-location-filter')?.addEventListener('click', handleClearLocationFilter);
    document.getElementById('clear-category-filter')?.addEventListener('click', handleClearCategoryFilter);

    // Detail page listeners
    document.getElementById('back-from-detail')?.addEventListener('click', handleGoBackFromDetail);
    
    // Menu listeners
    if (state.isNotificationMenuOpen) {
        document.querySelectorAll('#notification-menu a').forEach(item => {
            item.addEventListener('click', handleChangeNotificationMode);
        });
    }

    // Modal listeners
    if (state.isModalOpen) {
        document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-backdrop')) handleCloseModal();
        });
        document.getElementById('close-modal-button')?.addEventListener('click', handleCloseModal);
        document.getElementById('cancel-modal-button')?.addEventListener('click', handleCloseModal);
        document.getElementById('create-listing-form')?.addEventListener('submit', handleCreateListing);

        // Image upload listeners
        const dropZone = document.getElementById('image-drop-zone');
        const fileInput = document.getElementById('image-upload-input');
        const previewContainer = document.getElementById('image-preview-container');

        dropZone?.addEventListener('click', () => fileInput?.click());
        fileInput?.addEventListener('change', handleImageSelection);
        
        dropZone?.addEventListener('dragover', handleDragOver);
        dropZone?.addEventListener('dragleave', handleDragLeave);
        dropZone?.addEventListener('drop', handleImageDrop);

        previewContainer?.addEventListener('click', handleRemoveImage);
    }
    if (state.isLogoutModalOpen) {
        document.getElementById('logout-modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('logout-modal-backdrop')) handleCancelLogout();
        });
        document.getElementById('cancel-logout-button')?.addEventListener('click', handleCancelLogout);
        document.getElementById('confirm-logout-button')?.addEventListener('click', handleConfirmLogout);
    }
    if (state.isFilterModalOpen) {
        document.getElementById('filter-modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('filter-modal-backdrop')) handleCloseFilterModal();
        });
        document.getElementById('close-filter-modal-button')?.addEventListener('click', handleCloseFilterModal);
        document.getElementById('filter-form')?.addEventListener('submit', handleApplyFilters);
        document.getElementById('reset-filters-button')?.addEventListener('click', handleResetFilters);
    }
    if (state.isDeleteConfirmationOpen) {
        document.getElementById('delete-modal-backdrop')?.addEventListener('click', (e) => {
             if (e.target === document.getElementById('delete-modal-backdrop')) handleCancelDelete();
        });
        document.getElementById('cancel-delete-button')?.addEventListener('click', handleCancelDelete);
        document.getElementById('confirm-delete-button')?.addEventListener('click', handleConfirmDelete);
    }
    if (state.isEditModalOpen) {
        document.getElementById('edit-modal-backdrop')?.addEventListener('click', (e) => {
             if (e.target === document.getElementById('edit-modal-backdrop')) handleCloseEditModal();
        });
        document.getElementById('close-edit-modal-button')?.addEventListener('click', handleCloseEditModal);
        document.getElementById('cancel-edit-modal-button')?.addEventListener('click', handleCloseEditModal);
        document.getElementById('edit-listing-form')?.addEventListener('submit', handleUpdateListing);
        document.getElementById('change-image-button')?.addEventListener('click', handleEditTriggerImageUpload);
        document.getElementById('edit-image-upload-input')?.addEventListener('change', handleEditImageSelection);
    }
}