// Configurações (Substitua pelos seus dados)
const GITHUB_USER = 'pedrohcunha07';
// Importante: Em um ambiente real, usamos variáveis de ambiente ou Backend Proxy
const GEMINI_API_KEY = 'SUA_CHAVE_GEMINI_AQUI'; 

async function fetchRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        renderRepos(repos);
    } catch (error) {
        console.error("Erro ao buscar GitHub:", error);
    }
}

function renderRepos(repos) {
    const container = document.getElementById('repo-container');
    container.innerHTML = ''; // Limpa o loading

    repos.forEach(repo => {
        const card = `
            <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition">
                <h3 class="text-xl font-bold mb-2">${repo.name}</h3>
                <p class="text-gray-400 text-sm mb-4">${repo.description || 'Sem descrição no GitHub.'}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xs font-mono text-blue-300">${repo.language || 'Geral'}</span>
                    <a href="${repo.html_url}" target="_blank" class="text-sm bg-blue-600 px-3 py-1 rounded">Ver Repositório</a>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Inicialização
fetchRepos();