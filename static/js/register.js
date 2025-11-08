const API_URL = 'https://backendapifutbol.up.railway.app';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Las contraseñas no coinciden';
        errorMessage.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/registry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mostrar mensaje de éxito y redirigir al login
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/';
        } else {
            errorMessage.textContent = data.message || 'Error al registrarse';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error de conexión con el servidor';
        errorMessage.classList.remove('hidden');
    }
});
