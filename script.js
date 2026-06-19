// ==================== CONFIGURAÇÕES GLOBAIS ====================
const MASTER_PASSWORD = "mestre2026";   // ← MUDE ESTA SENHA PARA ALGO QUE SÓ VOCÊ SAIBA!

const secretTopics = {
    "alta cupula": {
        title: "Alta Cúpula",
        password: "senha123",
        content: `
            <h2>Alta Cúpula</h2>
            <p>Conteúdo secreto sobre a alta cúpula aqui...</p>
            <p>Adicione suas informações restritas.</p>
        `
    },
    "planos": {
        title: "Planos da Elite",
        password: "planos2026",
        content: `
            <h2>Calendário de Planos</h2>
            <p>Informações sobre os planos da elite...</p>
        `
    },
    "elite": {
        title: "A Elite Global",
        password: "elite2026",
        content: `
            <h2>A Elite Global</h2>
            <p>Informações sobre as famílias e organizações que controlam o mundo.</p>
        `
    },
    "agenda2030": {
        title: "Agenda 2030",
        password: "agenda2030",
        content: `
            <h2>Agenda 2030 - O Grande Plano</h2>
            <p>Detalhes sobre os objetivos e metas ocultas...</p>
        `
    },
    "illuminati": {
        title: "Illuminati",
        password: "ilum2025",
        content: `
            <h2>Illuminati - Símbolos e Influência</h2>
            <p>A história real por trás do grupo...</p>
        `
    },
    "calendario": {
        title: "Calendário de Eventos",
        password: "calendario27",
        content: `
            <h2>Calendário de Eventos 2026-2030</h2>
            <ul>
                <li>2026 - Evento A</li>
                <li>2027 - Evento B</li>
            </ul>
        `
    }
};

// ==================== VARIÁVEIS GLOBAIS ====================
let unlockedTopics = JSON.parse(localStorage.getItem('unlockedTopics')) || {};
let currentTopicKey = null;

// ==================== BUSCA ====================
function searchTopics() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    const visibleCards = document.getElementById('visibleCards');

    if (!query) {
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
            const isUnlocked = unlockedTopics[key];

            resultsContainer.innerHTML += `
                <div class="card" onclick="openPasswordModal('${key}')">
                    <h3>${topic.title}</h3>
                    <p>${isUnlocked ? '✅ Desbloqueado' : '🔒 Clique para acessar conteúdo restrito'}</p>
                </div>
            `;
        }
    });

    if (!found) {
        resultsContainer.innerHTML = `<p class="no-results">Nenhum tópico encontrado para "<strong>${query}</strong>". Tente outro termo.</p>`;
    }
}

// ==================== MODAL ====================
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
    const password = document.getElementById('passwordInput').value.trim();
    const topic = secretTopics[currentTopicKey];
    const errorMsg = document.getElementById('errorMsg');

    // Chave Mestre
    if (password === MASTER_PASSWORD) {
        unlockAllTopics();
        closeModal();
        alert("🔑 CHAVE MESTRE ATIVADA!\nTodos os tópicos foram desbloqueados.");
        searchTopics(); // Atualiza os cards
        return;
    }

    // Senha normal
    if (password === topic.password) {
        unlockTopic(currentTopicKey);
        closeModal();
        showContent(currentTopicKey);
    } else {
        let attempts = JSON.parse(localStorage.getItem('attempts')) || {};
        attempts[currentTopicKey] = (attempts[currentTopicKey] || 0) + 1;

        if (attempts[currentTopicKey] >= 3) {
            errorMsg.textContent = "Muitas tentativas. Tente novamente mais tarde.";
            setTimeout(closeModal, 2500);
        } else {
            errorMsg.textContent = `Senha incorreta (${attempts[currentTopicKey]}/3)`;
        }
        localStorage.setItem('attempts', JSON.stringify(attempts));
    }
}

// ==================== DESBLOQUEIO ====================
function unlockTopic(key) {
    unlockedTopics[key] = true;
    localStorage.setItem('unlockedTopics', JSON.stringify(unlockedTopics));
}

function unlockAllTopics() {
    Object.keys(secretTopics).forEach(key => unlockedTopics[key] = true);
    localStorage.setItem('unlockedTopics', JSON.stringify(unlockedTopics));
}

// ==================== MOSTRAR CONTEÚDO ====================
function showContent(key) {
    const topic = secretTopics[key];
    const newWin = window.open('', '_blank');
    newWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="UTF-8"><title>${topic.title}</title>
        <style>
            body {font-family: Arial, sans-serif; padding: 40px; background: #1a1a2e; color: #e0e0ff; line-height: 1.7;}
            h2 {color: #00d4ff;}
        </style>
        </head>
        <body>${topic.content}</body></html>
    `);
}

function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

// ==================== EVENTOS ====================
document.addEventListener('keydown', e => {
    if (e.key === "Escape") closeModal();
});

document.getElementById('passwordInput').addEventListener('keypress', e => {
    if (e.key === "Enter") checkPassword();
});