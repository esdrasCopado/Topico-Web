// Definir el template del componente
const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .profile-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 30px;
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            margin: 20px auto;
        }

        .profile-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .card-content {
            text-align: center;
            color: white;
        }

        .avatar-container {
            margin-bottom: 20px;
        }

        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 5px solid rgba(255, 255, 255, 0.3);
            object-fit: cover;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .username {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 0 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .bio {
            font-size: 14px;
            line-height: 1.6;
            margin: 10px 0 20px;
            opacity: 0.9;
        }

        .follow-btn {
            background-color: white;
            color: #667eea;
            border: none;
            padding: 12px 40px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .follow-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }

        .follow-btn:active {
            transform: scale(0.98);
        }

        .follow-btn.following {
            background-color: transparent;
            color: white;
            border: 2px solid white;
        }

        .follow-btn.following:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 20px;
            font-weight: bold;
            display: block;
        }

        .stat-label {
            font-size: 12px;
            opacity: 0.8;
            display: block;
            margin-top: 5px;
        }
    </style>

    <div class="profile-card">
        <div class="card-content">
            <div class="avatar-container">
                <img class="avatar" src="" alt="Avatar de perfil">
            </div>
            <h2 class="username"></h2>
            <p class="bio"></p>

            <div class="stats">
                <div class="stat">
                    <span class="stat-value followers-count">0</span>
                    <span class="stat-label">Seguidores</span>
                </div>
                <div class="stat">
                    <span class="stat-value following-count">0</span>
                    <span class="stat-label">Siguiendo</span>
                </div>
                <div class="stat">
                    <span class="stat-value posts-count">0</span>
                    <span class="stat-label">Publicaciones</span>
                </div>
            </div>

            <button class="follow-btn">Seguir</button>
        </div>
    </div>
`;

// Definir la clase del Web Component
class ProfileCard extends HTMLElement {
    constructor() {
        super();

        // Crear Shadow DOM
        this.attachShadow({ mode: 'open' });

        // Clonar el template y agregarlo al Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Estado del componente
        this.isFollowing = false;
        this.followersCount = Math.floor(Math.random() * 5000) + 100;
    }

    // Observar cambios en estos atributos
    static get observedAttributes() {
        return ['username', 'avatar', 'bio'];
    }

    // Ciclo de vida: cuando el componente se conecta al DOM
    connectedCallback() {
        this.updateCard();
        this.setupEventListeners();
        this.initializeStats();
    }

    // Actualizar la tarjeta con los valores de los atributos
    updateCard() {
        const username = this.getAttribute('username') || 'Usuario Anónimo';
        const avatar = this.getAttribute('avatar') || 'https://i.pravatar.cc/150?img=68';
        const bio = this.getAttribute('bio') || 'Sin biografía disponible';

        this.shadowRoot.querySelector('.username').textContent = username;
        this.shadowRoot.querySelector('.avatar').src = avatar;
        this.shadowRoot.querySelector('.avatar').alt = `Avatar de ${username}`;
        this.shadowRoot.querySelector('.bio').textContent = bio;
    }

    // Inicializar las estadísticas
    initializeStats() {
        this.shadowRoot.querySelector('.followers-count').textContent = this.followersCount.toLocaleString();
        this.shadowRoot.querySelector('.following-count').textContent = Math.floor(Math.random() * 1000) + 50;
        this.shadowRoot.querySelector('.posts-count').textContent = Math.floor(Math.random() * 500) + 10;
    }

    // Configurar event listeners
    setupEventListeners() {
        const followBtn = this.shadowRoot.querySelector('.follow-btn');
        followBtn.addEventListener('click', () => this.toggleFollow());
    }

    // Alternar estado de seguir
    toggleFollow() {
        this.isFollowing = !this.isFollowing;
        const followBtn = this.shadowRoot.querySelector('.follow-btn');
        const followersCountEl = this.shadowRoot.querySelector('.followers-count');

        if (this.isFollowing) {
            followBtn.textContent = 'Siguiendo';
            followBtn.classList.add('following');
            this.followersCount++;

            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('user-followed', {
                detail: { username: this.getAttribute('username') },
                bubbles: true,
                composed: true
            }));
        } else {
            followBtn.textContent = 'Seguir';
            followBtn.classList.remove('following');
            this.followersCount--;

            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('user-unfollowed', {
                detail: { username: this.getAttribute('username') },
                bubbles: true,
                composed: true
            }));
        }

        followersCountEl.textContent = this.followersCount.toLocaleString();
    }

    // Ciclo de vida: cuando un atributo observado cambia
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateCard();
        }
    }

    // Ciclo de vida: cuando el componente se desconecta del DOM
    disconnectedCallback() {
        const followBtn = this.shadowRoot.querySelector('.follow-btn');
        followBtn.removeEventListener('click', () => this.toggleFollow());
    }
}

// Registrar el Custom Element
customElements.define('profile-card', ProfileCard);

// Escuchar eventos personalizados (opcional - ejemplo de uso)
document.addEventListener('user-followed', (e) => {
    console.log(`¡Ahora sigues a ${e.detail.username}!`);
});

document.addEventListener('user-unfollowed', (e) => {
    console.log(`Has dejado de seguir a ${e.detail.username}`);
});
