// aromaClassifier.js

// Definisi kategori aroma dan kata kunci yang terkait (Sudah disesuaikan ke Bahasa Indonesia)
const aromaCategories = {
    "Floral": ["mawar", "melati", "freesia", "peony", "lili", "gardenia", "sedap malam", "anggrek", "honeysuckle", "violet", "bunga jeruk", "magnolia", "bunga putih", "nuansa bunga", "pomarose", "mahonia", "iris", "cyclamen", "floral notes"],
    "Citrus": ["bergamot", "lemon", "jeruk", "jeruk bali", "jeruk mandarin", "jeruk pahit", "tangerine", "neroli", "limau", "orange"],
    "Fruity": ["persik", "raspberry", "apel", "red berries", "black currant", "nanas", "mangga", "leci", "pir", "ceri", "plum", "jambu biji", "pisang", "markisa", "buah kering", "nuansa buah", "green apple", "peach"],
    "Sweet/Gourmand": ["vanila", "karamel", "cokelat", "madu", "kacang tonka", "kakao", "nuansa kue", "krim kocok", "nuansa es krim", "nuansa manis", "almond", "licorice", "konyak", "rum", "heliotrope", "vanilla", "sweet notes", "cake notes", "whipped cream", "ice cream notes"],
    "Woody": ["cendana", "kayu cedar", "nilam", "akar wangi", "oud", "agarwood", "nuansa kayu", "cashmeran", "clearwood", "lumut ek", "sandalwood", "cedar", "patchouli", "vetiver", "woody notes", "oakmoss"],
    "Spicy": ["lada pink", "lada", "kapulaga", "pala", "kayu manis", "rempah-rempah", "jahe", "elemi", "styrax", "saffron", "nuansa pedas", "pink pepper", "pepper", "spices", "cardamom", "nutmeg", "ginger"],
    "Musk/Amber": ["musk", "musk putih", "amber", "ambroxan", "labdanum", "white musk"],
    "Fresh/Clean": ["aldehida", "mint", "nuansa solar", "nuansa susu", "nuansa krim", "nuansa segar", "aldehydes", "milk notes", "creamy notes", "fresh scent", "solar notes"],
    "Coffee/Tobacco": ["kopi", "daun tembakau", "coffee", "tobacco leaf"],
    "Leather": ["kulit", "leather"],
    "Powdery": ["nuansa bedak", "powdery notes"],
    "Resin/Balsamic": ["benzoin", "olibanum", "dupa", "davana", "incense"],
    "Aquatic/Ozonic": ["nuansa laut", "marine", "nuansa air", "ozonic", "hujan", "embun", "udara segar"],
    "Green": ["nuansa hijau", "rumput", "dedaunan", "galbanum", "daun ara", "green notes", "flax"],
    "Aromatic/Herbal": ["lavender", "rosemary", "kemangi", "thyme", "clary sage", "petitgrain"]
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
    "Aromatic/Herbal": "Aromatik & Herbal"
};

// Objek untuk menyimpan hasil klasifikasi aroma (untuk halaman aroma-notes.html)
let classifiedAromas = {};

// Fungsi untuk mengklasifikasikan aroma berdasarkan notes (digunakan di aroma-notes.html)
function classifyAromas() {
    const result = {};
    if (typeof inspiredAromas === 'undefined' || !Array.isArray(inspiredAromas)) {
        console.error("Kesalahan: 'inspiredAromas' tidak ditemukan atau bukan array. Pastikan script.js dimuat duluan.");
        return {};
    }
    for (const category in aromaCategories) {
        result[category] = [];
    }
    inspiredAromas.forEach(aroma => {
        const allNotes = `${aroma.topNote || ''}, ${aroma.middleNote || ''}, ${aroma.baseNote || ''}`.toLowerCase();
        for (const category in aromaCategories) {
            const keywords = aromaCategories[category];
            const foundKeywords = keywords.filter(keyword => allNotes.includes(keyword.toLowerCase()));
            if (foundKeywords.length > 0) {
                result[category].push({
                    no: aroma.no,
                    namaKecil: aroma.namaKecil,
                    namaBesar: aroma.namaBesar,
                    topNote: aroma.topNote,
                    middleNote: aroma.middleNote,
                    baseNote: aroma.baseNote,
                    matchedKeywords: foundKeywords
                });
            }
        }
    });
    return result;
}

// Fungsi pembantu: Mengambil semua kategori aroma yang cocok untuk satu aroma spesifik
function getAromaCategoriesForBooster(aroma) {
    const matchedCategories = [];
    const allNotes = `${aroma.topNote || ''}, ${aroma.middleNote || ''}, ${aroma.baseNote || ''}`.toLowerCase();

    for (const category in aromaCategories) {
        const keywords = aromaCategories[category];
        const foundKeywords = keywords.filter(keyword => allNotes.includes(keyword.toLowerCase()));
        if (foundKeywords.length > 0) {
            matchedCategories.push(category);
        }
    }
    return matchedCategories;
}

// Fungsi untuk menampilkan aroma di container HTML (untuk Kelas Aroma di aroma-notes.html)
function displayAromasByClass(className) {
    const container = document.getElementById('aroma-display-container');
    if (!container) {
        console.error("Elemen dengan ID 'aroma-display-container' tidak ditemukan di halaman.");
        return;
    }
    container.innerHTML = ''; // Bersihkan konten sebelumnya

    const classCardElement = document.querySelector(`.class-card[data-category="${className}"]`);
    let displayCategoryName = className;
    if (classCardElement && classCardElement.querySelector('.class-name-banner')) {
        // Ini mapping yang sudah ada untuk aroma-notes.html, kita biarkan saja.
        displayCategoryName = classCardElement.querySelector('.class-name-banner').textContent;
    }

    const displayTitle = document.createElement('h2');
    displayTitle.textContent = `Aroma dalam Kategori ${displayCategoryName}`;
    container.appendChild(displayTitle);

    if (classifiedAromas[className] && classifiedAromas[className].length > 0) {
        const ul = document.createElement('ul');
        classifiedAromas[className].forEach(aroma => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${aroma.namaKecil}</strong> (${aroma.namaBesar})<br>
                <small>Top: ${aroma.topNote || '-'}</small><br>
                <small>Middle: ${aroma.middleNote || '-'}</small><br>
                <small>Base: ${aroma.baseNote || '-'}</small>
            `;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } else {
        container.innerHTML += `<p>Maaf, tidak ada aroma yang ditemukan dalam kategori '${displayCategoryName}' saat ini.</p>`;
    }
}

// === DATA AROMA BOOSTER ===
const boosterAromaNos = [155, 156, 157, 158];

function getBoosterAromas() {
    if (typeof karakterAromas === 'undefined' || !Array.isArray(karakterAromas)) {
        console.error("Kesalahan: 'karakterAromas' tidak ditemukan atau bukan array. Pastikan script.js dimuat duluan.");
        return [];
    }
    return karakterAromas.filter(aroma => boosterAromaNos.includes(aroma.no));
}

// FUNGSI INI AKAN BERUBAH UNTUK MENAMPILKAN KELAS AROMA DENGAN PRIORITAS
function displayBoosterAromas() {
    const boosterAromas = getBoosterAromas(); // Ambil data booster

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
            imgElement.src = 'Booster/booster-image.jpg';
            imgElement.alt = `Booster Image ${index + 1}`;
            imgElement.className = 'booster-card-image';
            card.appendChild(imgElement);

            const notesDiv = document.createElement('div');
            notesDiv.className = 'booster-notes';

            // Dapatkan semua kategori yang cocok
            const allCategories = getAromaCategoriesForBooster(aroma); 

            let finalCategoriesToDisplay = [];
            const desiredPriorities = ['Spicy', 'Coffee/Tobacco']; // Kategori yang diprioritaskan

            // 1. Tambahkan kategori yang diprioritaskan jika ada dan belum mencapai batas 2
            for (const priorityCat of desiredPriorities) {
                if (allCategories.includes(priorityCat) && finalCategoriesToDisplay.length < 2) {
                    finalCategoriesToDisplay.push(priorityCat);
                }
            }

            // 2. Jika masih kurang dari 2 kategori, isi dengan kategori lain yang cocok
            //    (pastikan tidak ada duplikat dan tetap di bawah 2)
            if (finalCategoriesToDisplay.length < 2) {
                for (const cat of allCategories) {
                    if (!finalCategoriesToDisplay.includes(cat) && finalCategoriesToDisplay.length < 2) {
                        finalCategoriesToDisplay.push(cat);
                    }
                }
            }
            
            let categoriesHtml = '';
            if (finalCategoriesToDisplay.length > 0) {
                // Menggunakan categoryDisplayMap untuk tampilan Bahasa Indonesia
                const displayNames = finalCategoriesToDisplay.map(cat => categoryDisplayMap[cat] || cat);
                categoriesHtml = `Kelas Aroma : <strong>${displayNames.join(', ')}</strong><br>`;
            }

            notesDiv.innerHTML = `
                ${categoriesHtml}
                <small>Top: ${aroma.topNote || '-'}</small><br>
                <small>Middle: ${aroma.middleNote || '-'}</small><br>
                <small>Base: ${aroma.baseNote || '-'}</small>
            `;
            card.appendChild(notesDiv);

        } else if (card) {
            // Jika tidak ada data aroma untuk card ini
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


// Event Listener yang akan dijalankan saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Logic untuk aroma-notes.html
    if (window.location.pathname.includes('aroma-notes.html')) {
        classifiedAromas = classifyAromas();
        const classCards = document.querySelectorAll('.class-card');

        // --- MULAI LOGIC UNTUK GAMBAR KELAS AROMA DI AROMA-NOTES.HTML ---
        const imagePathPrefix = 'assets/aroma-icons/'; // Pastikan jalur ini benar
        const imageExtension = '.jpg'; // Pastikan ekstensi ini benar

        // Mapping dari data-category (English) ke awalan nama file gambar Anda
        // Sesuaikan mapping ini jika nama file gambar Anda berbeda
        const aromaNotesImageFileNameMap = {
            'Citrus': 'citrus',
            'Fruity': 'fruity',
            'Floral': 'floral',
            'Aromatic/Herbal': 'herbal',
            'Spicy': 'rempah',
            'Sweet/Gourmand': 'manis',
            'Woody': 'kayu', // Ini akan digunakan untuk 'Kayu - kayuan' dan 'Oud'
            'Resin/Balsamic': 'resin', 
            'Musk/Amber': 'hewan', 
            'Coffee/Tobacco': 'minuman',
            'Green': 'alam' 
        };

        classCards.forEach(card => {
            const dataCategory = card.dataset.category; // Ambil nilai data-category
            const classBlockElement = card.querySelector('.class-block'); // Dapatkan elemen kotak hijau

            if (dataCategory && classBlockElement) {
                const imageFileName = aromaNotesImageFileNameMap[dataCategory];
                if (imageFileName) {
                    const imageUrl = `${imagePathPrefix}${imageFileName}${imageExtension}`;
                    
                    classBlockElement.style.backgroundImage = `url('${imageUrl}')`;
                    classBlockElement.style.backgroundSize = 'cover'; // Gambar akan menutupi seluruh area
                    classBlockElement.style.backgroundPosition = 'center'; // Pusatkan gambar
                    classBlockElement.style.backgroundRepeat = 'no-repeat'; // Jangan ulangi gambar
                    classBlockElement.style.backgroundColor = 'transparent'; // Pastikan latar belakang hijau hilang
                    classBlockElement.style.overflow = 'hidden'; // Penting agar gambar mengikuti clip-path
                } else {
                    console.warn(`Peringatan: Tidak ada nama file gambar yang ditemukan di aromaNotesImageFileNameMap untuk kategori: ${dataCategory}`);
                }
            }
        });
        // --- AKHIR LOGIC UNTUK GAMBAR KELAS AROMA DI AROMA-NOTES.HTML ---


        // Existing click listener for displaying aroma details (Tidak ada perubahan di sini)
        classCards.forEach(card => {
            card.addEventListener('click', () => {
                let categoryName = card.dataset.category;
                if (!categoryName) {
                    // Ini mapping yang sudah ada untuk aroma-notes.html (mapping dari teks ke kategori EN)
                    categoryName = card.querySelector('.class-name-banner').textContent.trim();
                    if (categoryName === "Buah - buahan") categoryName = "Fruity";
                    else if (categoryName === "Jeruk") categoryName = "Citrus";
                    else if (categoryName === "Bunga") categoryName = "Floral";
                    else if (categoryName === "Kayu - kayuan") categoryName = "Woody";
                    else if (categoryName === "Manis") categoryName = "Sweet/Gourmand";
                    else if (categoryName === "Rempah") categoryName = "Spicy";
                    else if (categoryName === "Herbal") categoryName = "Aromatic/Herbal";
                    else if (categoryName === "Resin & Balsam") categoryName = "Resin/Balsamic";
                    else if (categoryName === "Hewan") categoryName = "Musk/Amber";
                    else if (categoryName === "Minuman") categoryName = "Coffee/Tobacco";
                    else if (categoryName === "Aroma Alam") categoryName = "Green";
                    else if (categoryName === "Oud") categoryName = "Woody"; 
                }
                
                if (categoryName) {
                    displayAromasByClass(categoryName);
                }
            });
        });
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
});
