// aromaClassifier.js

// Definisi kategori aroma dan kata kunci yang terkait (Sudah disesuaikan ke Bahasa Indonesia)
// Pastikan kata kunci ini dalam huruf kecil
const aromaCategories = {
    "Floral": ["mawar", "melati", "freesia", "peony", "lili", "gardenia", "sedap malam", "anggrek", "honeysuckle", "violet", "bunga jeruk", "magnolia", "bunga putih", "pomarose", "mahonia", "iris", "cyclamen", "floral notes", "bunga"],
    "Citrus": ["bergamot", "lemon", "jeruk", "jeruk bali", "jeruk mandarin", "jeruk pahit", "tangerine", "neroli", "limau", "orange"],
    "Fruity": ["persik", "raspberry", "apel", "red berries", "black currant", "nanas", "mangga", "leci", "pir", "ceri", "plum", "jambu biji", "pisang", "markisa", "buah kering", "buah", "green apple", "peach", "semangka", "tomat"], // Menambahkan 'semangka' dan 'tomat' dari contoh Adidas Natural
    "Sweet/Gourmand": ["vanila", "karamel", "cokelat", "madu", "kacang tonka", "kakao", "kue", "krim kocok", "es krim", "manis", "almond", "licorice", "konyak", "rum", "heliotrope", "vanilla", "sweet notes", "cake notes", "whipped cream", "ice cream notes", "gula", "praline"],
    "Woody": ["cendana", "kayu cedar", "nilam", "akar wangi", "oud", "agarwood", "kayu", "cashmeran", "clearwood", "lumut ek", "sandalwood", "cedar", "patchouli", "vetiver", "woody notes", "oakmoss", "cypress", "birch"],
    "Spicy": ["lada pink", "lada", "kapulaga", "pala", "kayu manis", "rempah-rempah", "jahe", "elemi", "styrax", "saffron", "pedas", "pink pepper", "pepper", "spices", "cardamom", "nutmeg", "ginger", "cengkeh", "ketumbar"],
    "Musk/Amber": ["musk", "musk putih", "amber", "ambroxan", "labdanum", "white musk", "hewan", "civet", "castoreum"],
    "Fresh/Clean": ["aldehida", "mint", "solar", "susu", "krim", "segar", "aldehydes", "milk notes", "creamy notes", "fresh scent", "solar notes", "bersih", "cotton", "linen"],
    "Coffee/Tobacco": ["kopi", "daun tembakau", "coffee", "tobacco leaf", "kakao", "tembakau"],
    "Leather": ["kulit", "leather", "suede", "birch tar"],
    "Powdery": ["bedak", "powdery notes", "iris", "violet", "heliotrope"],
    "Resin/Balsamic": ["benzoin", "olibanum", "dupa", "davana", "incense", "resin", "balsam", "opoponax"],
    "Aquatic/Ozonic": ["laut", "marine", "air", "ozonic", "hujan", "embun", "udara segar", "aquatic", "ozonic notes"],
    "Green": ["hijau", "rumput", "dedaunan", "galbanum", "daun ara", "green notes", "flax", "nuansa hijau"],
    "Aromatic/Herbal": ["lavender", "rosemary", "kemangi", "thyme", "clary sage", "petitgrain", "herbal", "mint", "teh"],
    "Miscellaneous": ["sake", "pasir", "vodka", "gin", "plum kering", "akar iris", "dedak", "metalik", "mineral", "ozone"] // Tambahan kategori Miscellaneous dan kata kunci
};

// MAPPING NAMA KATEGORI KE BAHASA INDONESIA UNTUK TAMPILAN
const categoryDisplayMap = {
    "Floral": "Bunga",
    "Citrus": "Jeruk",
    "Fruity": "Buah",
    "Sweet/Gourmand": "Manis",
    "Woody": "Kayu",
    "Spicy": "Rempah",
    "Musk/Amber": "Musk & Amber",
    "Fresh/Clean": "Segar & Bersih",
    "Coffee/Tobacco": "Kopi & Tembakau",
    "Leather": "Kulit",
    "Powdery": "Bedak",
    "Resin/Balsamic": "Resin & Balsam",
    "Aquatic/Ozonic": "Akuatik & Ozonic",
    "Green": "Hijau",
    "Aromatic/Herbal": "Aromatik & Herbal",
    "Miscellaneous": "Lain-lain" // Tambahan mapping Miscellaneous
};

// Fungsi utilitas untuk membersihkan nama kategori agar bisa dijadikan kelas CSS
function getSafeCategoryName(category) {
    if (!category) return 'Miscellaneous'; // Fallback jika kategori kosong
    // Gunakan categoryDisplayMap untuk mendapatkan nama tampilan sebelum disafekan
    const displayCategory = categoryDisplayMap[category] || category;
    return displayCategory
        .toLowerCase() // Ubah ke huruf kecil
        .replace(/ - /g, '-') // Ganti " - " dengan "-"
        .replace(/\s*&\s*/g, '-')   // "Musk & Amber" -> "Musk-Amber"
        .replace(/\s*\/\s*/g, '-')  // "Aquatic/Ozonic" -> "Aquatic-Ozonic"
        .replace(/\s/g, '-')        // Mengganti spasi lainnya dengan strip
        .replace(/[^a-zA-Z0-9-]/g, '') // Menghapus karakter non-alphanumeric kecuali strip
        .replace(/-+/g, '-');       // Mengganti multiple strip dengan satu strip
}

/**
 * Mengidentifikasi 2 kategori aroma paling dominan dari notes aroma.
 * Ini adalah inti dari logika otomatisasi.
 * @param {object} aroma - Objek aroma yang berisi properti notes (topNote, middleNote, baseNote).
 * @returns {string[]} Array nama kategori dominan (string internal seperti "Citrus", "Fruity").
 */
function getDominantCategoriesFromNotes(aroma) {
    // Gabungkan semua notes dan nama aroma untuk analisis
    const allNotes = [];
    if (aroma.topNote) allNotes.push(aroma.topNote);
    if (aroma.middleNote) allNotes.push(aroma.middleNote);
    if (aroma.baseNote) allNotes.push(aroma.baseNote);
    // Tambahkan namaBesar dan namaKecil sebagai sumber kata kunci juga
    if (aroma.namaBesar) allNotes.push(aroma.namaBesar);
    if (aroma.namaKecil) allNotes.push(aroma.namaKecil);

    const fullText = allNotes.join(' ').toLowerCase();
    const categoryCounts = {};

    // Hitung kemunculan kata kunci untuk setiap kategori
    for (const category in aromaCategories) {
        if (aromaCategories.hasOwnProperty(category)) {
            let count = 0;
            for (const keyword of aromaCategories[category]) {
                // Gunakan RegExp untuk pencarian kata utuh (whole word) dan case-insensitive
                // \b adalah word boundary, memastikan 'jeruk' tidak cocok dengan 'jerukan'
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                const matches = fullText.match(regex);
                if (matches) {
                    count += matches.length;
                }
            }
            if (count > 0) {
                categoryCounts[category] = count;
            }
        }
    }

    // Ubah objek hitungan menjadi array dan urutkan berdasarkan jumlah (descending)
    const sortedCategories = Object.keys(categoryCounts).sort((a, b) => {
        return categoryCounts[b] - categoryCounts[a];
    });

    // Ambil hingga 2 kategori teratas
    let dominant = sortedCategories.slice(0, 2);

    // Jika tidak ada kategori yang terdeteksi, atau kurang dari 1, default ke "Miscellaneous"
    if (dominant.length === 0) {
        dominant.push("Miscellaneous");
    }

    return dominant; // Mengembalikan nama kategori internal (e.g., "Citrus", "Fruity")
}


// Objek untuk menyimpan hasil klasifikasi aroma (untuk halaman aroma-notes.html)
let classifiedAromas = {};

// Fungsi untuk mengklasifikasikan aroma berdasarkan notes (digunakan di aroma-notes.html)
// Ini akan mengklasifikasikan aroma ke SEMUA kategori yang cocok, untuk pengisian popup
function classifyAromasForPopup() {
    const result = {};
    if (typeof inspiredAromas === 'undefined' || !Array.isArray(inspiredAromas)) {
        console.error("Kesalahan: 'inspiredAromas' tidak ditemukan atau bukan array. Pastikan data/aromas_data.js dimuat duluan.");
        return {};
    }

    // Inisialisasi setiap kategori dengan array kosong
    for (const category in aromaCategories) {
        result[category] = [];
    }
    // Pastikan Miscellaneous juga terinisialisasi
    if (!result["Miscellaneous"]) {
        result["Miscellaneous"] = [];
    }

    inspiredAromas.forEach(aroma => {
        // Ambil SEMUA kategori yang cocok, BUKAN hanya 2 dominan
        const allMatchingCategories = [];
        const combinedNotes = `${aroma.topNote || ''} ${aroma.middleNote || ''} ${aroma.baseNote || ''} ${aroma.namaBesar || ''}`.toLowerCase();

        for (const category in aromaCategories) {
            if (aromaCategories.hasOwnProperty(category)) {
                for (const keyword of aromaCategories[category]) {
                    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                    if (combinedNotes.match(regex)) {
                        allMatchingCategories.push(category);
                        break; // Hanya tambahkan kategori ini sekali jika ada keyword yang cocok
                    }
                }
            }
        }

        if (allMatchingCategories.length > 0) {
            // Push aroma ke semua kategori yang cocok
            allMatchingCategories.forEach(cat => {
                if (result[cat]) {
                    result[cat].push({
                        no: aroma.no,
                        namaKecil: aroma.namaKecil,
                        namaBesar: aroma.namaBesar,
                        topNote: aroma.topNote,
                        middleNote: aroma.middleNote,
                        baseNote: aroma.baseNote,
                        imageFileName: aroma.imageFileName // Tambahkan ini
                    });
                }
            });
        } else {
            // Jika tidak ada kategori yang cocok, masukkan ke Miscellaneous
            result["Miscellaneous"].push({
                no: aroma.no,
                namaKecil: aroma.namaKecil,
                namaBesar: aroma.namaBesar,
                topNote: aroma.topNote,
                middleNote: aroma.middleNote,
                baseNote: aroma.baseNote,
                imageFileName: aroma.imageFileName // Tambahkan ini
            });
        }
    });
    return result;
}


// Fungsi UNIVERSAL untuk membuat elemen HTML kartu aroma
// Fungsi ini akan dipanggil oleh aroma-inspired-renderer.js dan juga oleh displayAromasInPopup
function createAromaCardHTML(aroma, imagePathPrefix = 'assets/aromaInspired/') {
    const card = document.createElement('div');
    card.classList.add('aroma-card', 'aroma-card-in-popup');

    // Dapatkan 2 kategori dominan untuk ditampilkan dan sebagai kelas CSS
    const dominantCategories = getDominantCategoriesFromNotes(aroma);

    // Tambahkan kelas CSS untuk setiap kategori dominan (untuk pewarnaan/styling)
    // Ambil kategori pertama sebagai acuan warna utama kartu jika ada
    const categoryForStyle = dominantCategories.length > 0
        ? getSafeCategoryName(dominantCategories[0])
        : 'Miscellaneous'; // Fallback jika tidak ada kategori dominan
    card.classList.add(`category-${categoryForStyle}`);


    // Gambar Aroma
    const img = document.createElement('img');
    img.src = `${imagePathPrefix}${aroma.imageFileName || aroma.no + '.jpg'}`;
    img.alt = aroma.namaKecil || aroma.namaBesar || 'Aroma Image';
    img.classList.add('aroma-card-image');
    img.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/placeholder.jpg';
    };
    card.appendChild(img);

    // Nama Aroma
    const title = document.createElement('h3');
    title.textContent = aroma.namaKecil || 'Nama Tidak Tersedia';
    card.appendChild(title);

    // Detail Aroma (Kelas Aroma dan Notes)
    const aromaNotesDiv = document.createElement('div');
    aromaNotesDiv.classList.add('aroma-notes');

    // Kelas Aroma (hanya menampilkan 2 yang dominan, diformat untuk tampilan)
    let categoriesHtml = '';
    if (dominantCategories.length > 0) {
        const displayNames = dominantCategories.map(cat => categoryDisplayMap[cat] || cat);
        categoriesHtml = `Kelas Aroma : <strong>${displayNames.join(', ')}</strong>`;
    } else {
        categoriesHtml = `Kelas Aroma : <strong>${categoryDisplayMap["Miscellaneous"] || "N/A"}</strong>`;
    }
    aromaNotesDiv.innerHTML = categoriesHtml + '<br>';

    // Notes
    aromaNotesDiv.innerHTML += `Top: ${aroma.topNote || 'N/A'}<br>`;
    aromaNotesDiv.innerHTML += `Middle: ${aroma.middleNote || 'N/A'}<br>`;
    aromaNotesDiv.innerHTML += `Base: ${aroma.baseNote || 'N/A'}`;

    card.appendChild(aromaNotesDiv);

    return card;
}


// Fungsi untuk menampilkan aroma di popup (untuk Kelas Aroma di aroma-notes.html)
function displayAromasInPopup(className) {
    const overlay = document.getElementById('aroma-popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const aromaListContainer = document.getElementById('aroma-list-container');

    if (!overlay || !popupTitle || !aromaListContainer) {
        console.error("Elemen popup tidak ditemukan. Pastikan HTML popup sudah ada.");
        return;
    }

    aromaListContainer.innerHTML = ''; // Bersihkan konten sebelumnya

    let displayCategoryName = categoryDisplayMap[className] || className; // Gunakan mapping Bahasa Indonesia

    popupTitle.textContent = `Aroma dalam Kategori ${displayCategoryName}`;

    // Pastikan classifiedAromas sudah terisi
    if (classifiedAromas[className] && classifiedAromas[className].length > 0) {
        // Urutkan aroma berdasarkan namaKecil di popup
        const sortedAromasInPopup = [...classifiedAromas[className]].sort((a, b) => {
            const nameA = (a.namaKecil || a.namaBesar || '').toLowerCase();
            const nameB = (b.namaKecil || b.namaBesar || '').toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        sortedAromasInPopup.forEach(aroma => {
            const aromaCard = createAromaCardHTML(aroma, 'assets/aromaInspired/');
            aromaListContainer.appendChild(aromaCard);
        });
    } else {
        aromaListContainer.innerHTML = `<p style="text-align: center; width: 100%;">Maaf, tidak ada aroma yang ditemukan dalam kategori '${displayCategoryName}' saat ini.</p>`;
    }

    overlay.style.display = 'flex';
}

// Fungsi untuk menutup popup
function closeAromaPopup() {
    const overlay = document.getElementById('aroma-popup-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Event Listener yang akan dijalankan saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Logic untuk aroma-notes.html
    if (window.location.pathname.includes('aroma-notes.html')) {
        // Pastikan inspiredAromas sudah dimuat sebelum memanggil classifyAromasForPopup
        if (typeof inspiredAromas !== 'undefined' && Array.isArray(inspiredAromas)) {
            classifiedAromas = classifyAromasForPopup();
        } else {
            console.error("Kesalahan: 'inspiredAromas' tidak ditemukan saat mencoba mengklasifikasikan aroma.");
        }

        const classCards = document.querySelectorAll('.class-card');

        // --- LOGIC UNTUK GAMBAR KELAS AROMA DI AROMA-NOTES.HTML (Tidak ada perubahan di sini) ---
        const imagePathPrefix = 'assets/aroma-icons/';
        const imageExtension = '.jpg';

        const aromaNotesImageFileNameMap = {
            'Citrus': 'citrus',
            'Fruity': 'fruity',
            'Floral': 'floral',
            'Aromatic/Herbal': 'herbal',
            'Spicy': 'rempah',
            'Sweet/Gourmand': 'manis',
            'Woody': 'kayu',
            'Resin/Balsamic': 'resin',
            'Musk/Amber': 'hewan',
            'Coffee/Tobacco': 'minuman',
            'Green': 'alam',
            'Fresh/Clean': 'segar-bersih',
            'Leather': 'kulit',
            'Powdery': 'bedak',
            'Aquatic/Ozonic': 'akuatik',
            'Miscellaneous': 'lain-lain'
        };

        classCards.forEach(card => {
            const dataCategory = card.dataset.category;
            const classBlockElement = card.querySelector('.class-block');

            if (dataCategory && classBlockElement) {
                const imageFileName = aromaNotesImageFileNameMap[dataCategory];
                if (imageFileName) {
                    const imageUrl = `${imagePathPrefix}${imageFileName}${imageExtension}`;

                    classBlockElement.style.backgroundImage = `url('${imageUrl}')`;
                    classBlockElement.style.backgroundSize = 'cover';
                    classBlockElement.style.backgroundPosition = 'center';
                    classBlockElement.style.backgroundRepeat = 'no-repeat';
                    classBlockElement.style.backgroundColor = 'transparent';
                    classBlockElement.style.overflow = 'hidden';
                } else {
                    console.warn(`Peringatan: Tidak ada nama file gambar yang ditemukan di aromaNotesImageFileNameMap untuk kategori: ${dataCategory}`);
                }
            }
        });
        // --- AKHIR LOGIC UNTUK GAMBAR KELAS AROMA DI AROMA-NOTES.HTML ---


        // Event Listener untuk setiap kartu kategori di aroma-notes.html
        classCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoryToFilter = card.dataset.category; // Ambil kategori dari data-attribute
                if (categoryToFilter) {
                    displayAromasInPopup(categoryToFilter); // Panggil fungsi popup
                }
            });
        });

        // Hapus atau sembunyikan container display lama
        const oldDisplayContainer = document.getElementById('aroma-display-container');
        if (oldDisplayContainer) {
            oldDisplayContainer.style.display = 'none';
        }

        // Event listener untuk tombol close popup
        const closeButton = document.querySelector('#aroma-popup-content .close-popup-button');
        if (closeButton) {
            closeButton.addEventListener('click', closeAromaPopup);
        }

        // Event listener untuk menutup popup saat mengklik overlay
        const popupOverlay = document.getElementById('aroma-popup-overlay');
        if (popupOverlay) {
            popupOverlay.addEventListener('click', (event) => {
                if (event.target === popupOverlay) {
                    closeAromaPopup();
                }
            });
        }
    }

    // Logic untuk booster.html (Tidak ada perubahan di sini)
    if (window.location.pathname.includes('booster.html')) {
        displayBoosterAromas();
    }

    // Logic untuk homepage (index.html) images (Tidak ada perubahan di sini)
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/urbantul-homepage/' || window.location.pathname.includes('index.html');

    if (isHomePage) {
        const aromaClassItems = document.querySelectorAll('.aroma-class-item-main-page');
        const imagePathPrefix = 'assets/aroma-icons/';
        const imageExtension = '.jpg';

        const categoryImagePrefixMap = {
            'jeruk': 'citrus',
            'buah-buahan': 'fruity',
            'bunga': 'floral',
            'kayu-kayuan': 'kayu',
            'resin-balsam': 'resin',
            'aroma-alam': 'alam'
        };

        aromaClassItems.forEach(item => {
            const aromaNameElement = item.querySelector('.aroma-class-name-main-page');
            const aromaBoxElement = item.querySelector('.aroma-class-box-main-page');

            if (aromaNameElement && aromaBoxElement) {
                let aromaNameFromHTML = aromaNameElement.textContent.trim();
                let normalizedKey = aromaNameFromHTML
                    .toLowerCase()
                    .replace(/ - /g, '-')
                    .replace(/ & /g, '-')
                    .replace(/\s/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+/g, '-');

                const imageFileNamePrefix = categoryImagePrefixMap[normalizedKey] || normalizedKey;

                const imageUrl = `${imagePathPrefix}${imageFileNamePrefix}${imageExtension}`;

                aromaBoxElement.style.backgroundImage = `url('${imageUrl}')`;
                aromaBoxElement.style.backgroundSize = 'cover';
                aromaBoxElement.style.backgroundPosition = 'center';
                aromaBoxElement.style.backgroundRepeat = 'no-repeat';
                aromaBoxElement.style.overflow = 'hidden';
                aromaBoxElement.style.backgroundColor = 'transparent';
            }
        });
    }

    // --- LOGIC BARU UNTUK best-sellers.html (Tidak ada perubahan) ---
    if (window.location.pathname.includes('best-sellers.html')) {
        const productCircleCards = document.querySelectorAll('.product-circle-card');
        const imagePathBase = 'assets/best-sellers/';

        const bestSellerImageFileNameMap = {
            // --- KATEGORI CEWEK ---
            "Aqua Kiss": "aquaa kiss",
            "Avril FBL": "avril",
            "Black Opium": "black opiuum",
            "Celindion Sensation": "celindion",
            "Guci Floral": "guci floral",
            "Jlo Live Platinum": "jlo plat",
            "Kayali Vanila": "kayali vanilla",
            "Lanvin Marry Me": "lanvin",
            "Miss Dior Blooming": "mdb",
            "Giorgio Armani My Way": "my way",
            "Nagita Slavina": "nagita",
            "Peach Baby": "peach baby",
            "Pink Chiffon": "pink chiffon",
            "Pramugari Air": "Pramugari Air",
            "VS Scandal": "scandal",
            "VS So Sexy": "so sexy",
            "VS Romance Wish": "VS Romance Wish",
            "Taylor Swift": "taylor",
            "Vanila Ice": "vanila ice",
            "Zara Orchid": "zara orchid",

            // --- KATEGORI COWOK ---
            "Adidas Natural": "adidas n",
            "Bacarat Aqua Unibersal": "bac aqua",
            "Bacarat Rouge": "bac rouge",
            "Blue Emotion": "blue emo",
            "Bulgari Aquatic": "bulgari aquatic",
            "Bulgari Extreme": "bulgari extreme",
            "Charlie Yellow": "charlie y",
            "D&G No. 3": "d&g no. 3",
            "Dior Sauvage": "dior s",
            "Dunhil Blue": "dunhill blue",
            "E.A. Black Man": "ea black man",
            "E.A. Debut": "EA Debut",
            "Erost by Versace": "erost v",
            "HMNS Alpha": "hmns alpha",
            "Jaguar Visio": "jaguar visio",
            "Justin Bieber Someday": "jbs",
            "Kenzo Bali": "kenzo bali",
            "Lacoste Cool Play": "lacoste cool",
            "One Direction": "one d",
            "Zara Man": "zara man",
        };

        productCircleCards.forEach(card => {
            const productNameElement = card.querySelector('.product-name');
            const productCircleElement = card.querySelector('.product-circle');

            if (productNameElement && productCircleElement) {
                const productName = productNameElement.textContent.trim();
                const imageFileName = bestSellerImageFileNameMap[productName];

                let genderFolder = '';
                const parentCategorySection = card.closest('.best-seller-category');
                if (parentCategorySection) {
                    if (parentCategorySection.querySelector('.female-title')) {
                        genderFolder = 'cewek/';
                    } else if (parentCategorySection.querySelector('.male-title')) {
                        genderFolder = 'cowok/';
                    }
                }

                if (imageFileName && genderFolder) {
                    const imageUrl = `${imagePathBase}${genderFolder}${imageFileName}.jpg`;

                    productCircleElement.style.backgroundImage = `url('${imageUrl}')`;
                    productCircleElement.style.backgroundSize = 'contain';
                    productCircleElement.style.backgroundPosition = 'center';
                    productCircleElement.style.backgroundRepeat = 'no-repeat';
                    productCircleElement.style.backgroundColor = 'white';
                    productCircleElement.style.overflow = 'hidden';
                } else {
                    console.warn(`Peringatan: Gambar tidak ditemukan untuk parfum "${productName}" di folder "${genderFolder}" atau folder gender tidak teridentifikasi.`);
                }
            }
        });
    }
});

// === DATA AROMA BOOSTER ===
const boosterAromaNos = [155, 156, 157, 158]; // Angka-angka ini harus sesuai dengan 'no' di karakterAromas

function getBoosterAromas() {
    if (typeof karakterAromas === 'undefined' || !Array.isArray(karakterAromas)) {
        console.error("Kesalahan: 'karakterAromas' tidak ditemukan atau bukan array. Pastikan data/aromas_data.js dimuat duluan.");
        return [];
    }
    return karakterAromas.filter(aroma => boosterAromaNos.includes(aroma.no));
}

// FUNGSI INI AKAN BERUBAH UNTUK MENAMPILKAN KELAS AROMA DENGAN PRIORITAS (sedikit modifikasi)
function displayBoosterAromas() {
    const boosterAromas = getBoosterAromas();

    if (boosterAromas.length < 4) {
        console.warn("Peringatan: Tidak cukup data aroma booster untuk mengisi semua 4 card.");
    }

    const cardElements = [
        document.querySelector('.booster-card.bo1'),
        document.querySelector('.booster-card.bo2'),
        document.querySelector('.booster-card.bo3'),
        document.querySelector('.booster-card.bo4')
    ];

    cardElements.forEach((card, index) => {
        if (card && boosterAromas[index]) {
            const aroma = boosterAromas[index];
            card.innerHTML = '';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'booster-name';
            nameDiv.innerHTML = `BO${index + 1}`;
            card.appendChild(nameDiv);

            const imgElement = document.createElement('img');
            imgElement.src = 'Booster/booster-image.jpg'; // Pastikan path ini benar
            imgElement.alt = `Booster Image ${index + 1}`;
            imgElement.className = 'booster-card-image';
            card.appendChild(imgElement);

            const notesDiv = document.createElement('div');
            notesDiv.className = 'booster-notes';

            // Dapatkan 2 kategori dominan untuk booster
            const dominantCategoriesBooster = getDominantCategoriesFromNotes(aroma);

            let categoriesHtml = '';
            if (dominantCategoriesBooster.length > 0) {
                const displayNames = dominantCategoriesBooster.map(cat => categoryDisplayMap[cat] || cat);
                categoriesHtml = `Kelas Aroma : <strong>${displayNames.join(', ')}</strong><br>`;
            } else {
                categoriesHtml = `Kelas Aroma : <strong>${categoryDisplayMap["Miscellaneous"] || "N/A"}</strong><br>`;
            }

            notesDiv.innerHTML = `
                ${categoriesHtml}
                <small>Top: ${aroma.topNote || '-'}</small><br>
                <small>Middle: ${aroma.middleNote || '-'}</small><br>
                <small>Base: ${aroma.baseNote || '-'}</small>
            `;
            card.appendChild(notesDiv);

        } else if (card) {
            card.innerHTML = `
                <div class="booster-name">BO${index + 1}</div>
                <img src="Booster/booster-image.jpg" alt="Booster Image ${index + 1}" class="booster-card-image">
                <div class="booster-notes">
                    <small>Top: -</small><br>
                    <small>Middle: -</small><br>
                    <small>Base: -</small>
                </div>
            `;
        }
    });

    const oldDisplayContainer = document.getElementById('aroma-display-container');
    if (oldDisplayContainer) {
        oldDisplayContainer.style.display = 'none';
    }
}

// FUNGSI INI SUDAH TIDAK DIGUNAKAN UNTUK MENAMPILKAN DETAIL AROMA KARENA SUDAH ADA POPUP
// [REKOMENDASI]: Hapus fungsi ini untuk membersihkan kode
// function displayAromasByClass(className) { ... }
