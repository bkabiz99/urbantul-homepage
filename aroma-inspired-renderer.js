// aroma-inspired-renderer.js

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan inspiredAromas sudah tersedia dari aromas_data.js
    if (typeof inspiredAromas === 'undefined' || !Array.isArray(inspiredAromas)) {
        console.error("Kesalahan: 'inspiredAromas' tidak ditemukan atau bukan array. Pastikan data/aromas_data.js dimuat duluan di HTML.");
        return;
    }

    // PENTING: Pastikan aromaClassifier.js dimuat sebelum ini dan mengekspos fungsi-fungsi berikut ke global scope,
    // atau kamu bisa melakukan import/module pattern yang lebih rapi.
    // Untuk saat ini, kita asumsikan getAromaCategoriesForBooster dan categoryDisplayMap tersedia secara global.
    if (typeof getAromaCategoriesForBooster === 'undefined' || typeof categoryDisplayMap === 'undefined') {
        console.error("Kesalahan: 'getAromaCategoriesForBooster' atau 'categoryDisplayMap' tidak ditemukan. Pastikan aromaClassifier.js dimuat dengan benar.");
        return;
    }

    const aromaListContainer = document.getElementById('aroma-inspired-list'); 
    const imagePathPrefix = 'assets/aromaInspired/'; 

    const creamPastelColors = [
        '#FFDDC1', // Light Peach Cream
        '#FFABAB', // Light Pink Cream
        '#FFF3B0', // Pale Yellow Cream
        '#CCEECC', // Light Green Cream
        '#B0E0E6', // Powder Blue Cream
        '#D8BFD8', // Thistle Cream (Light Purple)
        '#FFC0CB', // Pastel Pink
        '#FFE4E1', // Misty Rose (Very Light Pink)
        '#F0FFF0', // Honeydew (Very Light Green)
        '#F5F5DC', // Beige (Classic Cream)
        '#E6E6FA', // Lavender Blush (Light Purple-Pink)
        '#F0FFFF', // Azure (Very Light Blue)
        '#FAEBD7', // Antique White (Off-white Cream)
        '#FFFAF0', // Floral White (Off-white Cream)
        '#FFFACD', // Lemon Chiffon (Light Yellow)
        '#AFEEEE', // Pale Turquoise (Light Blue-Green)
        '#BFEFFF', // Sky Blue (Very Light Sky Blue)
        '#FFEFD5', // Papaya Whip (Light Orange-Yellow Cream)
        '#FFDAB9', // Peach Puff (Light Peach)
        '#FFEBCD'  // Blanched Almond (Light Orange-Brown Cream)
    ];

    function renderAromas(aromasToRender) {
        aromaListContainer.innerHTML = ''; 

        if (aromasToRender.length === 0) {
            aromaListContainer.innerHTML = '<p style="text-align: center; width: 100%;">Maaf, tidak ada aroma yang ditemukan.</p>';
            return;
        }

        aromasToRender.forEach((aroma, index) => {
            const aromaCard = document.createElement('div');
            aromaCard.classList.add('aroma-card'); 

            const backgroundColor = creamPastelColors[index % creamPastelColors.length];
            aromaCard.style.backgroundColor = backgroundColor;

            const imageUrl = `${imagePathPrefix}${aroma.no}.jpg`; 

            // Menentukan Kelas Aroma secara dinamis
            const allCategories = getAromaCategoriesForBooster(aroma); 
            let displayCategories = [];

            if (allCategories.length > 0) {
                displayCategories = allCategories.slice(0, 2); 
            }
            
            let categoriesHtml = '';
            if (displayCategories.length > 0) {
                const displayNames = displayCategories.map(cat => categoryDisplayMap[cat] || cat);
                categoriesHtml = `Kelas Aroma : <strong>${displayNames.join(', ')}</strong>`; // Hapus <br> di sini
            } else {
                categoriesHtml = `Kelas Aroma : <strong>N/A</strong>`;
            }

            // --- PERUBAHAN UTAMA ADA DI SINI: STRUKTUR notesDiv ---
            // Menggabungkan semua notes ke dalam satu div class="aroma-notes"
            aromaCard.innerHTML = `
                <h3>${aroma.namaKecil || 'Nama Tidak Tersedia'}</h3>
                <img src="${imageUrl}" alt="${aroma.namaBesar || aroma.namaKecil}" class="aroma-card-image" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                <div class="aroma-notes">
                    ${categoriesHtml}<br>
                    Top: ${aroma.topNote || 'N/A'}<br>
                    Middle: ${aroma.middleNote || 'N/A'}<br>
                    Base: ${aroma.baseNote || 'N/A'}
                </div>
            `;
            // --- AKHIR PERUBAHAN UTAMA ---

            aromaListContainer.appendChild(aromaCard);
        });
    }

    renderAromas(inspiredAromas);

    // --- Fungsionalitas Pencarian (Tidak ada perubahan di sini, sudah benar) ---
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    if (searchInput && searchButton) {
        const performSearch = () => {
            const query = searchInput.value.toLowerCase();
            const filteredAromas = inspiredAromas.filter(aroma => {
                const dynamicCategories = getAromaCategoriesForBooster(aroma).map(cat => categoryDisplayMap[cat] || cat);
                const allAromaText = `${aroma.namaKecil || ''} ${aroma.namaBesar || ''} ${aroma.topNote || ''} ${aroma.middleNote || ''} ${aroma.baseNote || ''} ${dynamicCategories.join(' ')}`.toLowerCase();
                return allAromaText.includes(query);
            });
            renderAromas(filteredAromas);
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                performSearch();
            }
        });
    }
});
