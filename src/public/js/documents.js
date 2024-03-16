
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const uploadAvatarForm = document.getElementById('uploadAvatarForm');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(uploadForm);
            const response = await fetch(uploadForm.action, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                showAlert('success', data.message, 'documentsAlertContainer'); 
                
            } else {
                showAlert('danger', 'Hubo un problema al actualizar los documentos.', 'documentsAlertContainer');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showAlert('danger', 'Hubo un problema al enviar el formulario.', 'documentsAlertContainer');
        }
    });

    uploadAvatarForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(uploadAvatarForm);
            const response = await fetch(uploadAvatarForm.action, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                showAlert('success', data.message, 'avatarAlertContainer');
            } else {
                showAlert('danger', 'Hubo un problema al actualizar el avatar.', 'avatarAlertContainer');
            }
        } catch (error) {
            console.error('Error al enviar el formulario de avatar:', error);
            showAlert('danger', 'Hubo un problema al Actualizar avatar', 'avatarAlertContainer');
        }
    });

    function showAlert(type, message, containerClass) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', `alert-${type}`);
        alertDiv.textContent = message;

        const alertContainer = document.querySelector(`.${containerClass}`);
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alertDiv);
    }
});

