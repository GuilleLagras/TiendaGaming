function showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className} mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.appendChild(document.createTextNode(message));

    const container = document.querySelector('.sesionesChild');

    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

document.getElementById('restoreForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    fetch('/api/sessions/restore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => {
        if (response.status === 404) {
            return response.json().then(data => {
                showAlert(data.message, 'alert-warning');
            });
        }
        return response.json().then(data => {
            showAlert(data.message, 'alert-success');
        });
    })
    .catch(error => {
        console.error('Error:', error.message);
        showAlert('Error al enviar el formulario.', 'alert-danger');
    });
});

