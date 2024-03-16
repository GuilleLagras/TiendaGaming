
document.addEventListener('DOMContentLoaded', () => {
    const multerSubmitBtn = document.getElementById('multerSubmitBtn');
    const productForm = document.getElementById('productForm');

     multerSubmitBtn.addEventListener('click', () => {
        submitFormViaSocket(productForm);
    });

    async function submitFormViaSocket(form) {
         const formData = new FormData(form);

        try {
             const response = await fetch('/products/multer', {
                method: 'POST',
                body: formData,
            });

             if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el producto');
            }

           const result = await response.json();
            alert(result.message);

            const userEmail = form.querySelector('[name="userEmail"]').value;
            const userRole = form.querySelector('[name="userRole"]').value;

                socketClient.emit('addProduct', {
                ...Object.fromEntries(formData.entries()),
                owner: userRole,
                ownerEmail: userEmail,
            });
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error en la solicitud: ' + error);
        }
    }
});