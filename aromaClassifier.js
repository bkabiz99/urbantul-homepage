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

// Objek untuk menyimpan hasil klasifikasi aroma
let classifiedAromas = {};

// Fungsi untuk mengklasifikasikan aroma berdasarkan notes
// Fungsi ini akan menggunakan inspiredAromas (asumsi global dari script.js)
function classifyAromas() {
    const result = {};

    // Pastikan inspiredAromas tersedia
    if (typeof inspiredAromas === 'undefined' || !Array.isArray(inspiredAromas)) {
        console.error("Kesalahan: 'inspiredAromas' tidak ditemukan atau bukan array. Pastikan script.js dimuat duluan.");
        return {};
    }

    // Inisialisasi setiap kategori dengan array kosong
    for (const category in aromaCategories) {
        result[category] = [];
    }

    inspiredAromas.forEach(aroma => {
        // Gabungkan semua notes dan ubah ke huruf kecil untuk pencarian
        const allNotes = `${aroma.topNote || ''}, ${aroma.middleNote || ''}, ${aroma.baseNote || ''}`.toLowerCase();

        for (const category in aromaCategories) {
            const keywords = aromaCategories[category];
            // Filter keyword yang cocok, pastikan keyword juga lowercased
            const foundKeywords = keywords.filter(keyword => allNotes.includes(keyword.toLowerCase()));

            if (foundKeywords.length > 0) {
                // Tambahkan parfum ke kategori ini jika ada kata kunci yang cocok
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

// Fungsi untuk menampilkan aroma di container HTML (untuk Kelas Aroma)
function displayAromasByClass(className) {
    const container = document.getElementById('aroma-display-container');
    if (!container) {
        console.error("Elemen dengan ID 'aroma-display-container' tidak ditemukan di halaman.");
        return;
    }
    container.innerHTML = ''; // Bersihkan konten sebelumnya

    // Ambil nama tampilan yang ramah pengguna dari data-category di HTML
    const classCardElement = document.querySelector(`.class-card[data-category="${className}"]`);
    let displayCategoryName = className;
    if (classCardElement && classCardElement.querySelector('.class-name-banner')) {
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

// FUNGSI UNTUK MENAMPILKAN NOTES DI BAWAH CARD (SUDAH DIUBAH NAMA KECILNYA MENJADI BO1, BO2, DST.)
function displayBoosterAromas() {
    const boosterAromas = getBoosterAromas(); // Ambil data booster

    // Pastikan ada cukup data booster untuk setiap card
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
            // Kosongkan card terlebih dahulu jika ada konten placeholder
            card.innerHTML = '';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'booster-name';
            nameDiv.innerHTML = `BO${index + 1}`;
            card.appendChild(nameDiv);

            // === BARIS INI YANG DITAMBAHKAN UNTUK GAMBAR ===
            const imgElement = document.createElement('img');
            imgElement.src = 'Booster/booster-image.jpg'; // Path gambar sementara
            imgElement.alt = `Booster Image ${index + 1}`;
            imgElement.className = 'booster-card-image'; // Kelas untuk styling
            card.appendChild(imgElement);
            // ===============================================

            const notesDiv = document.createElement('div');
            notesDiv.className = 'booster-notes';
            notesDiv.innerHTML = `
                <small>Top: ${aroma.topNote || '-'}</small><br>
                <small>Middle: ${aroma.middleNote || '-'}</small><br>
                <small>Base: ${aroma.baseNote || '-'}</small>
            `;
            card.appendChild(notesDiv);

            // Tambahkan event listener untuk card (jika suatu saat nanti ingin bisa diklik)
            // card.addEventListener('click', () => {
            //     alert(`Anda mengklik ${aroma.namaKecil}`);
            // });

        } else if (card) {
            // Jika tidak ada data aroma untuk card ini, tampilkan BO1, BO2, dst.
            card.innerHTML = `
                <div class="booster-name">BO${index + 1}</div>
                <img src="Booster/booster-image.jpg" alt="Booster Image ${index + 1}" class="booster-card-image">
                <div class="booster-notes"></div>
            `;
        }
    });

    // Sembunyikan atau hapus container lama yang menampilkan daftar aroma
    const oldDisplayContainer = document.getElementById('aroma-display-container');
    if (oldDisplayContainer) {
        oldDisplayContainer.style.display = 'none'; // Atau oldDisplayContainer.remove();
    }
}



// Event Listener untuk mengklik kartu kelas aroma (Hanya di aroma-notes.html)
document.addEventListener('DOMContentLoaded', () => {
    // Pastikan ini hanya dijalankan di halaman aroma-notes.html
    if (window.location.pathname.includes('aroma-notes.html')) {
        classifiedAromas = classifyAromas(); // Panggil tanpa argumen
        const classCards = document.querySelectorAll('.class-card');
        classCards.forEach(card => {
            card.addEventListener('click', () => {
                let categoryName = card.dataset.category;
                if (!categoryName) {
                    categoryName = card.querySelector('.class-name-banner').textContent.trim();
                    // Sesuaikan nama kategori dari tampilan ke nama keyword yang sebenarnya di aromaCategories
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

    // Panggil fungsi untuk menampilkan aroma Booster jika berada di halaman booster.html
    if (window.location.pathname.includes('booster.html')) {
        displayBoosterAromas();
    }
});
