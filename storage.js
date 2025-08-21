// Gestion du localStorage
const USERS_KEY = 'mystica_users';
const CURRENT_USER_KEY = 'mystica_current_user';
const CART_KEY = 'mystica_cart';
const PRODUCTS_KEY = 'mystica_products';

// Initialiser les données
function initializeData() {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(CART_KEY)) {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
    }
    // Réinitialisation automatique des produits à chaque chargement (dev)
    // Mettre à false en production
    const RESET_PRODUCTS_ON_LOAD = true;
    if (RESET_PRODUCTS_ON_LOAD || !localStorage.getItem(PRODUCTS_KEY)) {
        const defaultProducts = [
            {
                id: '1',
                name: 'Améthyste Brute',
                price: 24.9,
                category: 'pierres',
                stock: 15,
                image: 'https://unsplash.com/photos/6rlPfb5B5m4/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8QW0lQzMlQTl0aHlzdGUlMjBCcnV0ZXxmcnwwfHx8fDE3NTU3MzcwNjh8MA&force=true&w=640',
                description: 'Pierre de spiritualité et d\'apaisement, parfaite pour la méditation.'
            },
            {
                id: '2',
                name: 'Tarot de Marseille',
                price: 32.5,
                category: 'tarots',
                stock: 8,
                image: 'https://unsplash.com/photos/D3SzBCAeMhQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8VGFyb3R8ZnJ8MHx8fHwxNzU1NzQ2OTE1fDA&force=true&w=640',
                description: 'Jeu de tarot traditionnel pour la divination et la réflexion personnelle.'
            },
            {
                id: '3',
                name: 'Encens Lavande',
                price: 12.9,
                category: 'encens',
                stock: 3,
                image: 'https://unsplash.com/photos/DgFM-HXEB6Q/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8RW5jZW5zJTIwTGF2YW5kZXxmcnwwfHx8fDE3NTU3NDY4MjR8MA&force=true&w=640',
                description: 'Encens naturel à la lavande pour apaiser l\'esprit et purifier l\'air.'
            },
            {
                id: '4',
                name: 'Jade Polie',
                price: 19.5,
                category: 'pierres',
                stock: 0,
                image: 'https://unsplash.com/photos/G5tpzVIehFc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8SmFkZSUyMFBvbGllfGZyfDB8fHx8MTc1NTc0Njc0M3ww&force=true&w=1920',
                description: 'Pierre de sagesse et de prospérité, apporte équilibre et harmonie.'
            },
            {
                id: '5',
                name: 'Oracle Lunaire',
                price: 28.9,
                category: 'tarots',
                stock: 6,
                image: 'https://unsplash.com/photos/UbvcYKScirk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8JTI3T3JhY2xlJTIwTHVuYWlyZXxmcnwwfHx8fDE3NTU3NDY1OTF8MA&force=true&w=640',
                description: 'Jeu d\'oracle inspiré par les cycles de la lune et l\'intuition féminine.'
            },
            {
                id: '6',
                name: 'Sauge Blanche',
                price: 9.9,
                category: 'encens',
                stock: 20,
                image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                description: 'Sauge blanche naturelle pour la purification des espaces et des énergies.'
            }
        ];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    }
    updateCartCount();
}

// Obtenir les utilisateurs
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Sauvegarder les utilisateurs
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Obtenir l'utilisateur courant
function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
}

// Définir l'utilisateur courant
function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

// Obtenir le panier
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Sauvegarder le panier
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Obtenir les produits
function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

// Sauvegarder les produits
function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        
        // Définir l'icône et la couleur selon le type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        notification.innerHTML = `<i class="fas ${icon}"></i> <span id="notificationText">${message}</span>`;
        notification.className = `notification ${type} show`;
        
        // Masquer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Fermer une modale
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fermer les modales en cliquant à l'extérieur
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};