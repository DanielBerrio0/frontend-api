const API_URL = 'https://backendapifutbol.up.railway.app';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userEmail', email);
            
            // Redirigir al dashboard
            window.location.href = '/dashboard';
        } else {
            errorMessage.textContent = data.message || 'Error al iniciar sesión';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error de conexión con el servidor';
        errorMessage.classList.remove('hidden');
    }
});
