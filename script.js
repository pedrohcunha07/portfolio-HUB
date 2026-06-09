async function analyzeRepoWithGemini(repoName, repoDesc) {
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.includes("SUA_CHAVE")) {
        return "Insight técnico: Focado em automação e boas práticas.";
    }

    // Endpoint atualizado para compatibilidade máxima com chaves novas (AQ)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

    const promptText = `Resuma em uma única frase curta o objetivo técnico deste projeto de TI: ${repoName}. Descrição: ${repoDesc}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        // Se a Google retornar sucesso
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }

        // Se a Google retornar erro ou formato diferente
        console.warn("IA retornou formato inesperado, usando fallback.");
        return "Especialista em soluções de infraestrutura e código.";

    } catch (err) {
        console.error("Falha na conexão com Gemini:", err);
        return "Engenharia de Software e Automação.";
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
                if (el) {
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