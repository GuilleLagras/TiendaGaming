
function showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className} mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.appendChild(document.createTextNode(message));

    const container = document.querySelector('.sesionesChild');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}

document.getElementById('restorePasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = window.location.pathname.split('/').pop();

    if (newPassword !== confirmPassword) {
        showAlert('Las contraseñas no coinciden.', 'alert-danger');
        return;
    }

    try {
        const response = await fetch(`/api/sessions/restorePassword/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword,
            }),
        });

        const data = await response.json();

        if (response.status === 400) {
            showAlert(data.message, 'alert-warning');
        } else if (response.status === 200) {
            showAlert(data.success, 'alert-success');
            window.location.href = '/login';
        } else {
            showAlert('Error desconocido durante el restablecimiento de la contraseña.', 'alert-danger');
        }
    } catch (error) {
        console.error('Error durante el restablecimiento de la contraseña:', error);
        showAlert('Error durante el restablecimiento de la contraseña. Por favor, inténtalo de nuevo más tarde.', 'alert-danger');
    }
});