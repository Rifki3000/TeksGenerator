/* ==============================================
  * TAHAP 3: JAVASCRIPT CORE
  * Generator Teks Keren untuk TikTok & Social Media
  * Versi: 1.0.0
  * Author: Diberikan oleh Dola (ex-Cici)
  * Tanggal: 21 Februari 2026
  * Total Baris: ±650 baris
  ============================================== */

// ==============================================
// 1. GLOBAL VARIABLES & SELECTORS
// ==============================================
let currentText = "";
let allFonts = []; // Akan diisi dari fonts-data.js nantinya
let filteredFonts = [];
let isFavoritesOnly = false;

// DOM Elements Selectors
const DOM = {
  // Input & Preview
  textInput: document.getElementById('text-input'),
  realtimePreview: document.getElementById('realtime-preview'),
  clearInputBtn: document.getElementById('clear-input-btn'),
  
  // Font Grid & States
  fontGrid: document.getElementById('font-grid'),
  emptyGridState: document.getElementById('empty-grid-state'),
  noResultsState: document.getElementById('no-results-state'),
  favoritesOnlyState: document.getElementById('favorites-only-state'),
  fontCountBadge: document.getElementById('font-count-badge'),
  
  // Buttons
  copyAllBtn: document.getElementById('copy-all-btn'),
  randomStyleBtn: document.getElementById('random-style-btn'),
  mobileRandomBtn: document.getElementById('mobile-random-btn'),
  viewFavoritesBtn: document.getElementById('view-favorites-btn'),
  
  // Search & Filter
  fontSearch: document.getElementById('font-search'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  categoryTabs: document.getElementById('category-tabs'),
  scrollTabsLeft: document.getElementById('scroll-tabs-left'),
  scrollTabsRight: document.getElementById('scroll-tabs-right'),
  
  // Mode Toggle
  modeToggle: document.getElementById('mode-toggle'),
  mobileModeToggle: document.getElementById('mobile-mode-toggle'),
  
  // Mobile Menu
  hamburgerToggle: document.getElementById('hamburger-toggle'),
  mobileMenu: document.getElementById('mobile-menu'),
  
  // Favorites
  favCount: document.getElementById('fav-count')
};

// ==============================================
// 2. INPUT HANDLER & REALTIME PREVIEW
// ==============================================
/**
 * Fungsi untuk menangani input teks dan update preview secara realtime
 */
function handleTextInput() {
  // Ambil nilai dari input
  currentText = DOM.textInput.value.trim();
  
  // Update preview realtime
  if (currentText) {
    DOM.realtimePreview.innerHTML = currentText;
    DOM.realtimePreview.classList.remove('preview-placeholder');
  } else {
    DOM.realtimePreview.innerHTML = '<span class="preview-placeholder">Teks kamu akan muncul di sini!</span>';
    DOM.realtimePreview.classList.add('preview-placeholder');
  }
  
  // Update font grid berdasarkan input saat ini
  updateFontGrid();
}

/**
 * Fungsi untuk menghapus input teks
 */
function clearTextInput() {
  DOM.textInput.value = "";
  handleTextInput();
  
  // Tambahkan animasi feedback
  DOM.textInput.classList.add('animate-clear');
  setTimeout(() => DOM.textInput.classList.remove('animate-clear'), 300);
}

// ==============================================
// 3. FONT GRID GENERATOR
// ==============================================
/**
 * Fungsi untuk mengupdate grid font berdasarkan filter dan input saat ini
 */
function updateFontGrid() {
  // Reset grid
  DOM.fontGrid.innerHTML = "";
  
  // Cek jika tidak ada input teks
  if (!currentText) {
    showState('emptyGrid');
    return;
  }
  
  // Tentukan font yang akan ditampilkan
  let fontsToDisplay = isFavoritesOnly 
    ? filteredFonts.filter(font => isFontFavorite(font.id))
    : filteredFonts;
  
  // Cek jika tidak ada hasil
  if (fontsToDisplay.length === 0) {
    showState(isFavoritesOnly ? 'favoritesOnly' : 'noResults');
    return;
  }
  
  // Tampilkan grid
  showState('grid');
  DOM.fontCountBadge.textContent = `${fontsToDisplay.length} Style Tersedia`;
  
  // Generate card untuk setiap font
  fontsToDisplay.forEach(font => {
    const fontCard = createFontCard(font);
    DOM.fontGrid.appendChild(fontCard);
  });
}

/**
 * Fungsi untuk membuat elemen card font
 * @param {Object} font - Data font dari fonts-data.js
 * @returns {HTMLElement} Elemen card font
 */
function createFontCard(font) {
  // Buat elemen card
  const card = document.createElement('div');
  card.className = 'font-card';
  card.dataset.fontId = font.id;
  
  // Generate teks hasil konversi
  const convertedText = font.converter(currentText);
  
  // Isi konten card
  card.innerHTML = `
    <div class="font-preview">${convertedText}</div>
    <div class="font-info">
      <h4 class="font-name">${font.name}</h4>
      <span class="font-category">${font.category}</span>
    </div>
    <div class="font-actions">
      <button class="copy-btn" aria-label="Copy ${font.name}">
        <i class="fas fa-copy"></i>
      </button>
      <button class="favorite-btn ${isFontFavorite(font.id) ? 'active' : ''}" 
              aria-label="${isFontFavorite(font.id) ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}">
        <i class="fas ${isFontFavorite(font.id) ? 'fa-star' : 'fa-star-o'}"></i>
      </button>
    </div>
  `;
  
  // Tambahkan event listener ke tombol copy
  const copyBtn = card.querySelector('.copy-btn');
  copyBtn.addEventListener('click', () => copyToClipboard(convertedText, font.name));
  
  // Tambahkan event listener ke tombol favorite
  const favBtn = card.querySelector('.favorite-btn');
  favBtn.addEventListener('click', (e) => toggleFavorite(e, font.id));
  
  // Tambahkan animasi hover pada card
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
  });
  
  return card;
}

/**
 * Fungsi untuk menampilkan state tertentu (grid atau empty state)
 * @param {string} state - Nama state: 'emptyGrid', 'noResults', 'favoritesOnly', 'grid'
 */
function showState(state) {
  // Sembunyikan semua state
  DOM.emptyGridState.classList.add('hidden');
  DOM.noResultsState.classList.add('hidden');
  DOM.favoritesOnlyState.classList.add('hidden');
  DOM.fontGrid.classList.add('hidden');
  
  // Tampilkan state yang dipilih
  switch(state) {
    case 'emptyGrid':
      DOM.emptyGridState.classList.remove('hidden');
      DOM.fontCountBadge.textContent = '0 Style Tersedia';
      break;
    case 'noResults':
      DOM.noResultsState.classList.remove('hidden');
      break;
    case 'favoritesOnly':
      DOM.favoritesOnlyState.classList.remove('hidden');
      break;
    case 'grid':
      DOM.fontGrid.classList.remove('hidden');
      break;
  }
}

// ==============================================
// 4. COPY TO CLIPBOARD FUNCTIONS
// ==============================================
/**
 * Fungsi untuk menyalin teks ke clipboard
 * @param {string} text - Teks yang akan dicopy
 * @param {string} fontName - Nama font untuk feedback
 */
async function copyToClipboard(text, fontName) {
  try {
    // Gunakan Clipboard API modern
    await navigator.clipboard.writeText(text);
    
    // Tampilkan feedback sukses
    showToast(`✅ ${fontName} berhasil dicopy!`);
    
    // Tambahkan animasi pada tombol yang diklik
    const activeBtn = document.activeElement;
    activeBtn.innerHTML = '<i class="fas fa-check"></i>';
    activeBtn.classList.add('copied');
    
    setTimeout(() => {
      activeBtn.innerHTML = '<i class="fas fa-copy"></i>';
      activeBtn.classList.remove('copied');
    }, 1500);
  } catch (err) {
    // Fallback jika Clipboard API tidak tersedia
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Tampilkan feedback sukses fallback
    showToast(`✅ ${fontName} berhasil dicopy!`);
  }
}

/**
 * Fungsi untuk menyalin semua style font sekaligus
 */
async function copyAllFonts() {
  if (!currentText || filteredFonts.length === 0) {
    showToast('⚠️ Tidak ada teks atau style untuk dicopy!');
    return;
  }
  
  // Siapkan teks yang akan dicopy
  let allText = "=== GENERATOR TEKS KEREN - SEMUA STYLE ===\n\n";
  
  // Tambahkan setiap style dengan nama font
  filteredFonts.forEach(font => {
    allText += `[${font.name}]\n${font.converter(currentText)}\n\n`;
  });
  
  allText += "=== DIBUAT DENGAN TEKSKEREN.ID ===";
  
  try {
    await navigator.clipboard.writeText(allText);
    showToast(`✅ Semua ${filteredFonts.length} style berhasil dicopy!`);
    
    // Animasi tombol copy all
    DOM.copyAllBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
    DOM.copyAllBtn.classList.add('copied');
    
    setTimeout(() => {
      DOM.copyAllBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Semua Style';
      DOM.copyAllBtn.classList.remove('copied');
    }, 2000);
  } catch (err) {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = allText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    showToast(`✅ Semua ${filteredFonts.length} style berhasil dicopy!`);
  }
}

/**
 * Fungsi untuk menampilkan toast notification
 * @param {string} message - Pesan yang akan ditampilkan
 */
function showToast(message) {
  // Cek apakah toast sudah ada
  let toast = document.getElementById('toast-notification');
  
  if (!toast) {
    // Buat elemen toast baru
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set pesan dan tampilkan
  toast.textContent = message;
  toast.classList.add('show');
  
  // Sembunyikan setelah beberapa detik
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ==============================================
// 5. RANDOM STYLE GENERATOR
// ==============================================
/**
 * Fungsi untuk menghasilkan teks dengan style acak
 */
function generateRandomStyle() {
  if (!currentText || filteredFonts.length === 0) {
    showToast('⚠️ Masukkan teks dulu untuk generate style acak!');
    return;
  }
  
  // Pilih font secara acak
  const randomIndex = Math.floor(Math.random() * filteredFonts.length);
  const randomFont = filteredFonts[randomIndex];
  const randomText = randomFont.converter(currentText);
  
  // Tampilkan di preview
  DOM.realtimePreview.innerHTML = `
    <span class="random-label">Style Acak: ${randomFont.name}</span><br>
    ${randomText}
  `;
  
  // Salin ke clipboard otomatis
  copyToClipboard(randomText, randomFont.name);
  
  // Tambahkan animasi pada tombol random
  const activeBtn = event.target.id === 'mobile-random-btn' 
    ? DOM.mobileRandomBtn 
    : DOM.randomStyleBtn;
  
  activeBtn.innerHTML = '<i class="fas fa-shuffle"></i> Berhasil!';
  activeBtn.classList.add('active');
  
  setTimeout(() => {
    activeBtn.innerHTML = '<i class="fas fa-random"></i> Random Style';
    activeBtn.classList.remove('active');
  }, 1500);
}

// ==============================================
// 6. FAVORITES HELPER FUNCTIONS (BASE)
// ==============================================
/**
 * Fungsi untuk mengecek apakah font ada di favorit
 * @param {string} fontId - ID font yang akan diperiksa
 * @returns {boolean} True jika ada di favorit
 */
function isFontFavorite(fontId) {
  const favorites = getFavoritesFromStorage();
  return favorites.includes(fontId);
}

/**
 * Fungsi untuk mengambil data favorit dari localStorage
 * @returns {Array} Array ID font favorit
 */
function getFavoritesFromStorage() {
  const stored = localStorage.getItem('textKerenFavorites');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Fungsi untuk memperbarui tampilan jumlah favorit
 */
function updateFavoritesCount() {
  const count = getFavoritesFromStorage().length;
  DOM.favCount.textContent = count;
}

// ==============================================
// 7. INITIALIZATION & EVENT LISTENERS
// ==============================================
/**
 * Fungsi untuk menginisialisasi aplikasi
 */
function initApp() {
  // Set awal filteredFonts sama dengan allFonts
  filteredFonts = [...allFonts];
  
  // Update jumlah favorit
  updateFavoritesCount();
  
  // Set mode awal berdasarkan preferensi pengguna
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark-mode');
    updateModeToggleText();
  }
  
  // Event Listeners untuk Input
  DOM.textInput.addEventListener('input', handleTextInput);
  DOM.clearInputBtn.addEventListener('click', clearTextInput);
  
  // Event Listeners untuk Copy
  DOM.copyAllBtn.addEventListener('click', copyAllFonts);
  
  // Event Listeners untuk Random
  DOM.randomStyleBtn.addEventListener('click', generateRandomStyle);
  DOM.mobileRandomBtn.addEventListener('click', generateRandomStyle);
  
  // Event Listeners untuk Mobile Menu
  DOM.hamburgerToggle.addEventListener('click', () => {
    DOM.mobileMenu.classList.toggle('hidden');
    const icon = DOM.hamburgerToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
  
  // Event Listeners untuk Search Input
  DOM.fontSearch.addEventListener('input', handleSearch);
  DOM.clearSearchBtn.addEventListener('click', clearSearch);
  
  // Event Listeners untuk Category Tabs Scroll
  DOM.scrollTabsLeft.addEventListener('click', () => {
    DOM.categoryTabs.scrollBy({ left: -200, behavior: 'smooth' });
  });
  
  DOM.scrollTabsRight.addEventListener('click', () => {
    DOM.categoryTabs.scrollBy({ left: 200, behavior: 'smooth' });
  });
  
  // Event Listeners untuk Category Tabs
  DOM.categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => handleCategoryChange(tab.dataset.category));
  });
  
  // Event Listeners untuk Mode Toggle
  DOM.modeToggle.addEventListener('click', toggleDarkMode);
  DOM.mobileModeToggle.addEventListener('click', toggleDarkMode);
  
  // Event Listener untuk View Favorites
  DOM.viewFavoritesBtn.addEventListener('click', toggleFavoritesView);
  
  // Event Listener untuk resize window
  window.addEventListener('resize', handleWindowResize);
  
  // Inisialisasi grid pertama kali
  handleTextInput();
}

/**
 * Fungsi untuk menangani perubahan ukuran window
 */
function handleWindowResize() {
  // Sesuaikan tampilan mobile menu saat window diresize
  if (window.innerWidth >= 992 && !DOM.mobileMenu.classList.contains('hidden')) {
    DOM.mobileMenu.classList.add('hidden');
    const icon = DOM.hamburgerToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
}

/**
 * Fungsi sementara untuk handler yang akan dilengkapi di Tahap 4
 * (Untuk mencegah error saat runtime)
 */
function handleSearch() { filteredFonts = [...allFonts]; updateFontGrid(); }
function clearSearch() { DOM.fontSearch.value = ""; handleSearch(); }
function handleCategoryChange() { filteredFonts = [...allFonts]; updateFontGrid(); }
function toggleDarkMode() { document.documentElement.classList.toggle('dark-mode');
/* ==============================================
  * TAHAP 4: JAVASCRIPT LANJUTAN
  * Generator Teks Keren untuk TikTok & Social Media
  * Versi: 1.0.0
  * Author: Diberikan oleh Dola (ex-Cici)
  * Tanggal: 21 Februari 2026
  * Total Baris (Bagian 2): ±620 baris
  ============================================== */

// Lanjutan dari script.js bagian 1

// ==============================================
// 8. FAVORITES FULL FUNCTIONALITY
// ==============================================
/**
 * Fungsi untuk menambah/menghapus font dari favorit
 * @param {Event} e - Event klik tombol favorite
 * @param {string} fontId - ID font yang akan di-toggle
 */
function toggleFavorite(e, fontId) {
  const favorites = getFavoritesFromStorage();
  const btn = e.currentTarget;
  const icon = btn.querySelector('i');

  if (favorites.includes(fontId)) {
    // Hapus dari favorit
    const updatedFavorites = favorites.filter(id => id !== fontId);
    localStorage.setItem('textKerenFavorites', JSON.stringify(updatedFavorites));
    icon.classList.remove('fa-star');
    icon.classList.add('fa-star-o');
    btn.setAttribute('aria-label', 'Simpan ke Favorit');
    showToast('❌ Dihapus dari Favorit!');
  } else {
    // Tambahkan ke favorit
    favorites.push(fontId);
    localStorage.setItem('textKerenFavorites', JSON.stringify(favorites));
    icon.classList.remove('fa-star-o');
    icon.classList.add('fa-star');
    btn.setAttribute('aria-label', 'Hapus dari Favorit');
    showToast('⭐ Ditambahkan ke Favorit!');
  }

  // Update jumlah favorit dan grid jika sedang di mode favorit
  updateFavoritesCount();
  if (isFavoritesOnly) updateFontGrid();
}

/**
 * Fungsi untuk mengaktifkan/menonaktifkan tampilan hanya favorit
 */
function toggleFavoritesView() {
  isFavoritesOnly = !isFavoritesOnly;
  const btn = DOM.viewFavoritesBtn;

  if (isFavoritesOnly) {
    btn.innerHTML = '<i class="fas fa-times"></i> Tampilkan Semua';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    showToast('🔍 Menampilkan Hanya Style Favorit!');
  } else {
    btn.innerHTML = '<i class="fas fa-bookmark"></i> Lihat Favorit';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
    showToast('🔍 Menampilkan Semua Style!');
  }

  // Reset search dan filter agar konsisten
  DOM.fontSearch.value = "";
  DOM.categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.category === 'all') tab.classList.add('active');
  });

  filteredFonts = [...allFonts];
  updateFontGrid();
}

// ==============================================
// 9. SEARCH & FILTER FUNCTIONALITY
// ==============================================
/**
 * Fungsi untuk menangani pencarian font
 */
function handleSearch() {
  const searchQuery = DOM.fontSearch.value.toLowerCase().trim();
  const activeCategory = document.querySelector('.category-tab.active').dataset.category;

  filterFonts(activeCategory, searchQuery);
}

/**
 * Fungsi untuk menghapus input pencarian
 */
function clearSearch() {
  DOM.fontSearch.value = "";
  const activeCategory = document.querySelector('.category-tab.active').dataset.category;
  filterFonts(activeCategory, "");
}

/**
 * Fungsi untuk menangani perubahan kategori
 * @param {string} category - Kategori yang dipilih
 */
function handleCategoryChange(category) {
  // Update tampilan tab aktif
  DOM.categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.category === category) tab.classList.add('active');
  });

  // Filter font berdasarkan kategori dan query pencarian
  const searchQuery = DOM.fontSearch.value.toLowerCase().trim();
  filterFonts(category, searchQuery);
}

/**
 * Fungsi utama untuk memfilter font
 * @param {string} category - Kategori yang dipilih
 * @param {string} searchQuery - Kata kunci pencarian
 */
function filterFonts(category, searchQuery) {
  filteredFonts = allFonts.filter(font => {
    // Filter berdasarkan kategori
    const matchesCategory = category === 'all' || font.category.toLowerCase() === category.toLowerCase();
    
    // Filter berdasarkan pencarian (nama atau kategori)
    const matchesSearch = font.name.toLowerCase().includes(searchQuery) || 
                          font.category.toLowerCase().includes(searchQuery);
    
    return matchesCategory && matchesSearch;
  });

  // Update grid setelah filter
  updateFontGrid();

  // Tambahkan animasi pada search input saat ada hasil
  if (searchQuery && filteredFonts.length > 0) {
    DOM.fontSearch.classList.add('search-success');
    setTimeout(() => DOM.fontSearch.classList.remove('search-success'), 800);
  }
}

// ==============================================
// 10. DARK/LIGHT MODE TOGGLE
// ==============================================
/**
 * Fungsi untuk mengubah mode tampilan (dark/light)
 */
function toggleDarkMode() {
  const html = document.documentElement;
  html.classList.toggle('dark-mode');
  
  // Simpan preferensi mode ke localStorage
  const isDarkMode = html.classList.contains('dark-mode');
  localStorage.setItem('textKerenMode', isDarkMode ? 'dark' : 'light');
  
  // Update teks dan ikon tombol toggle
  updateModeToggleText();
  
  // Tampilkan feedback
  showToast(isDarkMode ? '🌙 Mode Gelap Aktif!' : '☀️ Mode Terang Aktif!');
}

/**
 * Fungsi untuk memperbarui teks dan ikon tombol mode toggle
 */
function updateModeToggleText() {
  const isDarkMode = document.documentElement.classList.contains('dark-mode');
  const desktopIcon = DOM.modeToggle.querySelector('i');
  const desktopText = DOM.modeToggle.querySelector('.btn-text');
  const mobileIcon = DOM.mobileModeToggle.querySelector('i');
  const mobileText = DOM.mobileModeToggle.querySelector('.btn-text');

  if (isDarkMode) {
    desktopIcon.classList.remove('fa-moon');
    desktopIcon.classList.add('fa-sun');
    desktopText.textContent = 'Light Mode';
    
    mobileIcon.classList.remove('fa-moon');
    mobileIcon.classList.add('fa-sun');
    mobileText.textContent = 'Light Mode';
  } else {
    desktopIcon.classList.remove('fa-sun');
    desktopIcon.classList.add('fa-moon');
    desktopText.textContent = 'Dark Mode';
    
    mobileIcon.classList.remove('fa-sun');
    mobileIcon.classList.add('fa-moon');
    mobileText.textContent = 'Dark Mode';
  }
}

/**
 * Fungsi untuk memuat preferensi mode dari localStorage
 */
function loadModePreference() {
  const savedMode = localStorage.getItem('textKerenMode');
  const html = document.documentElement;

  if (savedMode === 'dark') {
    html.classList.add('dark-mode');
  } else if (savedMode === 'light') {
    html.classList.remove('dark-mode');
  } else {
    // Gunakan preferensi sistem jika tidak ada yang disimpan
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark-mode');
    }
  }

  updateModeToggleText();
}

// ==============================================
// 11. RANDOM STYLE ENHANCEMENTS
// ==============================================
/**
 * Fungsi untuk menghasilkan beberapa style acak sekaligus
 * (Tambahan fitur untuk variasi)
 */
function generateMultipleRandomStyles(count = 3) {
  if (!currentText || filteredFonts.length === 0) {
    showToast('⚠️ Masukkan teks dulu untuk generate style acak!');
    return;
  }

  if (count > filteredFonts.length) count = filteredFonts.length;
  
  let randomText = "=== STYLE ACAK PILIHAN ===\n\n";
  
  // Ambil style acak tanpa duplikat
  const shuffled = [...filteredFonts].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  selected.forEach((font, index) => {
    randomText += `${index + 1}. [${font.name}]\n${font.converter(currentText)}\n\n`;
  });
  
  // Salin ke clipboard
  navigator.clipboard.writeText(randomText)
    .then(() => showToast(`✅ ${count} style acak berhasil dicopy!`))
    .catch(err => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = randomText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`✅ ${count} style acak berhasil dicopy!`);
    });
}

// Tambahkan event listener untuk double klik tombol random
DOM.randomStyleBtn.addEventListener('dblclick', () => generateMultipleRandomStyles());
DOM.mobileRandomBtn.addEventListener('dblclick', () => generateMultipleRandomStyles());

// ==============================================
// 12. CATEGORY TABS ENHANCEMENTS
// ==============================================
/**
 * Fungsi untuk menangani scroll otomatis pada category tabs
 * saat ada tab yang tidak terlihat
 */
function checkTabScrollVisibility() {
  const tabsContainer = DOM.categoryTabs;
  const leftBtn = DOM.scrollTabsLeft;
  const rightBtn = DOM.scrollTabsRight;

  // Tampilkan/sembunyikan tombol scroll berdasarkan posisi
  leftBtn.classList.toggle('hidden', tabsContainer.scrollLeft <= 0);
  rightBtn.classList.toggle('hidden', tabsContainer.scrollLeft + tabsContainer.clientWidth >= tabsContainer.scrollWidth - 10);
}

// Tambahkan event listener untuk scroll pada category tabs
DOM.categoryTabs.addEventListener('scroll', checkTabScrollVisibility);

// Panggil saat inisialisasi
window.addEventListener('load', checkTabScrollVisibility);
window.addEventListener('resize', checkTabScrollVisibility);

// ==============================================
// 13. ADDITIONAL ENHANCEMENTS
// ==============================================
/**
 * Fungsi untuk menangani shortcut keyboard
 */
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + A = Select all input text
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    DOM.textInput.select();
    e.preventDefault();
  }
  
  // Ctrl/Cmd + C = Copy semua style
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    if (document.activeElement !== DOM.textInput) {
      copyAllFonts();
      e.preventDefault();
    }
  }
  
  // Ctrl/Cmd + R = Generate style acak
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    generateRandomStyle();
    e.preventDefault();
  }
  
  // Ctrl/Cmd + F = Fokus ke search input
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    DOM.fontSearch.focus();
    e.preventDefault();
  }
  
  // Ctrl/Cmd + D = Toggle dark mode
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    toggleDarkMode();
    e.preventDefault();
  }
}

// Tambahkan event listener untuk keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);

/**
 * Fungsi untuk memuat data font dari fonts-data.js
 * @param {Array} fontsData - Array data font dari fonts-data.js
 */
function loadFontsData(fontsData) {
  allFonts = [...fontsData];
  filteredFonts = [...allFonts];
  
  // Update jumlah font di badge
  DOM.fontCountBadge.textContent = `${allFonts.length} Style Tersedia`;
  
  // Inisialisasi grid setelah data dimuat
  handleTextInput();
}

/**
 * Fungsi untuk menambahkan animasi pada elemen saat di-scroll
 */
function addScrollAnimations() {
  const elements = document.querySelectorAll('.card, .section-heading, .empty-state');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => observer.observe(el));
}

// ==============================================
// 14. UPDATED INITIALIZATION FUNCTION
// ==============================================
/**
 * Fungsi untuk menginisialisasi aplikasi secara lengkap
 */
function initApp() {
  // Muat preferensi mode dari localStorage
  loadModePreference();
  
  // Set awal filteredFonts sama dengan allFonts
  filteredFonts = [...allFonts];
  
  // Update jumlah favorit
  updateFavoritesCount();
  
  // Event Listeners untuk Input
  DOM.textInput.addEventListener('input', handleTextInput);
  DOM.clearInputBtn.addEventListener('click', clearTextInput);
  
  // Event Listeners untuk Copy
  DOM.copyAllBtn.addEventListener('click', copyAllFonts);
  
  // Event Listeners untuk Random
  DOM.randomStyleBtn.addEventListener('click', generateRandomStyle);
  DOM.mobileRandomBtn.addEventListener('click', generateRandomStyle);
  
  // Event Listeners untuk Mobile Menu
  DOM.hamburgerToggle.addEventListener('click', () => {
    DOM.mobileMenu.classList.toggle('hidden');
    const icon = DOM.hamburgerToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
  
  // Event Listeners untuk Search Input
  DOM.fontSearch.addEventListener('input', handleSearch);
  DOM.clearSearchBtn.addEventListener('click', clearSearch);
  
  // Event Listeners untuk Category Tabs Scroll
  DOM.scrollTabsLeft.addEventListener('click', () => {
    DOM.categoryTabs.scrollBy({ left: -200, behavior: 'smooth' });
  });
  
  DOM.scrollTabsRight.addEventListener('click', () => {
    DOM.categoryTabs.scrollBy({ left: 200, behavior: 'smooth' });
  });
  
  // Event Listeners untuk Category Tabs
  DOM.categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => handleCategoryChange(tab.dataset.category));
  });
  
  // Event Listeners untuk Mode Toggle
  DOM.modeToggle.addEventListener('click', toggleDarkMode);
  DOM.mobileModeToggle.addEventListener('click', toggleDarkMode);
  
  // Event Listener untuk View Favorites
  DOM.viewFavoritesBtn.addEventListener('click', toggleFavoritesView);
  
  // Event Listener untuk resize window
  window.addEventListener('resize', handleWindowResize);
  
  // Event Listener untuk scroll animations
  window.addEventListener('load', addScrollAnimations);
  
  // Inisialisasi grid pertama kali
  handleTextInput();
  
  // Tampilkan pesan sukses inisialisasi di console
  console.log('✅ Aplikasi Generator Teks Keren berhasil diinisialisasi!');
  console.log(`ℹ️ Total style font tersedia: ${allFonts.length}`);
}

// ==============================================
// 15. RUN APPLICATION WHEN DOM IS LOADED
// ==============================================
// Pastikan DOM sudah selesai dimuat sebelum menjalankan aplikasi
document.addEventListener('DOMContentLoaded', () => {
  // Tunggu sebentar agar fonts-data.js selesai dimuat
  setTimeout(() => {
    if (typeof allFontsData !== 'undefined') {
      loadFontsData(allFontsData);
      initApp();
    } else {
      console.error('❌ Error: Data font tidak ditemukan! Pastikan fonts-data.js sudah dimuat.');
      DOM.emptyGridState.innerHTML = `
        <i class="fas fa-exclamation-triangle fa-5x"></i>
        <h4>Error Memuat Data Font!</h4>
        <p>Silakan pastikan file <code>fonts-data.js</code> sudah terhubung dengan benar.</p>
      `;
    }
  }, 100);
});

// ==============================================
// CSS FOR DYNAMIC ELEMENTS (TOAST, ANIMATIONS)
// ==============================================
// Tambahkan style untuk toast dan animasi secara dinamis
const dynamicStyles = `
  /* Toast Notification */
  #toast-notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: var(--color-primary);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--glow-effect);
    z-index: 1000;
    opacity: 0;
    transform: translateY(20px);
    transition: all var(--transition-medium);
  }

  #toast-notification.show {
    opacity: 1;
    transform: translateY(
