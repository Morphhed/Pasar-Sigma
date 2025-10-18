/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, setState, ProductCard, showNotification, navigateTo } from './shared';
// HomeHeader is rendered via HomeView's call in index.tsx
// which adds the header. attachHomeEventListeners handles header events.

// =============== COMPONENT TEMPLATES ===============

export const VerificationModal = (): string => `
    <div id="verification-modal-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-40 modal-enter">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div id="verification-modal-content" class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center modal-content-enter">
                <form id="verification-form">
                    <i class="fas fa-user-check text-5xl text-yellow-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Verifikasi Akun Penjual</h2>
                    <p class="text-gray-600 mb-6">Untuk menjadi Penjual Terverifikasi, masukkan kembali email kampus Anda (@unsri.ac.id) untuk konfirmasi.</p>
                    <div class="mb-4">
                        <input type="email" name="verificationEmail" placeholder="Email Kampus (@unsri.ac.id)" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" required>
                    </div>
                    <div class="flex justify-center space-x-4">
                        <button type="button" id="cancel-verification-button" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">Batal</button>
                        <button type="submit" class="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition">Verifikasi</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

const ProfileDisplayView = (user: any, isOwnProfile: boolean): string => `
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div>
            <h2 class="text-3xl font-bold text-gray-800">${user.name}</h2>
            <p class="text-gray-600">${user.faculty}</p>
            <p class="text-sm text-gray-500 mt-1">${user.email}</p>
            <p class="text-sm text-gray-500">${user.phone}</p>
            ${user.isVerified ? `
                <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2">
                    <i class="fas fa-check-circle mr-1"></i>
                    Penjual Terverifikasi
                </span>
            ` : `
                <span class="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2">
                    <i class="fas fa-times-circle mr-1"></i>
                    Belum Terverifikasi
                </span>
            `}
        </div>
        <div>
        ${(isOwnProfile && !user.isVerified) ? `
            <button id="open-verification-modal" class="mt-4 sm:mt-0 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition text-sm">
                <i class="fas fa-user-check mr-2"></i>Verifikasi Akun
            </button>
        ` : ''}
        ${isOwnProfile ? `
             <button id="edit-profile-btn" class="mt-4 sm:mt-0 sm:ml-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm">
                <i class="fas fa-pencil-alt mr-2"></i>Edit Profil
            </button>
        ` : ''}
        </div>
    </div>
`;

const ProfileEditView = (user: any): string => `
    <form id="edit-profile-form">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Edit Profil</h2>
        <div class="space-y-4">
            <div>
                <label for="edit-name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="edit-name" name="name" value="${user.name}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
            </div>
             <div>
                <label for="edit-phone" class="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                <input type="tel" id="edit-phone" name="phone" value="${user.phone}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <i class="fas fa-info-circle mr-2 text-gray-400"></i>
                <span>NIM, Email, dan Fakultas tidak dapat diubah.</span>
            </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
            <button type="button" id="cancel-edit-btn" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Batal</button>
            <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
        </div>
    </form>
`;


export const ProfileView = (): string => {
    const user = state.viewingProfileOf;
    if (!user) return `<p>Pengguna tidak ditemukan.</p>`;

    const { query, location, conditions, minPrice, maxPrice } = state.filter;

    const userProducts = state.listings
        .filter(p => p.sellerId === user.nim)
        // Apply global filters to the user's products
        .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        .filter(p => location ? p.location === location : true)
        .filter(p => conditions.length > 0 ? conditions.includes(p.condition) : true)
        .filter(p => minPrice !== null ? p.price >= minPrice : true)
        .filter(p => maxPrice !== null ? p.price <= maxPrice : true);

    const isOwnProfile = state.currentUser?.nim === user.nim;
    
    return `
    <div class="min-h-screen bg-gray-100">
        <!-- Header is rendered by HomeView -->
        <main class="container mx-auto p-4">
            <button id="back-to-home" class="mb-4 text-sm text-green-600 hover:underline"><i class="fas fa-arrow-left mr-2"></i>Kembali ke Beranda</button>
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                ${isOwnProfile && state.isEditingProfile ? ProfileEditView(user) : ProfileDisplayView(user, isOwnProfile)}
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Produk dari ${user.name}</h3>
            <div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                ${userProducts.length > 0 ? userProducts.map(ProductCard).join('') : `<p class="col-span-full text-center text-gray-500 mt-8">Pengguna ini belum memiliki produk yang sesuai dengan filter Anda.</p>`}
            </div>
        </main>
    </div>
    `;
};

// =============== EVENT HANDLERS ===============
function handleGoBackHome() {
    navigateTo('home', { viewingProfileOf: null, filter: { ...state.filter, faculty: null } });
}

function handleOpenVerificationModal() {
    setState({ isVerificationModalOpen: true });
}

function handleCloseVerificationModal() {
    setState({ isVerificationModalOpen: false });
}

function handleVerificationSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('verificationEmail') as string;

    if (!state.currentUser) {
        showNotification('Sesi Anda telah berakhir. Silakan login kembali.');
        return;
    }

    if (email.toLowerCase() === state.currentUser.email.toLowerCase()) {
        const updatedUsers = state.users.map(user => 
            user.nim === state.currentUser!.nim ? { ...user, isVerified: true } : user
        );

        const updatedListings = state.listings.map(listing => 
            listing.sellerId === state.currentUser!.nim ? { ...listing, seller: { ...listing.seller, isVerified: true } } : listing
        );

        const updatedCurrentUser = { ...state.currentUser, isVerified: true };
        
        const updatedViewingProfileOf = state.viewingProfileOf?.nim === updatedCurrentUser.nim ? updatedCurrentUser : state.viewingProfileOf;

        setState({
            users: updatedUsers,
            listings: updatedListings,
            currentUser: updatedCurrentUser,
            viewingProfileOf: updatedViewingProfileOf,
            isVerificationModalOpen: false,
        });

        showNotification('Akun berhasil diverifikasi!', 'success');
    } else {
        showNotification('Email yang dimasukkan tidak sesuai dengan data akun Anda.');
    }
}

function handleEditProfile() {
    setState({ isEditingProfile: true });
}

function handleCancelEdit() {
    setState({ isEditingProfile: false });
}

function handleUpdateProfile(event: Event) {
    event.preventDefault();
    if (!state.currentUser) return;
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newName = formData.get('name') as string;
    const newPhone = formData.get('phone') as string;

    if (!newName.trim() || !newPhone.trim()) {
        showNotification('Nama dan Nomor WhatsApp tidak boleh kosong.');
        return;
    }

    // Update currentUser
    const updatedCurrentUser = { ...state.currentUser, name: newName, phone: newPhone };

    // Update the user in the main users array
    const updatedUsers = state.users.map(u => u.nim === state.currentUser!.nim ? updatedCurrentUser : u);

    // Update seller name in all of their listings for consistency
    const updatedListings = state.listings.map(p => {
        if (p.sellerId === state.currentUser!.nim) {
            return { ...p, seller: { ...p.seller, name: newName } };
        }
        return p;
    });

    setState({
        currentUser: updatedCurrentUser,
        users: updatedUsers,
        listings: updatedListings,
        viewingProfileOf: updatedCurrentUser, // Ensure the profile view updates immediately
        isEditingProfile: false,
    });
    
    showNotification('Profil berhasil diperbarui.', 'success');
}


// =============== EVENT ATTACHMENT ===============
export function attachProfileEventListeners() {
    document.getElementById('back-to-home')?.addEventListener('click', handleGoBackHome);
    document.getElementById('open-verification-modal')?.addEventListener('click', handleOpenVerificationModal);
    document.getElementById('edit-profile-btn')?.addEventListener('click', handleEditProfile);
    
    if (state.isEditingProfile) {
        document.getElementById('edit-profile-form')?.addEventListener('submit', handleUpdateProfile);
        document.getElementById('cancel-edit-btn')?.addEventListener('click', handleCancelEdit);
    }

    if (state.isVerificationModalOpen) {
        document.getElementById('verification-modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('verification-modal-backdrop')) handleCloseVerificationModal();
        });
        document.getElementById('cancel-verification-button')?.addEventListener('click', handleCloseVerificationModal);
        document.getElementById('verification-form')?.addEventListener('submit', handleVerificationSubmit);
    }
    // Product grid and header events are handled by attachHomeEventListeners
}