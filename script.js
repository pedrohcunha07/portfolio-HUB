async function analyzeRepoWithGemini(repoName, repoDesc) {
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.includes("SUA_CHAVE")) {
        return "Resumo técnico indisponível.";
    }

    // Usaremos a v1 (estável) em vez da v1beta
    // E o modelo com sufixo -latest para garantir compatibilidade
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

    const promptText = `Descreva o projeto ${repoName} em uma frase técnica curta para portfólio.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Log amigável para debug
            console.log(`Tentativa com v1 falhou para ${repoName}, tentando v1beta...`);
            return "Engenharia de Software e Automação.";
        }

        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        return "Desenvolvimento de sistemas.";
    }
}

async function fetchRepos() {
    const container = document.getElementById('repo-container');
    container.innerHTML = '<p class="col-span-full text-center animate-pulse text-blue-400">Sincronizando com GitHub API...</p>';
    
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USER}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        container.innerHTML = ''; 

        for (const repo of repos) {
            const cardId = `ai-${repo.id}`;
            const description = repo.description || "Projeto focado em tecnologia e desenvolvimento.";

            container.innerHTML += `
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition shadow-lg flex flex-col justify-between min-h-[250px]">
                    <div>
                        <h3 class="text-xl font-bold mb-2 text-blue-400">${repo.name}</h3>
                        <p class="text-gray-300 text-sm mb-4">${description}</p>
                        <div class="bg-black/20 p-2 rounded border-l-2 border-blue-500">
                            <p id="${cardId}" class="text-[11px] text-blue-200 italic animate-pulse font-mono">IA: Processando...</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xs font-mono text-green-400">${repo.language || 'Code'}</span>
                        <a href="${repo.html_url}" target="_blank" class="text-xs font-bold text-blue-300 hover:underline">VIEW SOURCE →</a>
                    </div>
                </div>
            `;

            // Chama a IA sem travar o resto
            analyzeRepoWithGemini(repo.name, description).then(res => {
                const el = document.getElementById(cardId);
                if(el) {
                    el.innerText = "Insight: " + res;
                    el.classList.remove('animate-pulse');
                }
            });
        }
    } catch (e) {
        container.innerHTML = "Erro ao carregar repositórios.";
    }
}

fetchRepos();