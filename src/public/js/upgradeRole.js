function showAlert(message, className, redirectUrl) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className} mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.appendChild(document.createTextNode(message));

    const container = document.querySelector('.detalle');

    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();

        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, 5000);
}

document.getElementById('role-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const selectedRole = formData.get('newRole');
    const userId = formData.get('userId');
    try {
        const response = await fetch(`/api/users/premium/${userId}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' ,
            },
            body: `newRole=${selectedRole}&userId=${userId}`,
        });

        if (response.ok) {
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && (contentType.includes('application/json') || contentType.includes('text/html'))) {
                    const result = await response.json();
                    console.log('Respuesta JSON:', result);

                    showAlert('Rol cambiado correctamente, sera redireccionado al login para actualizar su información', 'alert-success', '/login');
                    
                } else {
                    console.error('La respuesta no es JSON válido ni HTML. Tipo de contenido inesperado:', contentType);
                }
            } catch (jsonError) {
                console.error('Error al analizar la respuesta JSON:', jsonError);
            }
        } else {
            console.error(`Error al cambiar el rol del usuario. Código de estado: ${response.status}`);

            const errorMessage = await response.text();

            showAlert(`Error al cambiar el rol del usuario. ${errorMessage}`, 'alert-danger');
        }
    } catch (error) {
        showAlert('Error al procesar la solicitud.', 'alert-danger');
    }
});