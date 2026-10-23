// Troca de idioma (Português / Inglês) compartilhada por todas as telas.
// - O português é o texto original do HTML; aqui ficam só as traduções em inglês
// - Elementos marcados com data-i18n="chave" trocam o conteúdo;
//   data-i18n-placeholder / data-i18n-alt / data-i18n-aria-label trocam o atributo
// - A escolha fica salva no navegador e vale para todas as telas
// - O botão entra no elemento [data-idioma] da página (ou fica fixo no canto superior direito)

const Idioma = (function () {
    const CHAVE = "idioma";
    const ATRIBUTOS = ["placeholder", "alt", "aria-label"];

    const EN = {
        // Comuns
        "voltarPerfis": "Back to profiles",

        // Tela inicial e perfis
        "idx.aperte": "Press Start, Space or click the screen",
        "idx.toque": "Tap the screen to start",
        "idx.bemvindo": "Welcome back to PedroStation",
        "idx.sub": "FOLIOSHOCK™4 online portfolio connected.<br>\n          Welcome to my portfolio. Select an option to enter.",
        "perfil.sobre": "About me",
        "perfil.portfolio": "Portfolio",
        "perfil.exp": "Experience",

        // Portfólio
        "port.titulo": "Portfolio | PedroStation 4",
        "port.info": "Welcome to my portfolio!",
        "port.infoProjetos": "New projects available",
        "port.infoSobre": "Professional summary available to view",
        "port.infoExp": "Professional experience available now",
        "port.notificacao": "Thanks for visiting!",
        "port.voltar": "Back",
        "port.voltarTitulo": "Back to profile selection",
        "port.abrirGithub": "Open on GitHub",
        "port.abrir": "Open",
        "port.desligar": "Turn off",
        "port.encerrar": "Shut down the portfolio",
        "proj.comes": "Self-service ordering system for a snack bar (SENAI final project). At the kiosk, customers build their order, pay and get a ticket number; in the kitchen panel, staff track the orders and the manager handles the menu.",
        "proj.mapa.nome": "PUC Minas Map",
        "proj.mapa": "Interactive map of the PUC Minas campuses, with markers, a favorites filter, a list to jump between campuses and the user's location. Built to practice consuming APIs.",
        "proj.restaurante": "Restaurant management system: staff login, free and occupied table control, opening tabs, recording orders and closing the bill with a 10% service charge.",
        "proj.escola.nome": "School",
        "proj.escola": "Student registration and lookup by class, with the classes loaded straight from the database. A SENAI project to integrate HTML forms, PHP and a relational database.",
        "proj.tarefas.nome": "To-Do List",
        "proj.tarefas": "Task app to add, complete and remove items, with pending and completed counters and data saved in the browser. Built in the Web Interface Development workshop at PUC Minas.",

        // Sobre mim
        "sobre.titulo": "About me | PedroStation 4",
        "sobre.h1": "About me",
        "sobre.fotoAlt": "Photo of Pedro Luiz",
        "sobre.falar": "Talk to me",
        "sobre.visao": "Overview",
        "sobre.cargo": "Systems Developer",
        "sobre.curso": "Computer Science · PUC Minas",
        "sobre.trabalho": "IT · Difarmig",
        "sobre.p1": "I'm a Computer Science student at PUC Minas and a Systems Development Technician from SENAI. I currently work in the IT department at Difarmig, building and maintaining projects such as web APIs for sales analytics and mobile apps.",
        "sobre.p2": "I like learning by doing and turning ideas into useful solutions, always looking for new challenges and opportunities for professional growth.",
        "sobre.anos": "Year of experience",
        "sobre.tecnologias": "Technologies",
        "sobre.formacoes": "Qualifications",
        "sobre.faleComigo": "Talk to me",
        "sobre.contato": "Contact",
        "sobre.mensagem": "Message",
        "sobre.ola": "Hi! Thanks for visiting. Leave your message below and it will go straight to my inbox.",
        "sobre.nome": "Your name",
        "sobre.assunto": "Subject (optional)",
        "sobre.digite": "Type your message",
        "sobre.enviar": "Send",
        "sobre.abrindo": "Opening your email app with the message ready…",
        "sobre.naoAbriu": "Didn't open?",
        "sobre.gmail": "Send via Gmail",
        "sobre.assuntoPadrao": "Portfolio contact - ",

        // Experiências
        "exp.titulo": "Experience | PedroStation 4",
        "exp.h1": "Experience",
        "exp.habilidades": "Skills",
        "exp.backend": "Back-end &amp; Software Engineering",
        "exp.banco": "Databases",
        "exp.historico": "History",
        "exp.profissional": "Work experience",
        "exp.formacao": "Education",
        "exp.presencial": "Belo Horizonte, MG · On-site",
        "exp.auxiliar": "Administrative Assistant",
        "exp.auxiliar.data": "Mar 2026 – Present",
        "exp.auxiliar.desc": "Supporting the company's IT department, building, maintaining and updating in-house software projects such as web APIs for sales analytics and mobile apps.",
        "exp.aprendiz": "Young Apprentice",
        "exp.aprendiz.data": "Mar 2025 – Mar 2026 · 1 yr 1 mo",
        "exp.aprendiz.desc": "HR &amp; Benefits: responsible for controlling, organizing and filing employee documents, and supporting the management and distribution of corporate benefits.",
        "exp.puc.curso": "Computer Science",
        "exp.puc.data": "Feb 2026 – Dec 2029",
        "exp.puc.desc": "Second-semester Computer Science student at the PUC Minas Coração Eucarístico campus.",
        "exp.senai.curso": "Systems Development Technician",
        "exp.senai.data": "Mar 2024 – Aug 2025",
        "exp.senai.desc": "Graduated in 2025 as a Systems Analysis and Development Technician, covering programming logic, basic back-end and web development, database modeling and documentation.",
        "tag.meioPeriodo": "Part-time",
        "tag.ti": "Information technology",
        "tag.aprendiz": "Apprentice",
        "tag.processos": "Administrative processes",
        "tag.contas": "Accounts payable and receivable",
        "tag.graduacao": "Bachelor's degree",
        "tag.logica": "Logic",
        "tag.tecnico": "Technical degree"
    };

    // Textos em português usados pelos scripts (os do HTML são lidos da própria página)
    const PT = {
        "port.info": "Seja bem vindo ao meu portfólio!",
        "port.infoProjetos": "Novos projetos disponíveis",
        "port.infoSobre": "Descrição profissional disponível para visualização",
        "port.infoExp": "Experiências profissionais disponíveis agora",
        "port.notificacao": "Obrigado por visitar!",
        "sobre.assuntoPadrao": "Contato pelo portfólio - "
    };

    const originais = new Map(); // elemento -> { html, atributos }
    let atual = lerSalvo();

    function lerSalvo() {
        try {
            return localStorage.getItem(CHAVE) === "en" ? "en" : "pt";
        } catch (e) {
            return "pt";
        }
    }

    function salvar(idioma) {
        try {
            localStorage.setItem(CHAVE, idioma);
        } catch (e) {}
    }

    // Texto para os scripts: Idioma.t("port.info")
    function t(chave) {
        if (atual === "en" && EN[chave] !== undefined) return EN[chave];
        return PT[chave] !== undefined ? PT[chave] : chave;
    }

    function guardarOriginal(el) {
        if (originais.has(el)) return originais.get(el);
        const original = { html: el.innerHTML, atributos: {} };
        ATRIBUTOS.forEach((attr) => {
            if (el.hasAttribute("data-i18n-" + attr)) original.atributos[attr] = el.getAttribute(attr);
        });
        originais.set(el, original);
        return original;
    }

    function aplicar() {
        document.documentElement.lang = atual === "en" ? "en" : "pt-BR";

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const original = guardarOriginal(el);
            const traducao = EN[el.dataset.i18n];
            el.innerHTML = atual === "en" && traducao !== undefined ? traducao : original.html;
        });

        ATRIBUTOS.forEach((attr) => {
            document.querySelectorAll("[data-i18n-" + attr + "]").forEach((el) => {
                const original = guardarOriginal(el);
                const traducao = EN[el.getAttribute("data-i18n-" + attr)];
                el.setAttribute(attr, atual === "en" && traducao !== undefined ? traducao : original.atributos[attr]);
            });
        });

        atualizarBotao();
        document.dispatchEvent(new CustomEvent("idiomachange", { detail: atual }));
    }

    function definir(idioma) {
        atual = idioma === "en" ? "en" : "pt";
        salvar(atual);
        aplicar();
    }

    // Botão
    let botao = null;

    function criarBotao() {
        botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botaoIdioma";
        botao.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8 8 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.4 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zM16.3 14a16.5 16.5 0 0 0 0-4h3.4a8 8 0 0 1 0 4h-3.4z"/></svg>'
            + '<span class="idiomaOpcao" data-opcao="pt">PT</span>'
            + '<span class="idiomaSeparador" aria-hidden="true">|</span>'
            + '<span class="idiomaOpcao" data-opcao="en">EN</span>';

        botao.addEventListener("click", function () {
            definir(atual === "en" ? "pt" : "en");
        });

        // Enter/Espaço no botão não devem acionar a navegação da tela (perfis, projetos...)
        botao.addEventListener("keydown", function (event) {
            if (event.code === "Enter" || event.code === "Space") event.stopPropagation();
        });

        const local = document.querySelector("[data-idioma]");
        if (local) {
            local.appendChild(botao);
        } else {
            botao.classList.add("botaoIdiomaFixo");
            document.body.appendChild(botao);
        }
    }

    function atualizarBotao() {
        if (!botao) return;
        botao.querySelectorAll(".idiomaOpcao").forEach((opcao) => {
            opcao.classList.toggle("ativo", opcao.dataset.opcao === atual);
        });
        const rotulo = atual === "en" ? "Mudar idioma para português" : "Switch language to English";
        botao.setAttribute("aria-label", rotulo);
        botao.title = rotulo;
    }

    criarBotao();
    aplicar();

    return { t, definir, atual: () => atual };
})();
