const sfwBtn = document.getElementById('sfw-btn');
const nsfwBtn = document.getElementById('nsfw-btn');
const categorySelect = document.getElementById('category-select');
const fetchBtn = document.getElementById('fetch-btn');
const loading = document.getElementById('loading');
const waifuGrid = document.getElementById('waifu-grid');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');
const downloadBtn = document.getElementById('download-btn');
const nextBtn = document.getElementById('next-btn');

let currentType = 'sfw';
let currentCategory = 'waifu';
let currentImages = [];
let currentModalIndex = 0;

sfwBtn.addEventListener('click', () => {
  currentType = 'sfw';
  sfwBtn.classList.add('active');
  nsfwBtn.classList.remove('active');
});

nsfwBtn.addEventListener('click', () => {
  currentType = 'nsfw';
  nsfwBtn.classList.add('active');
  sfwBtn.classList.remove('active');
});

categorySelect.addEventListener('change', (e) => {
  currentCategory = e.target.value;
});

fetchBtn.addEventListener('click', fetchWaifus);
closeModal.addEventListener('click', () => modal.classList.add('hidden'));
nextBtn.addEventListener('click', showNextImage);

async function fetchWaifus() {
  loading.classList.remove('hidden');
  waifuGrid.innerHTML = '';

  try {
    const response = await fetch(`https://api.waifu.pics/many/${currentType}/${currentCategory}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exclude: [] })
    });

    if (!response.ok) throw new Error('Failed to fetch waifus');

    const data = await response.json();
    currentImages = data.files;
    displayWaifus(currentImages);
  } catch (error) {
    console.error('Error:', error);
    waifuGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p class="text-xl text-gray-300">Failed to fetch waifus. Please try again later.</p>
      </div>`;
  } finally {
    loading.classList.add('hidden');
  }
}

function displayWaifus(images) {
  waifuGrid.innerHTML = '';
  images.forEach((imageUrl, index) => {
    const card = document.createElement('div');
    card.className = 'waifu-card bg-gray-800 rounded-xl overflow-hidden shadow-lg';
    card.innerHTML = `
      <div class="relative pb-[100%]">
        <img src="${imageUrl}" class="absolute h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity" />
      </div>
      <div class="p-4 flex justify-between items-center">
        <span class="text-sm text-gray-300">${currentCategory}</span>
        <button class="text-pink-400 hover:text-pink-300">
          <i class="fas fa-heart"></i>
        </button>
      </div>`;

    card.querySelector('img').addEventListener('click', () => {
      currentModalIndex = index;
      showImageInModal(imageUrl);
    });

    waifuGrid.appendChild(card);
  });
}

function showImageInModal(imageUrl) {
  modalImage.src = imageUrl;
  downloadBtn.href = imageUrl;
  downloadBtn.download = `waifu-${currentCategory}-${Date.now()}.jpg`;
  modal.classList.remove('hidden');
}

function showNextImage() {
  currentModalIndex = (currentModalIndex + 1) % currentImages.length;
  showImageInModal(currentImages[currentModalIndex]);
}

fetchWaifus();
