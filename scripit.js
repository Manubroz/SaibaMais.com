// ==================== DADOS DOS TÓPICOS SECRETOS ====================
const secretTopics = {
    "alta cupula": {
        title: "Alta Cúpula",
        password: "senha123",           // ← Mude depois para algo forte
        content: `
            <h2>Alta Cúpula</h2>
            <p>Conteúdo secreto sobre a alta cúpula aqui...</p>
            <p>Você pode colocar calendário de planos, nomes, etc.</p>
        `
    },
    "planos": {
        title: "Planos da Elite",
        password: "planos2026",
        content: `
            <h2>Planos da Elite</h2>
            <p>Informações sobre calendário de planos...</p>
        `
    }
    // Adicione mais tópicos aqui facilmente
};

// ==================== VARIÁVEIS GLOBAIS ====================
let currentTopicKey = null;
let attempts = {};

// ==================== FUNÇÃO DE BUSCA ====================
function searchTopics() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    const visibleCards = document.getElementById('visibleCards');

    if (query === "") {
        visibleCards.style.display = 'flex';
        resultsContainer.style.display = 'none';
        return;
    }

    visibleCards.style.display = 'none';
    resultsContainer.style.display = 'flex';
    resultsContainer.innerHTML = '';

    let found = false;

    Object.keys(secretTopics).forEach(key => {
        if (key.includes(query)) {
            found = true;
            const topic = secretTopics[key];
            
            const cardHTML = `
                <div class="card" onclick="openPasswordModal('${key}')">
                    <h3>${topic.title}</h3>
                    <p>Clique para acessar (conteúdo restrito)</p>
                </div>
            `;
            resultsContainer.innerHTML += cardHTML;
        }
    });

    if (!found) {
        resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:40px;">Nenhum tópico encontrado para "${query}". Tente outro termo.</p>`;
    }
}

// ==================== MODAL DE SENHA ====================
function openPasswordModal(key) {
    currentTopicKey = key;
    const topic = secretTopics[key];
    
    document.getElementById('modalTitle').textContent = topic.title;
    document.getElementById('modalTopic').textContent = `Tópico: ${topic.title}`;
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMsg').textContent = '';
    
    document.getElementById('passwordModal').style.display = 'flex';
    document.getElementById('passwordInput').focus();
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const topic = secretTopics[currentTopicKey];
    const errorMsg = document.getElementById('errorMsg');

    if (password === topic.password) {
        closeModal();
        showContent(currentTopicKey);
    } else {
        attempts[currentTopicKey] = (attempts[currentTopicKey] || 0) + 1;
        
        if (attempts[currentTopicKey] >= 3) {
            errorMsg.textContent = "Muitas tentativas. Tente novamente mais tarde.";
            setTimeout(closeModal, 2000);
        } else {
            errorMsg.textContent = `Senha incorreta. Tentativa ${attempts[currentTopicKey]}/3`;
        }
    }
}

function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

function showContent(key) {
    const topic = secretTopics[key];
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="UTF-8"><title>${topic.title}</title>
        <style>body {font-family: Arial; padding: 40px; background: #f4f6f9;}</style>
        </head>
        <body>${topic.content}</body></html>
    `);
}

// ==================== FECHAR MODAL COM ESC ====================
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        closeModal();
    }
});