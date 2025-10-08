/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, setState, ProductCard } from './shared';
// HomeHeader is rendered via HomeView's call in index.tsx
// which adds the header. attachHomeEventListeners handles header events.

// =============== COMPONENT TEMPLATES ===============

export const ProfileView = (): string => {
    const user = state.viewingProfileOf;
    if (!user) return `<p>Pengguna tidak ditemukan.</p>`;

    const userProducts = state.listings.filter(p => p.sellerId === user.nim);
    
    return `
    <div class="min-h-screen bg-gray-100">
        <!-- Header is rendered by HomeView -->
        <main class="container mx-auto p-4">
            <button id="back-to-home" class="mb-4 text-sm text-red-600 hover:underline"><i class="fas fa-arrow-left mr-2"></i>Kembali ke Beranda</button>
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 class="text-3xl font-bold text-gray-800">${user.name}</h2>
                <p class="text-gray-600">${user.faculty}</p>
                 <span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2">
                    <i class="fas fa-check-circle mr-1"></i>
                    Penjual Terverifikasi
                </span>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Produk dari ${user.name}</h3>
            <div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                ${userProducts.length > 0 ? userProducts.map(ProductCard).join('') : `<p class="col-span-full text-center text-gray-500 mt-8">Pengguna ini belum memiliki produk.</p>`}
            </div>
        </main>
    </div>
    `;
};

// =============== EVENT HANDLERS ===============
function handleGoBackHome() {
    setState({ currentView: 'home', viewingProfileOf: null, filter: { ...state.filter, faculty: null } });
}

// =============== EVENT ATTACHMENT ===============
export function attachProfileEventListeners() {
    document.getElementById('back-to-home')?.addEventListener('click', handleGoBackHome);
    // Product grid and header events are handled by attachHomeEventListeners
}
