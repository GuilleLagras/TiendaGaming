
document.querySelector('.botonDetail').addEventListener('click', function() {
    const productId = this.getAttribute('data-product');
    const cartId = this.getAttribute('data-cart');
    const quantityInput = document.getElementById(`productQuantity_${productId}`);
    const quantity = parseInt(quantityInput.value, 10);
    const maxStock = parseInt(quantityInput.getAttribute('max'), 10);

    if (quantity > maxStock) {
        // Más del stock
        showAlert('Error: La cantidad excede el stock disponible.', 'alert-danger');
    } else {
        addProductToCart(cartId, productId, quantity);
        }
});

function showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className} mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.appendChild(document.createTextNode(message));

    const container = document.querySelector('.detalle');

    container.insertBefore(alertDiv, container.firstChild);
    // Tiempo del alert
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}

function addProductToCart(cartId, productId, quantity) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: quantity })
    })
    .then(response => {
        if (response.ok) {
            showAlert('Producto agregado al carrito exitosamente.','alert-success');
        } else if (response.status === 403) {
            showAlert('Eres el dueño de este producto. No tienes permisos para esta acción.', 'alert-warning');
        } else if (response.status === 400) {
            showAlert('Error: La cantidad excede el stock disponible.', 'alert-danger');
        } else {
            showAlert('Error al agregar producto: ' + response.status, 'alert-danger');
        }
    })
    .catch(error => {
        alert('Error en la solicitud: ' + error.message);
    });
}
