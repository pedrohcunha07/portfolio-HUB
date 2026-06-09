async function analyzeRepoWithGemini(repoName, description) {
    // Validação DevOps: Verifica se a chave existe antes de gastar recurso
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === "SUA_CHAVE_AQUI") {
        console.error("ERRO DEVOPS: Chave API não configurada no config.js");
        return "Configure sua API Key para ver a análise.";
    }

    const prompt = `Descreva em uma frase curta e técnica para um portfólio este projeto: ${repoName}. Contexto: ${description}`;

    try {
        // Usaremos o modelo gemini-1.5-flash que é mais rápido e aceita esse formato
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        // Se a Google retornar 400, o erro detalhado aparecerá aqui no seu F12
        if (data.error) {
            console.error("Detalhes do erro na Google API:", data.error);
            return "Análise indisponível (Erro 400).";
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Falha na requisição:", error);
        return "Engenharia de Software e Automação.";
    }
}

async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USER}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        container.innerHTML = ''; 

        for (const repo of repos) {
            const cardId = `ai-resumo-${repo.id}`;
            
            // Se o GitHub não tiver descrição, colocamos um aviso amigável
            const repoDescription = repo.description || "Este repositório contém documentação e códigos técnicos de nível sênior.";

            const card = `
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition shadow-xl flex flex-col justify-between min-h-[280px]">
                    <div>
                        <h3 class="text-xl font-extrabold mb-3 text-blue-400 tracking-tight">${repo.name}</h3>
                        
                        <!-- DESCRIÇÃO DO GITHUB -->
                        <p class="text-gray-300 text-sm mb-4 leading-relaxed">
                            ${repoDescription}
                        </p>

                        <!-- INSIGHT DA IA  -->
                        <div class="bg-black/30 p-3 rounded-md border-l-4 border-blue-600">
                            <p id="${cardId}" class="text-[11px] uppercase tracking-wider text-blue-300 font-semibold animate-pulse">
                                IA Gemini processando insight...
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                        <span class="text-[10px] font-mono bg-blue-900/40 px-2 py-1 rounded text-blue-200 border border-blue-700">
                            ${repo.language || 'Markdown'}
                        </span>
                        <a href="${repo.html_url}" target="_blank" class="text-[10px] font-black hover:text-white text-blue-500 transition-all">
                            EXPLORAR REPOSITÓRIO →
                        </a>
                    </div>
                </div>
            `;
            container.innerHTML += card;

            // Chamada da IA em background
            analyzeRepoWithGemini(repo.name, repoDescription).then(summary => {
                const summaryElement = document.getElementById(cardId);
                if (summaryElement) {
                    summaryElement.innerText = "Insight IA: " + summary;
                    summaryElement.classList.remove('animate-pulse');
                }
            });
        }
    } catch (error) {
        console.error("Erro ao buscar GitHub:", error);
        container.innerHTML = '<p class="text-red-500">Erro de conexão com a API do GitHub.</p>';
    }
}

fetchRepos();