const secretTopics = {
    "alta cupula": {
        title: "Alta Cúpula",
        password: "senha123",           // Mude isso!!
        content: `
            <h2>Alta Cúpula</h2>
            <p>Conteúdo sobre a alta cúpula aqui...</p>
            <p>Adicione suas informações secretas.</p>
        `
    },
    "planos": {
        title: "Planos da Elite",
        password: "planos2026",
        content: `
            <h2>Calendário de Planos</h2>
            <p>Informações sobre os planos...</p>
        `
    }
    // Adicione mais aqui
};

let currentTopicKey = null;
let attempts = {};

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
            resultsContainer.innerHTML += `
                <div class="card" onclick="openPasswordModal('${key}')">
                    <h3>${topic.title}</h3>
                    <p>Clique para acessar conteúdo restrito</p>
                </div>
            `;
        }
    });

    if (!found) {
        resultsContainer.innerHTML = `<p class="no-results">Nenhum tópico encontrado para "<strong>${query}</strong>". Tente outro termo.</p>`;
    }
}

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
        const newWin = window.open('', '_blank');
        newWin.document.write(`
            <!DOCTYPE html>
            <html><head><meta charset="UTF-8"><title>${topic.title}</title>
            <style>body{font-family:Arial;padding:40px;line-height:1.6;background:#f4f4f9;}</style>
            </head><body>${topic.content}</body></html>
        `);
    } else {
        attempts[currentTopicKey] = (attempts[currentTopicKey] || 0) + 1;
        if (attempts[currentTopicKey] >= 3) {
            errorMsg.textContent = "Muitas tentativas incorretas. Tente mais tarde.";
            setTimeout(closeModal, 2500);
        } else {
            errorMsg.textContent = `Senha errada (${attempts[currentTopicKey]}/3)`;
        }
    }
}

function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

// Fechar modal com ESC
document.addEventListener('keydown', e => {
    if (e.key === "Escape") closeModal();
});