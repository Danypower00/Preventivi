document.addEventListener("DOMContentLoaded", () => {
  const productTableBody = document.querySelector("#product-table tbody");
  const discountInput = document.getElementById("discount");
  const subtotalElem = document.getElementById("subtotal");
  const vatElem = document.getElementById("vat");
  const totalElem = document.getElementById("total");
  const addProductButton = document.getElementById("add-product");

  let products = [];

  const updateTotals = () => {
    const subtotal = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
    const vat = subtotal * 0.22;
    const discount = parseFloat(discountInput.value) || 0;
    const total = subtotal + vat - discount;

    subtotalElem.textContent = subtotal.toFixed(2);
    vatElem.textContent = vat.toFixed(2);
    totalElem.textContent = total >= 0 ? total.toFixed(2) : "0.00";
  };

  const addProductToTable = (product, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.quantity}</td>
      <td>${product.description}</td>
      <td>${product.price.toFixed(2)} €</td>
      <td>${(product.quantity * product.price).toFixed(2)} €</td>
      <td><button class="remove-product" data-index="${index}">Rimuovi</button></td>
    `;

    productTableBody.appendChild(row);
  };

  addProductButton.addEventListener("click", () => {
    const description = document.getElementById("product-name").value.trim();
    const quantity = parseInt(document.getElementById("product-quantity").value, 10);
    const price = parseFloat(document.getElementById("product-price").value);

    if (!description || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      alert("Inserisci tutti i dati correttamente!");
      return;
    }

    const product = { description, quantity, price };
    products.push(product);
    productTableBody.innerHTML = "";
    products.forEach((prod, idx) => addProductToTable(prod, idx));
    updateTotals();

    document.getElementById("product-name").value = "";
    document.getElementById("product-quantity").value = "";
    document.getElementById("product-price").value = "";
  });

  productTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-product")) {
      const index = parseInt(event.target.dataset.index, 10);
      products.splice(index, 1);
      productTableBody.innerHTML = "";
      products.forEach((prod, idx) => addProductToTable(prod, idx));
      updateTotals();
    }
  });
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registrato con successo:', registration);
      }).catch((error) => {
        console.log('Errore nel registrare il Service Worker:', error);
      });
    });
  }
  

  discountInput.addEventListener("input", updateTotals);
});
