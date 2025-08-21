// Générer les détails de la commande en HTML stylé
function generateOrderDetailsHTML() {
    const cart = getCart();
    const currentUser = getCurrentUser();
    let total = 0;
    let html = `<div class="order-summary-email">
        <div class="order-header">
            <span class="order-icon">💎</span>
            <span class="order-title"><strong>DÉTAILS DE LA COMMANDE MYSTICA</strong></span>
        </div>
        <div class="order-grid">
            <div class="order-section order-products">
                <div class="section-title"><strong>🛒 Produits commandés</strong></div>
                <table class="order-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Qté</th>
                            <th>Prix</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>`;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `<tr>
            <td><strong>${item.name}</strong></td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)} €</td>
            <td>${itemTotal.toFixed(2)} €</td>
        </tr>`;
    });
    html += `</tbody>
                </table>
                <div class="order-totals">
                    <div><span>Sous-total :</span> <span>${total.toFixed(2)} €</span></div>
                    <div><span>Frais livraison :</span> <span>4.99 €</span></div>
                    <div class="order-total"><span>💰 TOTAL :</span> <span>${(total + 4.99).toFixed(2)} €</span></div>
                </div>
            </div>
            <div class="order-section order-client">
                <div class="section-title"><strong>👤 Informations client</strong></div>
                <div class="order-client-grid">
                    ${currentUser ? `<div><strong>Nom :</strong> <span>${currentUser.firstName} ${currentUser.lastName}</span></div>
                    <div><strong>Email :</strong> <span>${currentUser.email}</span></div>` : `<div><strong>Client :</strong> <span>Visiteur (merci de préciser vos coordonnées)</span></div>`}
                </div>
            </div>
            <div class="order-section order-date">
                <div class="section-title"><strong>📅 Date</strong></div>
                <div>${new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
            </div>
            <div class="order-section order-livraison">
                <div class="section-title"><strong>📦 Informations de livraison</strong></div>
                <div>Veuillez indiquer votre adresse de livraison complète</div>
            </div>
            <div class="order-section order-paiement">
                <div class="section-title"><strong>💳 Modalités de paiement</strong></div>
                <ul>
                    <li>Virement bancaire</li>
                    <li>PayPal</li>
                    <li>Carte bancaire (lors de la livraison)</li>
                </ul>
            </div>
            <div class="order-section order-merci">
                <div class="section-title"><strong>🙏 Merci pour votre commande !</strong></div>
                <div>L’équipe Mystica 💎</div>
            </div>
        </div>
    </div>`;
    return html;
}
// Gestion du panier

// Ajouter au panier
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Produit non trouvé', 'error');
        return;
    }
    
    if (product.stock < 1) {
        showNotification('Ce produit est en rupture de stock', 'error');
        return;
    }
    
    const cart = getCart();
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Mettre à jour la quantité
        cart[existingItemIndex].quantity += 1;
    } else {
        // Ajouter un nouvel article
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification(`${product.name} ajouté au panier`, 'success');
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    // Effacer le contenu précédent
    cartItemsElement.innerHTML = '';
    
    // Obtenir le panier
    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p style="text-align: center; padding: 2rem;">Votre panier est vide</p>';
        cartTotalElement.textContent = 'Total: 0,00 €';
        return;
    }
    
    // Ajouter les articles à l'affichage du panier
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} €/unité</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">${itemTotal.toFixed(2)} €</div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsElement.appendChild(itemElement);
    });
    
    // Mettre à jour le total
    cartTotalElement.textContent = `Total: ${total.toFixed(2)} €`;
}

// Mettre à jour la quantité d'un article
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart(cart);
        updateCartDisplay();
    }
}

// Supprimer du panier
function removeFromCart(itemId) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== itemId);
    saveCart(newCart);
    updateCartDisplay();
    showNotification('Article retiré du panier', 'success');
}

// Générer les détails de la commande
function generateOrderDetails() {
    const cart = getCart();
    const currentUser = getCurrentUser();
    

    let orderSummary = '💎==============================💎\n';
    orderSummary += '         DÉTAILS DE LA COMMANDE MYSTICA\n';
    orderSummary += '💎==============================💎\n\n';
    orderSummary += '🛒 PRODUITS COMMANDÉS :\n';
    orderSummary += '----------------------------------------\n';
    orderSummary += 'Produit           | Qté | Prix   | Total\n';
    orderSummary += '----------------------------------------\n';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        // Format aligné
        const productName = item.name.length > 15 ? item.name.substring(0, 12) + '...' : item.name;
        orderSummary += `${productName.padEnd(16)}| ${String(item.quantity).padEnd(3)}| ${item.price.toFixed(2).padEnd(6)}€| ${itemTotal.toFixed(2).padEnd(6)}€\n`;
    });
    orderSummary += '----------------------------------------\n';
    orderSummary += `Sous-total      : ${total.toFixed(2)} €\n`;
    orderSummary += `Frais livraison : 4.99 €\n`;
    orderSummary += `💰 TOTAL         : ${(total + 4.99).toFixed(2)} €\n\n`;

    orderSummary += '👤 INFORMATIONS CLIENT :\n';
    orderSummary += '----------------------------------------\n';
    if (currentUser) {
        orderSummary += `Nom   : ${currentUser.firstName} ${currentUser.lastName}\n`;
        orderSummary += `Email : ${currentUser.email}\n`;
    } else {
        orderSummary += `Client : Visiteur (merci de préciser vos coordonnées)\n`;
    }
    orderSummary += '----------------------------------------\n';

    orderSummary += `📅 DATE : ${new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}\n\n`;

    orderSummary += '📦 INFORMATIONS DE LIVRAISON :\n';
    orderSummary += '----------------------------------------\n';
    orderSummary += 'Veuillez indiquer votre adresse de livraison complète\n\n';

    orderSummary += '💳 MODALITÉS DE PAIEMENT :\n';
    orderSummary += '----------------------------------------\n';
    orderSummary += '- Virement bancaire\n- PayPal\n- Carte bancaire (lors de la livraison)\n\n';

    orderSummary += '🙏 MERCI POUR VOTRE COMMANDE !\n';
    orderSummary += 'L’équipe Mystica 💎';

    return orderSummary;
}

// Passer la commande
function checkout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }
    
    showNotification('Préparation de votre commande...', 'info');
    const orderDetails = generateOrderDetails();
    const orderReference = `CMD-${Date.now().toString().slice(-6)}`;
    const subject = `💎 Commande Mystica #${orderReference}`;
    const body = orderDetails;
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // Détection mobile simple
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Utiliser mailto sur mobile
        const mailtoUrl = `mailto:mystika418@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
        window.location.href = mailtoUrl;
    } else {
        // Utiliser Gmail sur desktop
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=mystika418@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
        const newWindow = window.open(gmailUrl, '_blank');
        if (newWindow) {
            setTimeout(() => {
                saveCart([]);
                updateCartCount();
                showNotification('Votre commande a été préparée! Veuillez envoyer l\'email.', 'success');
            }, 2000);
        } else {
            showNotification('Ouvrez manuellement votre Gmail et copiez le texte ci-dessous', 'info');
            const emailContentElement = document.getElementById('emailContent');
            const emailTemplateElement = document.getElementById('emailTemplate');
            if (emailContentElement && emailTemplateElement) {
                emailContentElement.style.display = 'block';
                emailTemplateElement.innerHTML = generateOrderDetailsHTML();
            }
        }
    }
}