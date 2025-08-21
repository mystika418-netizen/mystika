// Gestion de l'authentification

// Ouvrir la modale d'authentification
function openAuth() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'flex';
    }
}

// Changer d'onglet dans l'authentification
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    const tabElement = document.querySelector(`.auth-tab:nth-child(${tab === 'login' ? 1 : 2})`);
    const formElement = document.getElementById(`${tab}Form`);
    
    if (tabElement && formElement) {
        tabElement.classList.add('active');
        formElement.classList.add('active');
    }
}

// S'inscrire
function register() {
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    // Vérifier si l'utilisateur existe déjà
    const users = getUsers();
    if (users.find(user => user.email === email)) {
        showNotification('Un compte avec cet email existe déjà', 'error');
        return;
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password, // Dans une vraie app, cela devrait être hashé
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    
    showNotification('Compte créé avec succès!', 'success');
    closeModal('authModal');
}

// Se connecter
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        showNotification(`Bienvenue ${user.firstName} !`, 'success');
        closeModal('authModal');
    } else {
        showNotification('Email ou mot de passe incorrect', 'error');
    }
}

// Se déconnecter
function logout() {
    setCurrentUser(null);
    showNotification('Vous avez été déconnecté', 'success');
}

// Authentifier l'admin
function authenticateAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === 'julus123') {
        closeModal('adminAuthModal');
        showNotification('Accès administrateur autorisé', 'success');
        return true;
    } else {
        showNotification('Mot de passe incorrect', 'error');
        return false;
    }
}