const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// Egyszerűsített függvény az elem kiválasztásához
function getById(id) {
    return document.getElementById(id);
  }
  
  // Fő alkalmazás-állapot
  var state = {
    products: [],
    editedId: ''
  };
  
  // Renderelje ki a termékeket
  function renderProducts() {
    var productList = getById("product-list-component");
    productList.innerHTML = "";
  
    state.products.forEach(function (product) {
      var productCard = document.createElement("div");
      productCard.className = "card m-2 p-2";
      productCard.innerHTML = `
        <p><strong>Név:</strong> ${product.name}</p>
        <p><strong>Ár:</strong> ${product.price} Ft</p>
        <p>${product.isInStock ? "Készleten" : "Nincs készleten"}</p>
        <button class="btn btn-warning edit-product" data-productid="${product.id}">Szerkesztés</button>
        <button class="btn btn-danger delete-product" data-productid="${product.id}">Törlés</button>
      `;
  
      productList.appendChild(productCard);
  
      // Szerkesztés gomb eseménykezelő
      productCard.querySelector(".edit-product").addEventListener("click", function () {
        editProduct(product.id);
      });
  
      // Törlés gomb eseménykezelő
      productCard.querySelector(".delete-product").addEventListener("click", function () {
        deleteProduct(product.id);
      });
    });
  }
  
  // Szerkesztett termék adatainak megjelenítése a formban
  function renderEditProduct() {
    var editForm = getById("edit-product");
  
    if (state.editedId === '') {
      editForm.innerHTML = '';
      return;
    }
  
    var foundProduct = state.products.find(product => product.id === state.editedId);
  
    var editFormHTML = `
      <h3>Termék szerkesztése:</h3>
      <form id="update-product" class="p-5">
        <label class="w-100">
          Név:
          <input class="form-control" type="text" name="name" value="${foundProduct.name}">
        </label>
        <label class="w-100">
          Ár:
          <input class="form-control" type="number" name="price" value="${foundProduct.name}">
        </label>
        <label class="w-100">
          Van készleten?
          <input class="form-control" type="checkbox" name="isInStock" ${foundProduct.isInStock ? 'checked' : ''}>
        </label>
        <button class="btn btn-primary" type="submit">Küldés</button>
      </form>
    `;
  
    editForm.innerHTML = editFormHTML;
  
    // Szerkesztés elküldése
    getById('update-product').onsubmit = function (event) {
      event.preventDefault();
      var price = Number(event.target.elements.price.value);
      var name = event.target.elements.name.value;
      var isInStock = event.target.elements.isInStock.checked;
  
      var foundIndex = state.products.findIndex(product => product.id === state.editedId);
  
      // Állapot változtatás
      state.products[foundIndex] = {
        id: state.editedId,
        name: name,
        price: price,
        isInStock: isInStock,
      };
      state.editedId = '';
  
      // Renderelés
      renderProducts();
      renderEditProduct();
    };
  }
  
  // Termék hozzáadása
  getById("create-product").onsubmit = function (event) {
    event.preventDefault();
    var price = Number(event.target.elements.price.value);
    var name = event.target.elements.name.value;
    var isInStock = event.target.elements.isInStock.checked;
  
    // Állapot változtatás
    state.products.push({
      id: uuidv4(),
      name: name,
      price: price,
      isInStock: isInStock
    });
  
    // Renderelés
    renderProducts();
  };
  
  // Szerkesztés gombra kattintás eseménykezelő
  function editProduct(id) {
    state.editedId = id;
    renderEditProduct();
  }
  
  // Törlés gombra kattintás eseménykezelő
  function deleteProduct(id) {
    // Állapot változtatás
    state.products = state.products.filter(product => product.id !== id);
  
    // Renderelés
    renderProducts();
  }
  
  // Segédfüggvény a UUID létrehozásához
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // Kezdeti renderelés
  renderProducts();
  
  