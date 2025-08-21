// Gestion des produits

// Charger les produits
function loadProducts(category = 'all') {
    const products = getProducts();
    const productsContainer = document.getElementById('productsContainer');
    
    if (!productsContainer) return;
    
    // Effacer le conteneur
    productsContainer.innerHTML = '';
    
    // Filtrer les produits par catégorie si nécessaire
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">Aucun produit disponible</p>';
        return;
    }
    
    // Afficher les produits
    filteredProducts.forEach(product => {
        const stockStatus = product.stock > 5 ? 'in-stock' : (product.stock > 0 ? 'low-stock' : 'out-of-stock');
        const stockText = product.stock > 5 ? 'En stock' : (product.stock > 0 ? 'Stock faible' : 'Rupture de stock');
        const stockIcon = product.stock > 5 ? 'fa-check-circle' : (product.stock > 0 ? 'fa-exclamation-circle' : 'fa-times-circle');
        
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0;">
                ${product.stock === 0 ? '<span class="product-badge badge-sale">Rupture</span>' : 
                  product.stock < 5 ? '<span class="product-badge badge-popular">Populaire</span>' : 
                  '<span class="product-badge badge-new">Nouveau</span>'}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span>${product.price.toFixed(2)} €</span>
                    <button class="btn" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Indisponible' : 'Ajouter'}
                    </button>
                </div>
                <p class="product-stock ${stockStatus}"><i class="fas ${stockIcon}"></i> ${stockText}</p>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
}

// Filtrer les produits
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const category = categoryFilter ? categoryFilter.value : 'all';
    loadProducts(category);
}

// Ajouter un produit (admin)
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const imageInput = document.getElementById('productImage');
    const description = document.getElementById('productDescription').value;
    
    // Validation
    if (!name || !price || !category || isNaN(stock) || !description) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (price <= 0) {
        showNotification('Le prix doit être supérieur à 0', 'error');
        return;
    }
    
    if (stock < 0) {
        showNotification('Le stock ne peut pas être négatif', 'error');
        return;
    }
    
    const products = getProducts();
    
    // Gérer l'upload d'image
    let imageUrl = '';
    if (imageInput.files && imageInput.files[0]) {
        // Utiliser le DataURL généré par la prévisualisation
        const previewImg = document.querySelector('#imagePreview img');
        if (previewImg && previewImg.src.startsWith('data:image')) {
            imageUrl = previewImg.src;
        } else {
            showNotification('Erreur lors de la récupération de l\'image', 'error');
            return;
        }
    } else {
        showNotification('Veuillez sélectionner une image', 'error');
        return;
    }
    
    // Créer un nouveau produit
    const newProduct = {
        id: Date.now().toString(),
        name,
        price,
        category,
        stock,
        image: imageUrl,
        description
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    // Réinitialiser le formulaire
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('imagePreview').innerHTML = '<div class="image-preview-placeholder">Aperçu de l\'image</div>';
    document.getElementById('fileName').textContent = 'Aucun fichier choisi';
    
    showNotification('Produit ajouté avec succès!', 'success');
    
    // Recharger les produits dans l'admin
    loadAdminProducts();
    // Recharger la liste publique des produits
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
}

// Charger les produits dans l'admin
function loadAdminProducts() {
    const products = getProducts();
    const adminProductsContainer = document.getElementById('adminProductsContainer');
    
    if (!adminProductsContainer) return;
    
    // Effacer le conteneur
    adminProductsContainer.innerHTML = '';
    
    if (products.length === 0) {
        adminProductsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">Aucun produit disponible</p>';
        return;
    }
    
    // Afficher les produits pour l'admin
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'admin-product-card';
        productElement.innerHTML = `
            <div class="admin-product-image">
                <img src="${product.image}" alt="${product.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0;">
            </div>
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p>${product.price.toFixed(2)} €</p>
                <p>Stock: ${product.stock}</p>
                <div class="admin-product-actions">
                    <button class="btn btn-outline" onclick="editProduct('${product.id}')">Modifier</button>
                    <button class="btn btn-outline" onclick="deleteProduct('${product.id}')">Supprimer</button>
                </div>
            </div>
        `;
        
        adminProductsContainer.appendChild(productElement);
    });
}

// Modifier un produit
function editProduct(productId) {
    showNotification('Fonctionnalité d\'édition à implémenter', 'info');
}

// Supprimer un produit
function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
        const products = getProducts();
        const newProducts = products.filter(product => product.id !== productId);
        saveProducts(newProducts);
        loadAdminProducts();
        showNotification('Produit supprimé avec succès', 'success');
    }
}

// Prévisualiser l'image avant l'upload
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const fileName = document.getElementById('fileName');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu de l'image">`;
        }
        
        reader.readAsDataURL(input.files[0]);
        fileName.textContent = input.files[0].name;
    }
}