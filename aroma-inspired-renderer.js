// aroma-inspired-renderer.js (di root utama, seperti yang Anda jelaskan)

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan inspiredAromas sudah dimuat
    if (typeof inspiredAromas === 'undefined') {
        console.error("Kesalahan: 'inspiredAromas' tidak ditemukan. Pastikan data/aromas_data.js dimuat sebelum aroma-inspired-renderer.js.");
        return;
    }

    // Pastikan createAromaCardHTML tersedia dari aromaClassifier.js
    // Ini sangat penting! Jika fungsi ini tidak ada, berarti aromaClassifier.js belum dimuat atau ada masalah.
    if (typeof createAromaCardHTML === 'undefined') {
        console.error("Kesalahan: 'createAromaCardHTML' tidak ditemukan. Pastikan aromaClassifier.js dimuat sebelum aroma-inspired-renderer.js.");
        return;
    }

    const aromaListContainer = document.getElementById('aroma-list-container');
    // Path gambar: Asumsi ada folder 'assets/aromaInspired/' di root
    // Dan nama filenya menggunakan aroma.imageFileName (jika ada di data) atau aroma.no.jpg
    const defaultImagePathPrefix = 'assets/aromaInspired/';

    // Fungsi render aroma yang sekarang akan menggunakan createAromaCardHTML
    function renderAromas(aromasToRender) {
        aromaListContainer.innerHTML = ''; // Bersihkan kontainer

        // Urutkan aroma berdasarkan namaKecil secara alfabetis
        const sortedAromas = [...aromasToRender].sort((a, b) => {
            const nameA = (a.namaKecil || a.namaBesar || '').toLowerCase();
            const nameB = (b.namaKecil || b.namaBesar || '').toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        sortedAromas.forEach((aroma) => {
            // Panggil fungsi universal createAromaCardHTML
            // Pass image path prefix yang spesifik untuk halaman ini
            const aromaCardElement = createAromaCardHTML(aroma, defaultImagePathPrefix);
            aromaListContainer.appendChild(aromaCardElement);
        });
    }

    // Inisialisasi tampilan aroma
    renderAromas(inspiredAromas);

    // Fitur pencarian (opsional, jika Anda ingin menambahkannya)
    const searchInput = document.getElementById('search-input'); // Asumsi ada elemen dengan ID ini
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredAromas = inspiredAromas.filter(aroma => {
                const combinedText = `${aroma.namaKecil || ''} ${aroma.namaBesar || ''} ${aroma.topNote || ''} ${aroma.middleNote || ''} ${aroma.baseNote || ''}`.toLowerCase();
                const dominantCategories = getDominantCategoriesFromNotes(aroma).map(cat => categoryDisplayMap[cat] || cat).join(' ').toLowerCase();
                return combinedText.includes(searchTerm) || dominantCategories.includes(searchTerm);
            });
            renderAromas(filteredAromas);
        });
    }
});
