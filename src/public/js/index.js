// Cliente
const socketClient = io();

function deleteProduct(id) {
  const productId = id;
  const userEmailInput = document.getElementById('userEmail');
  const userRoleInput = document.getElementById('userRole');

  const userEmail = userEmailInput.value.trim();
  const userRole = userRoleInput.value.trim();

  if (!userEmail || !userRole) {
    console.error('User email and role are required.');
    return;
  }

  socketClient.emit('deleteProduct', { productId, userEmail, userRole });
}

document.addEventListener('DOMContentLoaded', () => {
  // Campos del form
  const formularioAgregarProducto = document.getElementById('formularioAgregarProducto');
  const agregarProductoBtn = document.getElementById('agregarProductoBtn');  

  const titleInput = document.getElementById('titleAdd');
  const descriptionInput = document.getElementById('descriptionAdd');
  const priceInput = document.getElementById('priceAdd');
  const categoryInput = document.getElementById('categoryAdd');
  const codeInput = document.getElementById('codeAdd');
  const stockInput = document.getElementById('stockAdd');
  const thumbnailsInput = document.getElementById('thumbnailsAdd');
  const userRoleInput = document.getElementById('userRoleAdd');
  const userEmailInput = document.getElementById('userEmailAdd');


  agregarProductoBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const product = {
      title: titleInput.value,
      description: descriptionInput.value,
      price: parseFloat(priceInput.value),
      category: categoryInput.value,
      code: codeInput.value,
      stock: parseInt(stockInput.value),
      thumbnails: thumbnailsInput.value,
      owner: userRoleInput.value,
      ownerEmail: userEmailInput.value,
    };

    // Agregar producto
    socketClient.emit('addProduct', product);

    // Limpiar formulario
    titleInput.value = '';
    descriptionInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    codeInput.value = '';
    stockInput.value = '';
    thumbnailsInput.value = '';
  });

  socketClient.on('actualizarProductos', (productos) => {
    actualizarInterfaz(productos);
  });

  function actualizarInterfaz(productList) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    productList.forEach((product) => {
      const card = document.createElement('div');
      card.classList.add('cards');
      
      let imageTags = '';

    if (Array.isArray(product.thumbnails)) {
      product.thumbnails.forEach((thumbnail) => {
        if (thumbnail.filename) {
          const localImageUrl = `/docs/products/${thumbnail.filename}`;
          imageTags += `<img src="${localImageUrl}" alt="Imagen del producto" class="productImage">`;
        }else {
          imageTags += `<img src="${product.thumbnails}" alt="Imagen del producto" class="productImage">`;
        }
      });
    }

    card.innerHTML = `
      ${imageTags}
        <h3 class="cardTitle">${product.title}</h3>
        <h4 class="cardPrice">$${product.price}</h4>
        <h4 class="cardStock">Stock: ${product.stock}</h4>
        <p class="cardOwnerr">Correo electrónico: ${product.ownerEmail}</p>
        <button data-product-id="${product._id}" onclick="deleteProduct('${product._id}')">Eliminar✖️</button>
      `;

      container.appendChild(card);
    });
  }
});
