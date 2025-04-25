// URLs base para las operaciones
const API_URL = 'http://localhost:5000/api/categorias';

// Función para cargar las categorías
async function loadCategories() {
    try {
        const response = await fetch(API_URL);
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        showAlert('Error al cargar las categorías', 'error');
    }
}

// Función para mostrar las categorías en la tabla
function displayCategories(categories) {
    const tableBody = document.getElementById('categoriesTable');
    if (!tableBody) return;

    tableBody.innerHTML = categories.map(category => `
        <tr>
            <td>${category.CategoriaID}</td>
            <td>${category.CategoriaNombre}</td>
            <td>${category.Descripcion}</td>
            <td>
                <img src="${category.Imagen}" alt="${category.CategoriaNombre}">
            </td>
            <td>
                <button class="btn btn-details" onclick="showDetails(${category.CategoriaID})">Details</button>
            </td>
            <td>
                <button class="btn btn-edit" onclick="editCategory(${category.CategoriaID})">Edit</button>
            </td>
            <td>
                <button class="btn btn-delete" onclick="deleteCategory(${category.CategoriaID})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Función para crear una nueva categoría
async function createCategory(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('CategoriaNombre', document.getElementById('nombre').value);
    formData.append('Descripcion', document.getElementById('descripcion').value);
    
    const imagenFile = document.getElementById('imagen').files[0];
    if (imagenFile) {
        formData.append('Imagen', imagenFile);
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showAlert('Categoría creada exitosamente', 'success');
            document.getElementById('categoryForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('registerCategory')).hide();
            loadCategories();
        } else {
            throw new Error('Error al crear la categoría');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al crear la categoría', 'error');
    }
}

// Función para mostrar detalles de una categoría
async function showDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const category = await response.json();
        
        // Aquí puedes implementar la lógica para mostrar los detalles
        // Por ejemplo, en un modal o en una sección específica
        console.log('Detalles de la categoría:', category);
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        showAlert('Error al obtener detalles', 'error');
    }
}

// Función para editar una categoría
async function editCategory(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const category = await response.json();
        
        // Llenar el formulario con los datos de la categoría
        document.getElementById('nombre').value = category.CategoriaNombre;
        document.getElementById('descripcion').value = category.Descripcion;
        
        // Cambiar el título del modal y el botón
        document.getElementById('registerCategoryLabel').textContent = 'Editar Categoría';
        const submitButton = document.querySelector('#categoryForm button[type="submit"]');
        submitButton.textContent = 'Actualizar';
        
        // Guardar el ID para la actualización
        submitButton.dataset.categoryId = id;
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('registerCategory'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar datos para edición:', error);
        showAlert('Error al cargar datos para edición', 'error');
    }
}

// Función para actualizar una categoría
async function updateCategory(event) {
    event.preventDefault();
    
    const categoryId = event.target.querySelector('button[type="submit"]').dataset.categoryId;
    const formData = new FormData();
    formData.append('CategoriaNombre', document.getElementById('nombre').value);
    formData.append('Descripcion', document.getElementById('descripcion').value);
    
    const imagenFile = document.getElementById('imagen').files[0];
    if (imagenFile) {
        formData.append('Imagen', imagenFile);
    }

    try {
        const response = await fetch(`${API_URL}/${categoryId}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            showAlert('Categoría actualizada exitosamente', 'success');
            document.getElementById('categoryForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('registerCategory')).hide();
            loadCategories();
        } else {
            throw new Error('Error al actualizar la categoría');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al actualizar la categoría', 'error');
    }
}

// Función para eliminar una categoría
async function deleteCategory(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('Categoría eliminada exitosamente', 'success');
                loadCategories();
            } else {
                throw new Error('Error al eliminar la categoría');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error al eliminar la categoría', 'error');
        }
    }
}

// Función para mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.querySelector('.categories-container').insertAdjacentElement('afterbegin', alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    
    const categoryForm = document.getElementById('categoryForm');
    categoryForm.addEventListener('submit', (event) => {
        const submitButton = event.target.querySelector('button[type="submit"]');
        if (submitButton.dataset.categoryId) {
            updateCategory(event);
        } else {
            createCategory(event);
        }
    });
}); 