/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, subscribe, initializeApp, navigateTo } from './shared';
import { LoginView, RegisterView, attachLoginEventListeners } from './login';
import { HomeView, CreateListingModal, attachHomeEventListeners, FilterModal } from './home';
import { ProfileView, attachProfileEventListeners, VerificationModal } from './profile';
import { ProductDetailView, NotificationToast, LogoutConfirmationModal, DeleteConfirmationModal, EditListingModal } from './shared';

// =============== LOADING VIEW ===============
const LoadingView = (): string => `
    <div class="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div class="flex flex-col items-center">
            <i class="fas fa-spinner fa-spin text-5xl text-yellow-500"></i>
            <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>
    </div>
`;

// =============== ERROR FLASH VIEW ===============
const ErrorFlashView = (): string => {
    // This element is always in the DOM for a smooth fade-out transition.
    // CSS classes, driven by the state, control its visibility and interactivity.
    return `
        <div 
            class="fixed inset-0 bg-white z-[9999] transition-opacity duration-700 ease-out ${state.isErrorFlashActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
        ></div>
    `;
};


// =============== MAIN RENDER FUNCTION ===============
function render() {
    const root = document.getElementById('root');
    if (!root) {
        console.error('Root element not found!');
        return;
    }
    
    // Apply transition class for smooth view changes
    root.style.transition = 'opacity 0.3s ease-in-out';

    if (state.isLoading) {
        root.innerHTML = LoadingView();
        // Ensure opacity is 1 for loading screen
        root.style.opacity = '1';
        return;
    }

    let viewHtml = '';
    switch(state.currentView) {
        case 'login':
            viewHtml = LoginView();
            break;
        case 'register':
            viewHtml = RegisterView();
            break;
        case 'home':
            viewHtml = HomeView();
            break;
        case 'profile':
            viewHtml = ProfileView();
            break;
        case 'productDetail':
            viewHtml = ProductDetailView();
            break;
    }

    const modalHtml = state.isModalOpen ? CreateListingModal() : '';
    const logoutModalHtml = state.isLogoutModalOpen ? LogoutConfirmationModal() : '';
    const verificationModalHtml = state.isVerificationModalOpen ? VerificationModal() : '';
    const filterModalHtml = state.isFilterModalOpen ? FilterModal() : '';
    const editModalHtml = state.isEditModalOpen ? EditListingModal() : '';
    const deleteModalHtml = state.isDeleteConfirmationOpen ? DeleteConfirmationModal() : '';
    const errorFlashHtml = ErrorFlashView();
    const notificationsHtml = `
        <div id="notification-container" class="fixed top-4 right-4 z-50 space-y-2 w-full max-w-xs">
            ${state.notifications.map(NotificationToast).join('')}
        </div>
    `;
    
    root.innerHTML = errorFlashHtml + viewHtml + modalHtml + logoutModalHtml + verificationModalHtml + filterModalHtml + editModalHtml + deleteModalHtml + notificationsHtml;
    
    attachEventListeners();
}

// =============== EVENT ATTACHMENT ===============
function attachEventListeners() {
    switch(state.currentView) {
        case 'login':
        case 'register':
            attachLoginEventListeners();
            break;
        case 'home':
            attachHomeEventListeners();
            break;
        case 'profile':
            attachProfileEventListeners();
            // The profile page also uses the main header and product grid
            attachHomeEventListeners(); 
            break;
        case 'productDetail':
             // The product detail page also uses the main header and some grid-like click behaviors
            attachHomeEventListeners();
            break;
    }
}


// Initial App Load
subscribe(render); // Subscribe the render function to state changes
initializeApp(); // Start the app by loading remote data