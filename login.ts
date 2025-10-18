/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { state, setState, showNotification, findUserByName, faculties, navigateTo } from './shared';
import type { User } from './shared';

// =============== COMPONENT TEMPLATES ===============

// Helper function untuk membuat input dengan "floating label"
const FloatingLabelInput = (
    id: string, 
    name: string, 
    type: string, 
    label: string, 
    icon: string,
    required: boolean = true,
    minLength?: number
): string => `
    <div class="relative">
        <input 
            type="${type}" 
            id="${id}" 
            name="${name}" 
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-yellow-500 peer" 
            placeholder=" " 
            ${required ? 'required' : ''}
            ${minLength ? `minlength="${minLength}"` : ''}
        />
        <label 
            for="${id}" 
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-yellow-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
        >
            ${label}
        </label>
        <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <i class="fas ${icon} text-gray-400"></i>
        </div>
    </div>
`;


export const LoginView = (): string => `
    <div class="min-h-screen bg-white md:grid md:grid-cols-5">
        
        <!-- Gradient Panel -->
        <div class="relative hidden md:block md:col-span-3 bg-gradient-to-br from-yellow-400 to-green-600">
            <div class="relative h-full flex flex-col justify-center p-16">
                <h1 class="font-slogan text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.6)">
                    Jual Beli Mudah <br> dari Mahasiswa, <br> untuk Mahasiswa.
                </h1>
            </div>
        </div>

        <!-- Form Panel -->
        <div class="md:col-span-2 flex flex-col justify-center items-center p-6 sm:p-12 bg-gray-50">
            <div class="w-full max-w-md">
                <div class="text-center md:text-left mb-10">
                    <h2 class="text-4xl font-bold text-gray-800">Pasar <span class="text-yellow-500">UNSRI</span></h2>
                    <p class="text-gray-500 mt-2">Selamat datang kembali! Silakan masuk.</p>
                </div>

                <form id="login-form" class="space-y-6">
                    ${FloatingLabelInput('nim', 'nim', 'text', 'Nomor Induk Mahasiswa (NIM)', 'fa-user')}
                    ${FloatingLabelInput('password', 'password', 'password', 'Password', 'fa-lock')}
                    
                    <button 
                        type="submit" 
                        class="w-full bg-gradient-to-r from-yellow-500 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        MASUK
                    </button>
                </form>

                <p class="text-sm text-gray-600 text-center mt-8">
                    Belum punya akun? 
                    <a href="#" id="go-to-register" class="font-semibold text-green-600 hover:underline">
                        Buat Akun
                    </a>
                </p>
                <p class="text-xs text-gray-400 text-center mt-4">
                    <a href="#" id="sigma-login" class="hover:underline">masuk sebagai sigma</a>
                </p>
            </div>
        </div>
    </div>
`;

export const RegisterView = (): string => `
    <div class="min-h-screen bg-white md:grid md:grid-cols-5">
        
        <!-- Gradient Panel -->
        <div class="relative hidden md:block md:col-span-3 bg-gradient-to-br from-yellow-400 to-green-600">
            <div class="relative h-full flex flex-col justify-center p-16">
                <h1 class="font-slogan text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.6)">
                    Bergabung dengan Ribuan <br> Mahasiswa Unsri Lainnya.
                </h1>
            </div>
        </div>

        <!-- Form Panel -->
        <div class="md:col-span-2 flex flex-col justify-center items-center p-6 sm:p-12 bg-gray-50">
            <div class="w-full max-w-md">
                <div class="text-center md:text-left mb-8">
                    <h2 class="text-3xl font-bold text-gray-800">Buat Akun Baru</h2>
                    <p class="text-gray-500 mt-2">Isi data di bawah untuk mendaftar.</p>
                </div>
                 <form id="register-form" novalidate class="space-y-4">
                    ${FloatingLabelInput('name', 'name', 'text', 'Nama Lengkap', 'fa-user')}
                    ${FloatingLabelInput('nim', 'nim', 'text', 'Nomor Induk Mahasiswa (NIM)', 'fa-id-card')}
                    <div class="relative">
                        <select name="faculty" id="faculty" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-yellow-500 peer" required>
                            <option value="" disabled selected></option>
                            ${faculties.map(f => `<option value="${f}">${f}</option>`).join('')}
                        </select>
                        <label for="faculty" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-yellow-600 
                        peer-[:invalid]:scale-100 peer-[:invalid]:-translate-y-1/2 peer-[:invalid]:top-1/2
                        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Pilih Fakultas</label>
                        <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                             <i class="fas fa-building-columns text-gray-400"></i>
                        </div>
                    </div>
                    ${FloatingLabelInput('phone', 'phone', 'tel', 'Nomor WhatsApp (e.g., 62812...)', 'fab fa-whatsapp')}
                    ${FloatingLabelInput('email', 'email', 'email', 'Email Kampus (@unsri.ac.id)', 'fa-envelope')}
                    ${FloatingLabelInput('password', 'password', 'password', 'Password (min. 10 karakter)', 'fa-lock', true, 10)}
                    
                    <button 
                        type="submit" 
                        class="w-full bg-gradient-to-r from-yellow-500 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 !mt-8"
                    >
                        DAFTAR
                    </button>
                </form>
                <p class="text-sm text-gray-600 text-center mt-6">
                    Sudah punya akun? 
                    <a href="#" id="go-to-login" class="font-semibold text-green-600 hover:underline">
                        Masuk di sini
                    </a>
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
        navigateTo('home', { currentUser: adminUser });
        return;
    }

    const user = state.users.find(u => u.nim === nim);

    if (user && user.password === password) {
        console.log('Login successful for:', user.name);
        navigateTo('home', { currentUser: user });
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
    navigateTo('home', { currentUser: sigmaUser });
}

function handleGoToRegister(event: Event) {
    event.preventDefault();
    navigateTo('register');
}

function handleGoToLogin(event: Event) {
    event.preventDefault();
    navigateTo('login');
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
    setState({ users: updatedUsers }); // Save users first
    navigateTo('login'); // Then navigate
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