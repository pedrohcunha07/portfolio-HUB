// CONFIGURAÇÃO DE FALLBACK (Para quando o config.js não estiver presente)
const DEFAULT_USER = "pedrohcunha07"; // COLOQUE SEU USUARIO AQUI ENTRE ASPAS

async function analyzeRepoWithGemini(repoName, repoDesc) {
    // Se o CONFIG não existir ou a chave não estiver lá, ele pula a IA
    if (typeof CONFIG === 'undefined' || !CONFIG.GEMINI_API_KEY) {
        return "Insight: Focado em desenvolvimento e automação.";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
    const promptText = `Resuma em uma única frase técnica curta: ${repoName}.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        return "Insight: Engenharia de Software.";
    }
}

async function fetchRepos() {
    const container = document.getElementById('repo-container');

    // Define qual usuário usar (o do config.js ou o padrão que definimos acima)
    const githubUser = (typeof CONFIG !== 'undefined') ? CONFIG.GITHUB_USER : DEFAULT_USER;

    try {
        const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`);

        if (!response.ok) throw new Error("Erro na API do GitHub");

        const repos = await response.json();
        container.innerHTML = '';

        for (const repo of repos) {
            const cardId = `ai-${repo.id}`;
            container.innerHTML += `
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition shadow-lg flex flex-col justify-between min-h-[250px]">
                    <div>
                        <h3 class="text-xl font-bold mb-2 text-blue-400">${repo.name}</h3>
                        <p class="text-gray-300 text-sm mb-4">${repo.description || "Projeto técnico de software."}</p>
                        <div class="bg-black/20 p-2 rounded border-l-2 border-blue-500">
                            <p id="${cardId}" class="text-[11px] text-blue-200 italic font-mono">IA: Processando...</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xs font-mono text-green-400">${repo.language || 'Code'}</span>
                        <a href="${repo.html_url}" target="_blank" class="text-xs font-bold text-blue-300 hover:underline">VIEW SOURCE →</a>
                    </div>
                </div>
            `;

            analyzeRepoWithGemini(repo.name, repo.description).then(res => {
                const el = document.getElementById(cardId);
                if (el) el.innerText = res;
            });
        }
    } catch (e) {
        container.innerHTML = `<p class="col-span-full text-center text-red-400">Erro ao carregar repositórios de ${githubUser}.</p>`;
    }
}

fetchRepos();