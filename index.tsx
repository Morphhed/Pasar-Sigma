/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, subscribe } from './shared';
import { LoginView, RegisterView, attachLoginEventListeners } from './login';
import { HomeView, CreateListingModal, attachHomeEventListeners } from './home';
import { ProfileView, attachProfileEventListeners } from './profile';
import { ProductDetailView, NotificationToast, LogoutConfirmationModal } from './shared';

// =============== MAIN RENDER FUNCTION ===============
function render() {
    const root = document.getElementById('root');
    if (!root) {
        console.error('Root element not found!');
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
    const notificationsHtml = `
        <div id="notification-container" class="fixed top-4 right-4 z-50 space-y-2 w-full max-w-xs">
            ${state.notifications.map(NotificationToast).join('')}
        </div>
    `;
    
    root.innerHTML = viewHtml + modalHtml + logoutModalHtml + notificationsHtml;
    
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
render();
