window.onload = () => {
  
  const content = document.querySelector('.content');
  
  async function loadData() {
    try {
      // mengambil data
      const data = await fetchData();
      // jalankan fungsi updateUI()
      updateUI(data);
    } catch (error) {
      // jika mengalami masalah saat mengambil data 
      content.innerHTML = showError(error.message);
    }
  }
  
  loadData();
  
  function fetchData(param = '') {
    return fetch(`https://quran-api.santrikoding.com/api/surah/${param}`)
      .then(response => response.json())
      .then(response => response)
      .catch(error => {
        // jika mengalami masalah saat mengambil data
        throw new Error(error);
      });
  }
  
  function showError(message) {
    return `
    <div class="col-md-6 mx-auto">
      <div class="alert alert-danger my-auto" role="alert">
        <h1 class="fw-normal mb-2">Error!</h1>
        <p class="fw-light my-auto">${message}</p>
      </div>
    </div>
    `;
  }
  
  function updateUI(param) {
    // string kosong
    let result = '';
    // looping dan jalankan fungsi showCards()
    param.forEach(data => result += showCards(data));
    // kosongkan element content 
    content.innerHTML = '';
    // tampilkan element
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function showCards(data) {
    return `
    <div class="col-md-4">
      <div class="card my-2">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-normal">${data.nama_latin}</h5>
            <h5 class="fw-normal">${data.nama}</h5>
          </div>
          <span class="my-3 fw-light">${data.arti}</span>
          <p class="fw-light mb-3">${filter(data.deskripsi)}</p>
          <button class="btn btn-outline-primary rounded-1 btn-detail" data-id="${data.nomor}" data-bs-toggle="modal" data-bs-target="#modalBox">baca surat ini</button>
        </div>
      </div>
    </div>
    `;
  }
  
  function filter(param) {
    // batas panjang karakter
    const limit = 50;
    // batasi panjang teks sesuai batas dan tambahkan string titik tiga
    return param.substring(0, limit) + ' ...';
  }
  
  // lihat detail surat
  const modalContainer = document.querySelector('.modal-container');
  window.addEventListener('click', async event => {
    // jika element yang ditekan memiliki class "btn-detail"
    if (event.target.classList.contains('btn-detail')) {
      try {
        // dapatkan id di atribut "data-id" 
        const id = event.target.dataset.id;
        // jalankan fungsi fetchData dengan argumen berupa variabel id
        const data = await fetchData(id);
        // jalankan fungsi updateDetailUI() dengan argumen variabel data
        updateDetailUI(data);
      } catch (error) {
        // jika mengalami masalah saat mengambil data detail surat
        modalContainer.innerHTML = showError(error.message);
      }
    }
  });
  
  function updateDetailUI(data) {
    // kosongkan element modal container
    modalContainer.innerHTML = '';
    // jalankan fungsi showDetail() dan masukkan hasilnya ke variabel result
    const result = showDetail(data);
    // tampilkan hasil dari variabel result kedalam element modal container
    modalContainer.insertAdjacentHTML('beforeend', result);
  }
  
  function showDetail(data) {
    return `
    <div class="bg-light p-4 rounded">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="fw-normal">${data.nama_latin}</h5>
        <h5 class="fw-normal">${data.nama}</h5>
      </div>
      <span class="fw-light my-3">${data.arti}</span>
      <p class="fw-light">${data.deskripsi}</p>
    </div>
    <ul class="list-group mt-3">
      ${showAyat(data.ayat)}
    </ul>
    `;
  }
  
  function showAyat(param) {
    // string kosong
    let result = '';
    /*
      looping dan jalankan fungsi liatAyat()
      dan masukkan hasilnya kedalam variabel result
    */
    param.forEach(data => result += listAyat(data));
    // kembalikan nilai berupa isi variabel result
    return result;
  }
  
  function listAyat(data) {
    return `
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center mb-3">
        surat ke ${data.surah}, ayat ke ${data.nomor}
      </div>
      <p class="fw-light">${data.idn}</p>
      <p class="fw-normal text-end my-3">${data.ar}</p>
      <p class="fw-light text-end my-auto">${data.tr}</p>
    </li>
    `;
  }
  
  // input pencarian data
  const input = document.querySelector('.search-input');
  const submitButton = document.querySelector('.btn-submit');
  submitButton.addEventListener('click', async () => {
    try {
     content.innerHTML = '';
     // ambil data
     const data = await fetchData();
     // value input 
     const value = input.value.trim().toLowerCase();
     // jalankan fungsi searchData()
     searchData(value, data);
     // bersihkan value input
     input.value = '';
    } catch (error) {
     // jika mengalami masalah saat mengambil data 
     content.innerHTML = showError(error.message);
    }
  });
  
  function searchData(value, param) {
    // looping parameter param 
    param.forEach(data => {
      // definisikan 
      const {nama_latin, arti, tempat_turun} = data;
      // temukan data dengan cara jalankan fungsi finsData()
      findData(data, value, nama_latin, arti, tempat_turun);
    });
  }
  
  function findData(data, value, ...params) {
    // string kosong
    let str = '';
    // looping dan masukkan hasilnya kedalam variabel str 
    params.forEach(param => str += param.toLowerCase());
    /*
      jik ada data yang memiliki kesamaan dengan isi input
      pencarian, maka tampilkan. jika tidak memilili kesamaan,
      sembunyikan.
    */
    if (str.indexOf(value) != -1) return content.innerHTML += showCards(data);
  }
  
}
