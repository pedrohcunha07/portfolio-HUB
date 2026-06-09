
async function analyzeRepoWithGemini(repoName, description) {
    const prompt = `Resuma de forma técnica e elegante em uma frase para um portfólio DevOps o seguinte projeto: ${repoName}. Descrição: ${description}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "Especialista em automação e infraestrutura."; 
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
            
            
            const repoDescription = repo.description || "Projeto focado em infraestrutura e automação.";

            const card = `
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition shadow-lg flex flex-col justify-between min-h-[250px]">
                    <div>
                        <h3 class="text-xl font-bold mb-2 text-blue-400">${repo.name}</h3>
                        
                        <!-- Descrição Original do GitHub -->
                        <p class="text-gray-200 text-sm mb-4">
                            ${repoDescription}
                        </p>

                        <!-- Insight da IA Gemini (Secundário e elegante) -->
                        <div class="bg-gray-900/50 p-3 rounded border-l-2 border-blue-500 mt-2">
                            <p id="${cardId}" class="text-xs text-gray-400 animate-pulse">
                                IA Gemini analisando...
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-6">
                        <span class="text-xs font-mono bg-blue-900/30 px-2 py-1 rounded text-blue-300 border border-blue-800">
                            ${repo.language || 'Config'}
                        </span>
                        <a href="${repo.html_url}" target="_blank" class="text-xs font-bold hover:text-white text-blue-400 transition">
                            VER CÓDIGO SOURCE →
                        </a>
                    </div>
                </div>
            `;
            container.innerHTML += card;

            
            analyzeRepoWithGemini(repo.name, repoDescription).then(summary => {
                const summaryElement = document.getElementById(cardId);
                if (summaryElement) {
                    summaryElement.innerText = "IA Insight: " + summary;
                    summaryElement.classList.remove('animate-pulse');
                }
            });
        }
    } catch (error) {
        container.innerHTML = '<p class="text-red-500 text-center col-span-full">Erro ao conectar com GitHub API.</p>';
    }
}


fetchRepos();