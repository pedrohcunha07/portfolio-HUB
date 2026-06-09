// Função para chamar a IA Gemini
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
        return "Especialista em automação e infraestrutura."; // Texto padrão caso falhe
    }
}

// Função para buscar repositórios
async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USER}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        container.innerHTML = ''; 

        for (const repo of repos) {
            // Chamada da IA para cada repositório
            const aiSummary = await analyzeRepoWithGemini(repo.name, repo.description);
            
            const card = `
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition shadow-lg">
                    <h3 class="text-xl font-bold mb-2 text-blue-400">${repo.name}</h3>
                    <p class="text-gray-300 text-sm mb-4 italic">"IA: ${aiSummary}"</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xs font-mono bg-gray-900 px-2 py-1 rounded text-green-400">${repo.language || 'Config'}</span>
                        <a href="${repo.html_url}" target="_blank" class="text-xs font-bold hover:underline">VIEW SOURCE →</a>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        }
    } catch (error) {
        container.innerHTML = '<p class="text-red-500">Erro ao carregar dados do GitHub. Verifique seu usuário.</p>';
    }
}

// Inicializa o processo
fetchRepos();