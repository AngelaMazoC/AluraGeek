document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  const productContainer = document.getElementById("product-container");

  // Mostrar Productos
  fetchProducts();

  form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("product-name").value;
      const price = document.getElementById("product-price").value;
      const imageUrl = document.getElementById("product-image-url").value;
      addProduct({ name, price, imageUrl });
  });

  document.querySelector(".btn-clear").addEventListener("click", () => {
      form.reset();
  });

  async function fetchProducts() {
      const response = await fetch('http://localhost:3000/products');
      const products = await response.json();
      products.forEach(product => createProductCard(product));
  }

  async function addProduct(product) {
      const response = await fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
      });
      const newProduct = await response.json();
      createProductCard(newProduct);
      form.reset();
  }

  function createProductCard(product) {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price-container">
              <span class="price">$${product.price}</span>
              <span class="delete-icon" data-id="${product.id}">🗑️</span>
          </div>
      `;

      card.querySelector(".delete-icon").addEventListener("click", (e) => {
          const productId = e.target.dataset.id;
          if (confirm("¿Estás seguro de eliminar este producto?")) {
              deleteProduct(productId, card);
          }
      });

      productContainer.appendChild(card);
  }

  async function deleteProduct(productId, card) {
      await fetch(`http://localhost:3000/products/${productId}`, {
          method: 'DELETE'
      });
      card.remove();
  }
});
