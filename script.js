// ==================== CONFIGURAÇÕES GLOBAIS ====================
const MASTER_PASSWORD = "mestre2026";   // ← MUDE PARA UMA SENHA FORTE QUE SÓ VOCÊ SAIBA!

const secretTopics = {
    "alta cupula": {
        title: "Alta Cúpula",
        password: "senha123",
        content: `<h2>Alta Cúpula</h2><p>Conteúdo secreto aqui...</p>`
    },
    "planos": {
        title: "Planos da Elite",
        password: "planos2026",
        content: `<h2>Planos da Elite</h2><p>Informações aqui...</p>`
    },
    "elite": {
        title: "A Elite Global",
        password: "elite2026",
        content: `<h2>A Elite Global</h2><p>Informações sobre as famílias...</p>`
    },
    "agenda2030": {
        title: "Agenda 2030",
        password: "agenda2030",
        content: `<h2>Agenda 2030</h2><p>Detalhes do plano...</p>`
    }
    // Adicione mais tópicos aqui
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
                    <p>${isUnlocked ? '✅ Desbloqueado' : '🔒 Conteúdo restrito'}</p>
                </div>
            `;
        }
    });

    if (!found) {
        resultsContainer.innerHTML = `<p class="no-results">Nenhum tópico encontrado.</p>`;
    }
}

// ==================== MODAL E SENHA ====================
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
    const errorMsg = document.getElementById('errorMsg');

    // === CHAVE MESTRE ===
    if (password === MASTER_PASSWORD) {
        unlockAllTopics();
        closeModal();
        alert("🔑 CHAVE MESTRE ATIVADA!\nTodos os tópicos foram desbloqueados.");
        searchTopics(); // Atualiza visual
        return;
    }

    // === Senha normal ===
    const topic = secretTopics[currentTopicKey];
    if (password === topic.password) {
        unlockTopic(currentTopicKey);
        closeModal();
        showContent(currentTopicKey);
    } else {
        let attempts = JSON.parse(localStorage.getItem('attempts')) || {};
        attempts[currentTopicKey] = (attempts[currentTopicKey] || 0) + 1;

        if (attempts[currentTopicKey] >= 3) {
            errorMsg.textContent = "Muitas tentativas. Tente mais tarde.";
            setTimeout(closeModal, 2000);
        } else {
            errorMsg.textContent = `Senha errada (${attempts[currentTopicKey]}/3)`;
        }
        localStorage.setItem('attempts', JSON.stringify(attempts));
    }
}

function unlockTopic(key) {
    unlockedTopics[key] = true;
    localStorage.setItem('unlockedTopics', JSON.stringify(unlockedTopics));
}

function unlockAllTopics() {
    Object.keys(secretTopics).forEach(key => {
        unlockedTopics[key] = true;
    });
    localStorage.setItem('unlockedTopics', JSON.stringify(unlockedTopics));
}

function showContent(key) {
    const topic = secretTopics[key];
    const newWin = window.open('', '_blank');
    newWin.document.write(`
        <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${topic.title}</title>
        <style>body{font-family:Arial;padding:40px;background:#1a1a2e;color:#e0e0ff;}</style>
        </head><body>${topic.content}</body></html>
    `);
}

function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

// Eventos
document.addEventListener('keydown', e => { if (e.key === "Escape") closeModal(); });
document.getElementById('passwordInput').addEventListener('keypress', e => {
    if (e.key === "Enter") checkPassword();
});