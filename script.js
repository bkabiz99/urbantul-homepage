// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array]; // Create a shallow copy to avoid modifying original array directly
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
}


// Fungsi untuk menampilkan aroma (digunakan untuk Karakter, Inspired, dan Best Seller)
function displayAromas(aromas, containerId, nameProperty = 'namaBesar', limit = Infinity) {
    const container = document.getElementById(containerId);
    if (!container) return; 

    container.innerHTML = ''; 

    const aromasToDisplay = aromas.slice(0, limit);

    const imagePathPrefixInspired = 'assets/aromaInspired/'; // Prefix untuk gambar Inspired
    const imagePathPrefixKarakter = 'assets/aromaKarakter/'; // Prefix untuk gambar Karakter (jika ada)
    const imagePathPrefixBestSeller = 'assets/bestSellers/'; // Prefix untuk gambar Best Seller (jika ada)

    aromasToDisplay.forEach(aroma => {
        const aromaCard = document.createElement('div');
        // Untuk best seller, kita ingin class 'product-card'
        // Untuk aroma karakter/inspired, kita ingin class 'aroma-card'
        aromaCard.classList.add(containerId.includes('bestSellerGrid') ? 'product-card' : 'aroma-card');

        // Untuk gambar, kita akan menyesuaikan class-nya
        const aromaImageContainer = document.createElement('div');
        if (containerId.includes('bestSellerGrid')) {
            aromaImageContainer.classList.add('product-image'); // Untuk Best Seller
            // Menggunakan properti 'image' jika tersedia, jika tidak, fall back ke 'no'
            const imageUrl = aroma.image ? aroma.image : `${imagePathPrefixBestSeller}${aroma.no}.jpg`; 
            aromaImageContainer.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            aromaImageContainer.classList.add('aroma-icon'); // Untuk Karakter/Inspired
            let imageUrl;
            if (containerId.includes('inspiredAromaGrid')) {
                // Untuk Aroma Inspired, gunakan 'no' dari data dan prefix yang benar
                imageUrl = `${imagePathPrefixInspired}${aroma.no}.jpg`; 
            } else if (containerId.includes('karakterAromaGrid')) {
                // Untuk Aroma Karakter, gunakan 'no' atau properti gambar lain jika ada
                imageUrl = `${imagePathPrefixKarakter}${aroma.no}.jpg`; // Asumsi ada gambar untuk karakter juga
            } else {
                imageUrl = 'assets/images/placeholder.jpg'; // Gambar placeholder jika tidak ada
            }
            aromaImageContainer.style.backgroundImage = `url('${imageUrl}')`;
        }
        
        aromaImageContainer.style.backgroundSize = 'cover'; // Pastikan gambar menutupi area
        aromaImageContainer.style.backgroundPosition = 'center'; // Pusatkan gambar

        const aromaName = document.createElement('p');
        // Untuk nama, kita juga perlu menyesuaikan class-nya
        aromaName.classList.add(containerId.includes('bestSellerGrid') ? 'product-name' : 'aroma-name');
        
        aromaName.textContent = aroma[nameProperty];

        aromaCard.appendChild(aromaImageContainer); // Gunakan container gambar yang baru
        aromaCard.appendChild(aromaName);
        container.appendChild(aromaCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Logika Sidebar
    const hamburger = document.querySelector('.hamburger-menu-icon');
    const sidebar = document.querySelector('.sidebar-menu');
    const closeSidebarButton = document.querySelector('.close-sidebar-button');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.add('open');
            menuOverlay.classList.add('active');
        });
    }

    if (closeSidebarButton) {
        closeSidebarButton.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuOverlay.classList.remove('active');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuOverlay.classList.remove('active');
        });
    }

// Logika menampilkan aroma di berbagai halaman
const currentPage = window.location.pathname.split('/').pop();

if (currentPage === 'index.html' || currentPage === '') { // Jika di halaman utama
    // Tampilkan 12 aroma Karakter di index.html (diacak, tampilkan namaBesar)
    if (document.getElementById('karakterAromaGrid')) {
        const shuffledKarakter = shuffleArray(karakterAromas); // TETAP DIACAK UNTUK HALAMAN UTAMA
        displayAromas(shuffledKarakter, 'karakterAromaGrid', 'namaBesar', 12); 
    }
    // Tampilkan 12 aroma Inspired di index.html (diacak, tampilkan namaKecil)
    if (document.getElementById('inspiredAromaGrid')) {
        const shuffledInspired = shuffleArray(inspiredAromas); // TETAP DIACAK UNTUK HALAMAN UTAMA
        displayAromas(shuffledInspired, 'inspiredAromaGrid', 'namaKecil', 12);
    }
    // Tampilkan 12 Best Seller di index.html (TIDAK DIACAK, tampilkan namaKecil)
    if (document.getElementById('bestSellerGrid')) {
        displayAromas(bestSellers, 'bestSellerGrid', 'namaKecil', 12); // <-- Tanpa shuffle
    }
} else if (currentPage === 'aroma-karakter.html') {
    // Tampilkan SEMUA aroma Karakter di halaman khusus (URUTKAN ABJAD A-Z)
    if (document.getElementById('karakterAromaGridFull')) {
        // Urutkan aroma Karakter secara abjad berdasarkan namaBesar
        const sortedKarakter = [...karakterAromas].sort((a, b) => {
            const nameA = a.namaBesar.toLowerCase();
            const nameB = b.namaBesar.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        displayAromas(sortedKarakter, 'karakterAromaGridFull', 'namaBesar');
    }
} else if (currentPage === 'aroma-inspired.html') {
    // Tampilkan SEMUA aroma Inspired di halaman khusus (URUTKAN ABJAD A-Z)
    if (document.getElementById('inspiredAromaGridFull')) {
        // Urutkan aroma Inspired secara abjad berdasarkan namaKecil
        const sortedInspired = [...inspiredAromas].sort((a, b) => {
            const nameA = a.namaKecil.toLowerCase();
            const nameB = b.namaKecil.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        displayAromas(sortedInspired, 'inspiredAromaGridFull', 'namaKecil');
    }
}
    });
