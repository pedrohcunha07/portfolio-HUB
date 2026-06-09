async function analyzeRepoWithGemini(repoName, description) {
    const prompt = `Resuma de forma técnica e elegante em uma frase curta para um portfólio DevOps o seguinte projeto: ${repoName}. Descrição: ${description}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // DEBUG: Se a Google retornar erro, veremos no console (F12)
        if (data.error) {
            console.error("Erro na API Gemini:", data.error.message);
            return "Análise de IA indisponível no momento.";
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Erro na requisição da IA:", error);
        return "Infraestrutura como Código e Automação.";
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