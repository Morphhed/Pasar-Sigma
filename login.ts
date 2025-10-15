/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, setState, showNotification, findUserByName, faculties } from './shared';
import type { User } from './shared';

// =============== COMPONENT TEMPLATES ===============

export const LoginView = (): string => `
    <div class="min-h-screen bg-gradient-to-br from-green-600 to-yellow-400 flex flex-col justify-center items-center p-4">
        <div class="w-full max-w-sm text-center">
            <h1 class="text-4xl font-bold text-white mb-4" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.4)">Pasar UNSRI</h1>
            <p class="text-yellow-200 mb-8" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.4)">Marketplace Eksklusif Mahasiswa Unsri</p>
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                <form id="login-form">
                    <div class="mb-4">
                        <input type="text" name="nim" placeholder="Nomor Induk Mahasiswa (NIM)" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    <div class="mb-6">
                        <input type="password" name="password" placeholder="Password" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition duration-300">MASUK</button>
                </form>
                 <p class="text-sm text-gray-600 mt-6">
                    Belum punya akun? 
                    <a href="#" id="go-to-register" class="font-semibold text-green-600 hover:underline">Buat Akun</a>
                </p>
                <p class="text-xs text-gray-500 mt-4">
                    <a href="#" id="sigma-login" class="hover:underline">sigma mode</a>
                </p>
            </div>
        </div>
    </div>
`;

export const RegisterView = (): string => `
    <div class="min-h-screen bg-gradient-to-br from-green-200 to-yellow-200 flex flex-col justify-center items-center p-4">
        <div class="w-full max-w-sm text-center">
            <h1 class="text-4xl font-bold text-green-800 mb-2">Buat Akun Baru</h1>
            <p class="text-green-700 mb-8">Gabung dengan komunitas Pasar UNSRI</p>
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                <form id="register-form" novalidate>
                    <div class="mb-4">
                         <input type="text" name="name" placeholder="Nama Lengkap" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    <div class="mb-4">
                        <input type="text" name="nim" placeholder="Nomor Induk Mahasiswa (NIM)" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    <div class="mb-4">
                         <select name="faculty" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                            <option value="" disabled selected>Pilih Fakultas</option>
                            ${faculties.map(f => `<option value="${f}">${f}</option>`).join('')}
                        </select>
                    </div>
                     <div class="mb-4">
                        <input type="tel" name="phone" placeholder="Nomor WhatsApp (e.g., 62812...)" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    <div class="mb-4">
                        <input type="email" name="email" placeholder="Email Kampus (@unsri.ac.id)" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    </div>
                    <div class="mb-4">
                        <input type="password" name="password" placeholder="Password (min. 10 karakter)" class="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required minlength="10">
                    </div>
                    <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition duration-300">DAFTAR</button>
                </form>
                <p class="text-sm text-gray-600 mt-6">
                    Sudah punya akun? 
                    <a href="#" id="go-to-login" class="font-semibold text-green-600 hover:underline">Masuk di sini</a>
                </p>
            </div>
        </div>
    </div>
`;


// =============== EVENT HANDLERS ===============
function handleLogin(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const nim = formData.get('nim') as string;
    const password = formData.get('password') as string;

    // Special hardcoded admin login
    if (nim.toLowerCase() === 'super diddy' && password === '123') {
        const adminUser: User = {
            name: 'Super Diddy',
            nim: 'superadmin',
            email: 'admin@pasarnsri.dev',
            password: '', // Don't store plain password in state
            faculty: 'Administration',
            phone: 'N/A',
            isVerified: true,
            isAdmin: true,
        };
        console.log('Admin login successful');
        showNotification(`Selamat datang, ${adminUser.name}!`, 'success');
        setState({ currentUser: adminUser, currentView: 'home' });
        return;
    }

    const user = state.users.find(u => u.nim === nim);

    if (user && user.password === password) {
        console.log('Login successful for:', user.name);
        setState({ currentUser: user, currentView: 'home' });
    } else {
        showNotification('NIM atau password salah. Coba lagi.');
    }
}

function handleSigmaLogin(event: Event) {
    event.preventDefault();
    const sigmaUser: User = {
        name: 'Sigma Chad',
        nim: '09011282328001',
        email: 'sigma@unsri.ac.id',
        password: 'password123',
        faculty: 'FASILKOM',
        phone: '6281200000001',
        isVerified: false,
    };
    if (!findUserByName(sigmaUser.name)) {
        state.users.push(sigmaUser);
    }
    console.log('Sigma login activated.');
    setState({ currentUser: sigmaUser, currentView: 'home' });
}

function handleGoToRegister(event: Event) {
    event.preventDefault();
    setState({ currentView: 'register' });
}

function handleGoToLogin(event: Event) {
    event.preventDefault();
    setState({ currentView: 'login' });
}

function handleRegister(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nim = formData.get('nim') as string;
    const faculty = formData.get('faculty') as string;
    const phone = formData.get('phone') as string;

    if (!name || !email || !nim || !password || !faculty || !phone) {
        showNotification('Semua kolom wajib diisi.');
        return;
    }
    
    if (state.users.some(u => u.nim === nim)) {
        showNotification('NIM ini sudah terdaftar. Silakan login.');
        return;
    }

    if (!email.toLowerCase().endsWith('@unsri.ac.id')) {
        showNotification('Pendaftaran wajib menggunakan email @unsri.ac.id.');
        return;
    }

    if (password.length < 10) {
        showNotification('Password harus memiliki minimal 10 karakter.');
        return;
    }

    const newUser: User = { name, nim, email, password, faculty, phone, isVerified: false };
    const updatedUsers = [...state.users, newUser];
    
    console.log('Registrasi berhasil untuk:', newUser);
    showNotification('Akun berhasil dibuat! Silakan masuk.', 'success');
    setState({ users: updatedUsers, currentView: 'login' });
}

// =============== EVENT ATTACHMENT ===============
export function attachLoginEventListeners() {
    if (state.currentView === 'login') {
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('go-to-register')?.addEventListener('click', handleGoToRegister);
        document.getElementById('sigma-login')?.addEventListener('click', handleSigmaLogin);
    }
    
    if (state.currentView === 'register') {
        document.getElementById('register-form')?.addEventListener('submit', handleRegister);
        document.getElementById('go-to-login')?.addEventListener('click', handleGoToLogin);
    }
}
