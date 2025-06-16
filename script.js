// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array]; // Create a shallow copy to avoid modifying original array directly
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
}

// Fungsi untuk menampilkan aroma (digunakan untuk Karakter, Inspired, dan Best Seller di halaman utama/lain)
// CATATAN: Fungsi ini TIDAK akan digunakan untuk tampilan 'aroma-karakter.html' dan 'aroma-inspired.html' karena menggunakan pop-up
function displayAromas(aromas, containerId, nameProperty = 'namaBesar', limit = Infinity) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const aromasToDisplay = aromas.slice(0, limit);

    const imagePathPrefixInspired = 'assets/aromaInspired/';
    const imagePathPrefixKarakter = 'assets/aromaKarakter/';
    const imagePathPrefixBestSeller = 'assets/bestSellers/';

    aromasToDisplay.forEach(aroma => {
        const aromaCard = document.createElement('div');

        aromaCard.classList.add(containerId.includes('bestSellerGrid') ? 'product-card' : 'aroma-card');

        const aromaImageContainer = document.createElement('div');
        let imageUrl;

        if (containerId.includes('bestSellerGrid')) {
            aromaImageContainer.classList.add('product-image');
            imageUrl = aroma.image ? aroma.image : `${imagePathPrefixBestSeller}${aroma.no}.jpg`;
        } else {
            aromaImageContainer.classList.add('aroma-icon');
            if (containerId.includes('inspiredAromaGrid')) {
                imageUrl = `${imagePathPrefixInspired}${aroma.no}.jpg`;
            } else if (containerId.includes('karakterAromaGrid')) {
                // Untuk halaman utama, gunakan imagePathPrefixKarakter
                imageUrl = `${imagePathPrefixKarakter}${aroma.no}.jpg`;
            } else {
                imageUrl = 'assets/images/placeholder.jpg';
            }
        }

        aromaImageContainer.style.backgroundImage = `url('${imageUrl}')`;
        aromaImageContainer.style.backgroundSize = 'cover';
        aromaImageContainer.style.backgroundPosition = 'center';

        const aromaName = document.createElement('p');
        aromaName.classList.add(containerId.includes('bestSellerGrid') ? 'product-name' : 'aroma-name');
        aromaName.textContent = aroma[nameProperty];

        aromaCard.appendChild(aromaImageContainer);
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

    if (hamburger && sidebar && closeSidebarButton && menuOverlay) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.add('open');
            menuOverlay.classList.add('active');
        });

        closeSidebarButton.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuOverlay.classList.remove('active');
        });

        menuOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuOverlay.classList.remove('active');
        });
    }

    // --- Aroma Detail Pop-up Logic ---
    const karakterAromaGridFull = document.getElementById('karakterAromaGridFull');
    const aromaDetailModal = document.getElementById('aromaDetailModal');
    const closeModalButton = document.querySelector('.close-modal-button');

    const modalAromaImage = document.getElementById('modalAromaImage');
    const modalNamaBesar = document.getElementById('modalNamaBesar');
    const modalNamaKecil = document.getElementById('modalNamaKecil');
    const modalTopNote = document.getElementById('modalTopNote');
    const modalMiddleNote = document.getElementById('modalMiddleNote');
    const modalBaseNote = document.getElementById('modalBaseNote');

    // Function to open the modal and populate with data
    function openAromaModal(aroma, imagePathPrefix) { // Tambahkan parameter imagePathPrefix
        if (!aroma) return;

        // Gunakan imagePathPrefix yang diberikan untuk sumber gambar modal
        modalAromaImage.src = `${imagePathPrefix}${aroma.no}.jpg`;
        modalAromaImage.alt = aroma.namaBesar;
        modalNamaBesar.textContent = aroma.namaBesar;
        modalNamaKecil.textContent = aroma.namaKecil;
        modalTopNote.textContent = aroma.topNote || 'N/A';
        modalMiddleNote.textContent = aroma.middleNote || 'N/A';
        modalBaseNote.textContent = aroma.baseNote || 'N/A';

        aromaDetailModal.style.display = 'flex'; // Use flex to center
        document.body.style.overflow = 'hidden'; // Prevent scrolling body when modal is open
    }

    // Function to close the modal
    function closeAromaModal() {
        aromaDetailModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scrolling
    }

    // Function to render aroma cards specifically for aroma-karakter.html with click handlers
    function renderKarakterAromaCardsWithPopup() {
        if (!karakterAromas || karakterAromas.length === 0) {
            if (karakterAromaGridFull) {
                karakterAromaGridFull.innerHTML = '<p>Tidak ada data aroma karakter yang tersedia.</p>';
            }
            return;
        }

        // Urutkan aroma Karakter secara abjad berdasarkan namaBesar
        const sortedKarakter = [...karakterAromas].sort((a, b) => {
            const nameA = a.namaBesar.toLowerCase();
            const nameB = b.namaBesar.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        if (karakterAromaGridFull) { // Pastikan elemen ada sebelum diisi
            karakterAromaGridFull.innerHTML = '';
            sortedKarakter.forEach(aroma => {
                const aromaCard = document.createElement('div');
                aromaCard.classList.add('aroma-card');
                aromaCard.dataset.aromaNo = aroma.no; // Store the aroma's 'no' for easy lookup

                const imagePath = `assets/aromaKarakter/${aroma.no}.jpg`; // Assumes .jpg extension based on 'no'

                aromaCard.innerHTML = `
                    <div class="aroma-icon" style="background-image: url('${imagePath}');"></div>
                    <p class="aroma-name">${aroma.namaBesar}</p>
                `;
                karakterAromaGridFull.appendChild(aromaCard);
            });

            // Event listener untuk klik pada kartu aroma Karakter
            karakterAromaGridFull.addEventListener('click', (event) => {
                const clickedCard = event.target.closest('.aroma-card');
                if (clickedCard) {
                    const aromaNo = parseInt(clickedCard.dataset.aromaNo);
                    const selectedAroma = karakterAromas.find(aroma => aroma.no === aromaNo);
                    if (selectedAroma) {
                        openAromaModal(selectedAroma, 'assets/aromaKarakter/'); // Panggil dengan prefix gambar yang benar
                    }
                }
            });
        }
    }

    // NEW: Function to render aroma cards specifically for aroma-inspired.html with click handlers
    function renderInspiredAromaCardsWithPopup() {
        const inspiredAromaGridFull = document.getElementById('inspiredAromaGridFull');
        if (!inspiredAromaGridFull || !inspiredAromas || inspiredAromas.length === 0) {
            if (inspiredAromaGridFull) {
                inspiredAromaGridFull.innerHTML = '<p>Tidak ada data aroma inspired yang tersedia.</p>';
            }
            return;
        }

        // Urutkan aroma Inspired secara abjad berdasarkan namaKecil
        const sortedInspired = [...inspiredAromas].sort((a, b) => {
            const nameA = a.namaKecil.toLowerCase();
            const nameB = b.namaKecil.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        inspiredAromaGridFull.innerHTML = ''; // Clear existing content

        sortedInspired.forEach(aroma => {
            const aromaCard = document.createElement('div');
            aromaCard.classList.add('aroma-card');
            aromaCard.dataset.aromaNo = aroma.no; // Store the aroma's 'no' for easy lookup

            // Menggunakan imagePathPrefixInspired untuk gambar pop-up
            const imagePath = `assets/aromaInspired/${aroma.no}.jpg`; // Asumsi .jpg

            aromaCard.innerHTML = `
                <div class="aroma-icon" style="background-image: url('${imagePath}');"></div>
                <p class="aroma-name">${aroma.namaKecil}</p>
            `;
            inspiredAromaGridFull.appendChild(aromaCard);
        });

        // Tambahkan event listener ke grid agar mendeteksi klik pada kartu aroma
        // Event listener ini diletakkan setelah semua kartu ditambahkan ke DOM
        inspiredAromaGridFull.addEventListener('click', (event) => {
            const clickedCard = event.target.closest('.aroma-card');
            if (clickedCard) {
                const aromaNo = parseInt(clickedCard.dataset.aromaNo);
                // Cari data aroma menggunakan properti 'no' dari array inspiredAromas
                const selectedAroma = inspiredAromas.find(aroma => aroma.no === aromaNo);
                if (selectedAroma) {
                    openAromaModal(selectedAroma, 'assets/aromaInspired/'); // Panggil dengan prefix gambar yang benar
                }
            }
        });
    }

    // Event listeners for closing the modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeAromaModal);
    }
    if (aromaDetailModal) {
        aromaDetailModal.addEventListener('click', (event) => {
            // Close if click outside the modal content
            if (event.target === aromaDetailModal) {
                closeAromaModal();
            }
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
        // Menggunakan fungsi renderKarakterAromaCardsWithPopup yang sudah ada di atas
        if (karakterAromaGridFull) { // Make sure the element exists
            renderKarakterAromaCardsWithPopup();
        }
    } else if (currentPage === 'aroma-inspired.html') {
        // Tampilkan SEMUA aroma Inspired di halaman khusus (URUTKAN ABJAD A-Z) dengan pop-up
        if (document.getElementById('inspiredAromaGridFull')) {
            renderInspiredAromaCardsWithPopup(); // Panggil fungsi baru ini
        }
    }
});
