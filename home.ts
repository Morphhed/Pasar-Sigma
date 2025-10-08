/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, setState, showNotification, formatRupiah, debounce, ProductCard, findUserByName } from './shared';
import type { Product } from './shared';

// =============== LOCAL STATE FOR MODAL ===============
// Using a local variable to manage image files for the modal form
// to avoid cluttering the global state.
let uploadedImages: { file: File, dataUrl: string }[] = [];

// =============== COMPONENT TEMPLATES ===============

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
                        ${state.notificationMode === option.mode ? '<i class="fas fa-check text-red-500 ml-auto"></i>' : ''}
                    </a>
                `).join('')}
            </div>
        </div>
    `;
};

const ProfileMenu = (): string => `
    <div id="profile-menu" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
        <div class="py-1" role="menu" aria-orientation="vertical">
            <a href="#" id="view-profile-btn" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                <i class="fas fa-user-circle w-5 mr-3 text-gray-500"></i>
                <span>Cek Profil</span>
            </a>
            <a href="#" id="logout-btn" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                 <i class="fas fa-sign-out-alt w-5 mr-3 text-gray-500"></i>
                <span>Logout</span>
            </a>
        </div>
    </div>
`;

const HomeHeader = (): string => {
    const getNotificationIcon = () => {
        switch(state.notificationMode) {
            case 'on': return 'fa-bell';
            case 'muted': return 'fa-bell-slash';
            case 'off': return 'fa-bell-slash';
            default: return 'fa-bell';
        }
    };
    return `
        <header class="bg-white shadow-md sticky top-0 z-10">
            <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 class="text-2xl font-bold text-yellow-500 cursor-pointer" id="home-logo">Pasar UNSRI</h1>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <i id="notification-bell-icon" class="fas ${getNotificationIcon()} text-gray-600 text-xl hover:text-yellow-500 cursor-pointer ${state.notificationMode === 'off' ? 'text-gray-400' : ''}" title="Pengaturan Notifikasi"></i>
                        ${state.isNotificationMenuOpen ? NotificationMenu() : ''}
                    </div>
                    <div class="relative">
                        <div id="user-profile-menu-toggle" class="flex items-center space-x-2 cursor-pointer group">
                            <span class="font-semibold text-gray-700 group-hover:text-yellow-500">${state.currentUser?.name}</span>
                            <i class="fas fa-chevron-down text-xs text-gray-600 group-hover:text-yellow-500 transition-transform ${state.isProfileMenuOpen ? 'rotate-180' : ''}"></i>
                        </div>
                        ${state.isProfileMenuOpen ? ProfileMenu() : ''}
                    </div>
                </div>
            </div>
            ${state.currentView !== 'productDetail' ? `
            <div class="container mx-auto px-4 pb-3">
                 <div class="relative">
                    <input id="search-input" type="text" placeholder="Cari buku, jasa, atau kost..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" value="${state.filter.query}">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>
            ` : ''}
        </header>
    `;
}

export const HomeView = (): string => {
    const filteredListings = state.listings
        .filter(p => p.title.toLowerCase().includes(state.filter.query.toLowerCase()))
        .filter(p => state.filter.faculty ? p.seller.faculty === state.filter.faculty : true);

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
                        <label class="block text-sm font-medium text-gray-700">Kategori</label>
                        <select name="category" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500">
                            <option>Buku</option>
                            <option>Elektronik</option>
                            <option>Jasa</option>
                            <option>Kost</option>
                            <option>Makanan</option>
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
    setState({ isLogoutModalOpen: true, isProfileMenuOpen: false });
}

function handleConfirmLogout() {
    setState({ 
        currentUser: null, 
        currentView: 'login', 
        isLogoutModalOpen: false 
    });
}

function handleCancelLogout() {
    setState({ isLogoutModalOpen: false });
}

function handleOpenModal() {
    setState({ isModalOpen: true });
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

    if (uploadedImages.length === 0) {
        showNotification('Silakan upload minimal satu foto produk.');
        return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const newListing: Product = {
        id: Date.now(),
        sellerId: state.currentUser.nim,
        title: formData.get('title') as string,
        price: Number(formData.get('price')),
        category: formData.get('category') as 'Buku' | 'Elektronik' | 'Jasa' | 'Kost' | 'Makanan',
        condition: formData.get('condition') as 'Baru' | 'Seperti Baru' | 'Bekas',
        imageUrl: uploadedImages[0].dataUrl, // Use the first uploaded image
        seller: { name: state.currentUser.name, faculty: state.currentUser.faculty, isVerified: state.currentUser.isVerified },
        description: formData.get('description') as string,
        dateListed: new Date().toISOString().split('T')[0],
    };
    
    setState({ listings: [newListing, ...state.listings], isModalOpen: false });
    uploadedImages = []; // Clear images after successful submission
}

function handleToggleNotificationMenu() {
    setState({ isNotificationMenuOpen: !state.isNotificationMenuOpen, isProfileMenuOpen: false });
}

function handleChangeNotificationMode(event: Event) {
    event.preventDefault();
    const target = (event.currentTarget as HTMLElement);
    const mode = target.dataset.mode as 'on' | 'muted' | 'off';
    if (mode) {
        setState({ notificationMode: mode, isNotificationMenuOpen: false });
    }
}

function handleToggleProfileMenu() {
    setState({ isProfileMenuOpen: !state.isProfileMenuOpen, isNotificationMenuOpen: false });
}

function handleViewOwnProfile() {
    setState({ currentView: 'profile', viewingProfileOf: state.currentUser, isProfileMenuOpen: false });
}

function handleGoBackHome() {
    setState({ currentView: 'home', viewingProfileOf: null, filter: { ...state.filter, faculty: null } });
}

function handleGoBackFromDetail() {
    setState({ currentView: state.previousView || 'home', viewingProduct: null, previousView: null });
}

function handleProductGridClick(event: Event) {
    const target = event.target as HTMLElement;

    const sellerName = target.closest<HTMLElement>('[data-seller-name]')?.dataset.sellerName;
    const faculty = target.closest<HTMLElement>('[data-faculty]')?.dataset.faculty;

    if (sellerName) {
        event.preventDefault();
        const user = findUserByName(sellerName);
        if (user) {
            setState({ currentView: 'profile', viewingProfileOf: user });
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

    const productCard = target.closest<HTMLElement>('[data-product-id]');
    if (productCard) {
        const productId = Number(productCard.dataset.productId);
        const product = state.listings.find(p => p.id === productId);
        if (product) {
            setState({ 
                currentView: 'productDetail', 
                viewingProduct: product,
                previousView: state.currentView as 'home' | 'profile'
            });
        }
    }
}

function handleClearFacultyFilter() {
    setState({ filter: { ...state.filter, faculty: null } });
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
    document.getElementById('user-profile-menu-toggle')?.addEventListener('click', handleToggleProfileMenu);

    // Page-specific listeners
    document.getElementById('search-input')?.addEventListener('input', handleSearch);
    document.getElementById('product-grid')?.addEventListener('click', handleProductGridClick);
    document.getElementById('sell-button')?.addEventListener('click', handleOpenModal);
    document.getElementById('clear-faculty-filter')?.addEventListener('click', handleClearFacultyFilter);

    // Detail page listeners
    document.getElementById('back-from-detail')?.addEventListener('click', handleGoBackFromDetail);
    document.querySelector('[data-seller-name]')?.addEventListener('click', handleProductGridClick);
    document.querySelector('[data-faculty]')?.addEventListener('click', handleProductGridClick);
    
    // Menu listeners
    if (state.isNotificationMenuOpen) {
        document.querySelectorAll('#notification-menu a').forEach(item => {
            item.addEventListener('click', handleChangeNotificationMode);
        });
    }
    if (state.isProfileMenuOpen) {
        document.getElementById('view-profile-btn')?.addEventListener('click', handleViewOwnProfile);
        document.getElementById('logout-btn')?.addEventListener('click', handleOpenLogoutModal);
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
}