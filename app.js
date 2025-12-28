
const API_BASE = 'https://api.alquran.cloud/v1';

// Global State
const state = {
    surahs: [],
    currentView: '',
    prayerTimes: null,
    searchQuery: '',
    bookmarks: JSON.parse(localStorage.getItem('quran_bookmarks') || '[]')
};

const appElement = document.getElementById('app');

// --- ROUTES CONFIGURATION ---
const routes = [
    { path: /^\/$/, render: renderHome },
    { path: /^\/surah\/(\d+)$/, render: renderSurah },
    { path: /^\/sipara$/, render: renderSiparaList },
    { path: /^\/sipara\/(\d+)$/, render: renderSipara },
    { path: /^\/duas$/, render: renderDuas },
    { path: /^\/names$/, render: renderNames }
];

// --- ROUTER ENGINE ---
function navigate(path) {
    window.history.pushState({}, '', path);
    handleRoute();
}

window.addEventListener('popstate', handleRoute);

document.addEventListener('click', e => {
    const link = e.target.closest('.nav-link') || e.target.closest('a[href^="/"]');
    if (link && !link.hasAttribute('target')) {
        e.preventDefault();
        const path = link.getAttribute('href');
        navigate(path);
        
        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    }
});

async function handleRoute() {
    window.scrollTo(0,0);
    const path = window.location.pathname;
    const route = routes.find(r => r.path.test(path));
    
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(l => {
        if (l.getAttribute('href') === path) {
            l.classList.add('active-link');
        } else {
            l.classList.remove('active-link');
        }
    });

    if (route) {
        const match = path.match(route.path);
        route.render(match ? match[1] : null);
    } else {
        render404();
    }
}

// --- RENDERING HELPERS ---
function setLoader() {
    appElement.innerHTML = `
        <div class="flex flex-col items-center justify-center py-24">
            <div class="w-14 h-14 border-4 border-islamic-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-4 text-slate-400 font-medium">Loading sacred verses...</p>
        </div>
    `;
}

function render404() {
    appElement.innerHTML = `
        <div class="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <h1 class="text-6xl font-black text-islamic-800 mb-4">404</h1>
            <p class="text-slate-500 mb-8">The page you are looking for has been moved or doesn't exist.</p>
            <a href="/" class="bg-islamic-800 text-white px-8 py-3 rounded-xl font-bold nav-link">Return Home</a>
        </div>
    `;
}

// --- PAGE: HOME ---
async function renderHome() {
    setLoader();
    
    try {
        if (state.surahs.length === 0) {
            const res = await fetch(`${API_BASE}/surah`);
            const data = await res.json();
            state.surahs = data.data;
        }

        let surahCards = state.surahs.map(s => `
            <a href="/surah/${s.number}" class="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-islamic-600 hover:shadow-xl transition-all group">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <span class="w-12 h-12 bg-emerald-50 text-islamic-800 rounded-2xl flex items-center justify-center font-black group-hover:bg-islamic-800 group-hover:text-white transition">${s.number}</span>
                        <div>
                            <h3 class="font-bold group-hover:text-islamic-700 text-slate-900">${s.englishName}</h3>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${s.numberOfAyahs} Ayahs • ${s.revelationType}</p>
                        </div>
                    </div>
                    <span class="arabic-text text-3xl text-islamic-900 font-bold">${s.name}</span>
                </div>
            </a>
        `).join('');

        appElement.innerHTML = `
            <section class="bg-islamic-800 rounded-[3rem] p-10 md:p-16 text-white text-center mb-12 shadow-2xl relative overflow-hidden">
                <div class="relative z-10">
                    <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">Quran Seekho <span class="text-emerald-300">Online</span></h1>
                    <p class="text-emerald-100 opacity-80 max-w-xl mx-auto mb-10 text-lg leading-relaxed">Experience the Holy Quran with beautiful Urdu and English translations, anywhere, anytime.</p>
                    <div id="prayer-widget" class="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 inline-block border border-white/10">
                        <p class="animate-pulse">Checking location for prayer times...</p>
                    </div>
                </div>
                <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
            </section>

            <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 class="text-3xl font-black text-slate-800">Surah Index</h2>
                <div class="flex bg-slate-100 p-1.5 rounded-2xl">
                    <a href="/" class="px-6 py-2 rounded-xl font-bold bg-white text-islamic-800 shadow-sm">Surah</a>
                    <a href="/sipara" class="px-6 py-2 rounded-xl font-bold text-slate-500 hover:text-islamic-700 transition">Sipara (Juz)</a>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${surahCards}
            </div>
        `;
        
        loadPrayerTimes();
    } catch (err) {
        appElement.innerHTML = `<div class="text-center py-20 text-red-500 font-bold">Failed to load Quran data. Please check your connection.</div>`;
    }
}

// --- PAGE: SURAH READER ---
async function renderSurah(number) {
    setLoader();
    
    try {
        const res = await fetch(`${API_BASE}/surah/${number}/editions/quran-uthmani,en.sahih,ur.jalandhry`);
        const data = await res.json();
        const [arabic, english, urdu] = data.data;

        let ayahsHtml = arabic.ayahs.map((ayah, i) => `
            <div class="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 mb-8 shadow-sm hover:shadow-md transition">
                <div class="flex justify-between items-center mb-8">
                    <span class="bg-islamic-50 text-islamic-700 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">${ayah.numberInSurah}</span>
                    <button onclick="copyToClipboard('${arabic.englishName} ${ayah.numberInSurah}')" class="text-slate-300 hover:text-emerald-600 transition p-2">📋 Copy</button>
                </div>
                <p class="arabic-text text-4xl md:text-5xl text-right leading-[2.5] mb-10 text-slate-900">${ayah.text}</p>
                <div class="space-y-6 border-l-4 border-emerald-50 pl-8">
                    <p class="urdu-text text-2xl text-slate-700 leading-relaxed">${urdu.ayahs[i].text}</p>
                    <p class="text-slate-500 font-medium text-lg">${english.ayahs[i].text}</p>
                </div>
            </div>
        `).join('');

        appElement.innerHTML = `
            <div class="max-w-4xl mx-auto pb-12">
                <div class="text-center mb-16">
                    <h2 class="arabic-text text-6xl text-islamic-800 mb-2">${arabic.name}</h2>
                    <h1 class="text-4xl font-black text-slate-900 mb-1">${arabic.englishName}</h1>
                    <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">${arabic.revelationType} • ${arabic.numberOfAyahs} Ayahs</p>
                    <a href="/" class="inline-block mt-8 text-sm font-bold text-islamic-600 hover:underline">← All Surahs</a>
                </div>
                
                ${number != 1 && number != 9 ? '<div class="text-center py-12 arabic-text text-5xl text-slate-400 opacity-50">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>' : ''}
                
                <div class="space-y-4">${ayahsHtml}</div>
                
                <div class="flex justify-between mt-12 bg-white p-6 rounded-3xl border border-slate-100">
                    ${number > 1 ? `<a href="/surah/${parseInt(number)-1}" class="px-8 py-3 rounded-2xl font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition">Previous</a>` : '<div></div>'}
                    ${number < 114 ? `<a href="/surah/${parseInt(number)+1}" class="bg-islamic-800 text-white px-10 py-3 rounded-2xl font-bold hover:shadow-lg transition">Next Surah</a>` : ''}
                </div>
            </div>
        `;
    } catch (e) {
        render404();
    }
}

// --- PAGE: SIPARA LIST ---
function renderSiparaList() {
    let siparaGrid = '';
    for (let i = 1; i <= 30; i++) {
        siparaGrid += `
            <a href="/sipara/${i}" class="group bg-white p-12 text-center rounded-[2.5rem] border border-slate-100 hover:border-islamic-600 hover:shadow-2xl transition-all duration-500">
                <span class="block text-5xl font-black text-islamic-900 mb-2 group-hover:scale-125 transition duration-500">${i}</span>
                <span class="block text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">SIPARA / JUZ</span>
            </a>
        `;
    }

    appElement.innerHTML = `
        <h1 class="text-4xl font-black text-slate-800 mb-10 text-center">Sipara Index</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            ${siparaGrid}
        </div>
    `;
}

// --- PAGE: SIPARA READER ---
async function renderSipara(number) {
    setLoader();
    try {
        const res = await fetch(`${API_BASE}/juz/${number}/editions/quran-uthmani,en.sahih,ur.jalandhry`);
        const data = await res.json();
        const [arabic, english, urdu] = data.data;

        let ayahsHtml = arabic.ayahs.map((ayah, i) => `
            <div class="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 mb-8 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Surah ${ayah.surah.englishName} : Ayah ${ayah.numberInSurah}</span>
                </div>
                <p class="arabic-text text-4xl text-right leading-[2.5] mb-8 text-slate-900">${ayah.text}</p>
                <div class="space-y-4 border-l-2 border-emerald-50 pl-6">
                    <p class="urdu-text text-xl text-slate-700 leading-relaxed">${urdu.ayahs[i].text}</p>
                    <p class="text-slate-500 font-medium text-sm italic">${english.ayahs[i].text}</p>
                </div>
            </div>
        `).join('');

        appElement.innerHTML = `
            <div class="max-w-4xl mx-auto pb-12">
                <div class="text-center mb-16 bg-islamic-800 text-white p-10 rounded-[3rem] shadow-xl">
                    <h1 class="text-5xl font-black">Sipara ${number}</h1>
                    <p class="text-emerald-100 opacity-80 mt-2 font-bold uppercase tracking-widest text-xs">Juz Number ${number}</p>
                    <a href="/sipara" class="inline-block mt-6 text-xs font-bold bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">← All Siparas</a>
                </div>
                <div class="space-y-4">${ayahsHtml}</div>
                <div class="flex justify-between mt-12">
                    ${number > 1 ? `<a href="/sipara/${parseInt(number)-1}" class="bg-white px-8 py-3 rounded-2xl border font-bold text-slate-600 transition">Previous Sipara</a>` : '<div></div>'}
                    ${number < 30 ? `<a href="/sipara/${parseInt(number)+1}" class="bg-islamic-800 text-white px-10 py-3 rounded-2xl font-bold hover:shadow-lg transition">Next Sipara</a>` : ''}
                </div>
            </div>
        `;
    } catch (e) {
        render404();
    }
}

// --- PAGE: DUAS ---
function renderDuas() {
    const DUA_DATA = [
        { title: 'Morning Dua', arabic: 'الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف لوٹ کر جانا ہے۔', english: 'Praise is to Allah who gave us life after he had caused us to die and to Him is the return.' },
        { title: 'Before Sleep', arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ', urdu: 'اے میرے رب! تیرے ہی نام سے میں نے اپنا پہلو رکھا اور تیرے ہی نام سے میں اسے اٹھاؤں گا۔', english: 'In Your name my Lord I lie down and in Your name I rise.' },
        { title: 'Entering Masjid', arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', urdu: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔', english: 'O Allah, open for me the gates of Your mercy.' }
    ];

    let duasHtml = DUA_DATA.map(d => `
        <div class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition">
            <h3 class="text-xl font-bold text-islamic-700 mb-6 uppercase tracking-widest text-sm">✨ ${d.title}</h3>
            <p class="arabic-text text-4xl text-center mb-10 leading-loose text-slate-900">${d.arabic}</p>
            <div class="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                <p class="urdu-text text-xl text-slate-700">${d.urdu}</p>
                <p class="text-slate-500 font-medium italic leading-relaxed">${d.english}</p>
            </div>
        </div>
    `).join('');

    appElement.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-black text-slate-800 text-center mb-12">Daily Duas</h1>
            <div class="space-y-8">${duasHtml}</div>
        </div>
    `;
}

// --- PAGE: 99 NAMES ---
function renderNames() {
    appElement.innerHTML = `
        <div class="text-center py-24">
            <h1 class="text-4xl font-black text-amber-600 mb-4 tracking-tight">99 Names of Allah</h1>
            <p class="text-slate-500">Beautiful names of Allah with Urdu and English meanings coming soon.</p>
            <a href="/" class="inline-block mt-10 text-islamic-600 font-bold underline">Go Back Home</a>
        </div>
    `;
}

// --- UTILITIES: PRAYER TIMES ---
function loadPrayerTimes() {
    const widget = document.getElementById('prayer-widget');
    if (!navigator.geolocation) {
        widget.innerHTML = "<p>Geolocation not supported by your browser.</p>";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
            const data = await res.json();
            const t = data.data.timings;
            
            widget.innerHTML = `
                <div class="flex flex-wrap justify-center gap-6 text-sm font-bold">
                    <div class="flex flex-col"><span>Fajr</span><span class="text-emerald-300">${t.Fajr}</span></div>
                    <div class="flex flex-col"><span>Zuhr</span><span class="text-emerald-300">${t.Dhuhr}</span></div>
                    <div class="flex flex-col"><span>Asr</span><span class="text-emerald-300">${t.Asr}</span></div>
                    <div class="flex flex-col"><span>Maghrib</span><span class="text-emerald-300">${t.Maghrib}</span></div>
                    <div class="flex flex-col"><span>Isha</span><span class="text-emerald-300">${t.Isha}</span></div>
                </div>
            `;
            localStorage.setItem('cached_prayer_times', JSON.stringify(t));
        } catch (e) {
            widget.innerHTML = "<p>Unable to load live prayer times.</p>";
        }
    }, () => {
        const cached = localStorage.getItem('cached_prayer_times');
        if (cached) {
            const t = JSON.parse(cached);
            widget.innerHTML = `<p class="text-xs opacity-70 mb-2">Showing last saved times:</p>
                <div class="flex flex-wrap justify-center gap-6 text-sm font-bold">
                    <div>Fajr: ${t.Fajr}</div><div>Isha: ${t.Isha}</div>
                </div>`;
        } else {
            widget.innerHTML = "<p class="text-sm">Location denied. Please enable location for prayer times.</p>";
        }
    });
}

// --- UTILITIES: CLIPBOARD ---
window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert("Reference copied: " + text);
    });
};

// --- START APP ---
handleRoute();
