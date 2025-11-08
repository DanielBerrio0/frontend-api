const API_URL = 'https://backendapifutbol.up.railway.app';

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    cargarPaises();
});

// Cargar países
async function cargarPaises() {
    const token = localStorage.getItem('token');
    const tablaPaises = document.getElementById('tablaPaises');
    
    try {
        const response = await fetch(`${API_URL}/futbol/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const paises = await response.json();
            tablaPaises.innerHTML = '';
            
            paises.forEach(pais => {
                const tr = document.createElement('tr');
                const mundiales = pais.mundiales.map(m => m.title).join(', ') || 'Sin mundiales';
                tr.innerHTML = `
                    <td>${pais.id}</td>
                    <td>${pais.nombre_pais}</td>
                    <td>${mundiales}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-action" onclick="editarPais(${pais.id}, '${pais.nombre_pais}', '${mundiales}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-action" onclick="eliminarPais(${pais.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                `;
                tablaPaises.appendChild(tr);
            });
        } else if (response.status === 401) {
            // Token inválido, redirigir al login
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los países');
    }
}

// Manejar el formulario de país
document.getElementById('formPais').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!e.target.checkValidity()) {
        e.target.classList.add('was-validated');
        return;
    }
    
    const token = localStorage.getItem('token');
    const paisId = document.getElementById('paisId').value;
    const nombre = document.getElementById('nombrePais').value;
    const mundialAnio = document.getElementById('mundialAnio').value;
    
    try {
        let response;
        
        if (paisId) {
            // Actualizar país existente
            response = await fetch(`${API_URL}/futbol/${paisId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre_pais: nombre
                })
            });
        } else {
            // Crear nuevo país
            response = await fetch(`${API_URL}/futbol/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre_pais: nombre
                })
            });
            
            if (response.ok) {
                const paisCreado = await response.json();
                
                // Agregar el mundial al país
                await fetch(`${API_URL}/futbol/${paisCreado.id}/mundiales`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: `Mundial ${mundialAnio}`
                    })
                });
            }
        }
        
        if (response.ok) {
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalPais'));
            modal.hide();
            
            // Limpiar formulario
            document.getElementById('formPais').reset();
            document.getElementById('formPais').classList.remove('was-validated');
            document.getElementById('paisId').value = '';
            document.getElementById('modalPaisLabel').textContent = 'Agregar País';
            
            // Recargar tabla
            cargarPaises();
            
            alert(paisId ? 'País actualizado exitosamente' : 'País agregado exitosamente');
        } else {
            const data = await response.json();
            alert(data.message || data.error || 'Error al guardar el país');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});

// Editar país
function editarPais(id, nombre, mundiales) {
    document.getElementById('paisId').value = id;
    document.getElementById('nombrePais').value = nombre;
    document.getElementById('mundialAnio').value = mundiales;
    document.getElementById('modalPaisLabel').textContent = 'Editar País';
    
    const modal = new bootstrap.Modal(document.getElementById('modalPais'));
    modal.show();
}

// Eliminar país
async function eliminarPais(id) {
    if (!confirm('¿Está seguro de eliminar este país?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/futbol/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('País eliminado exitosamente');
            cargarPaises();
        } else {
            const data = await response.json();
            alert(data.message || data.error || 'Error al eliminar el país');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
}

// Cerrar sesión
document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
});

// Limpiar formulario al cerrar modal
document.getElementById('modalPais').addEventListener('hidden.bs.modal', () => {
    document.getElementById('formPais').reset();
    document.getElementById('formPais').classList.remove('was-validated');
    document.getElementById('paisId').value = '';
    document.getElementById('modalPaisLabel').textContent = 'Agregar País';
});
