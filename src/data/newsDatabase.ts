import { NewsItem, NewsComment, BreakingAlert } from '../types';

export const GUSTAVO_AVATAR = '/gustavo_peixoto.jpg';

export const INITIAL_BREAKING_ALERTS: BreakingAlert[] = [
  {
    id: 'brk-1',
    title: 'NVIDIA revela nova arquitetura de GPUs com aceleração quântica híbrida',
    category: 'Hardware & Chips',
    time: 'Agora mesmo',
    isUrgent: true
  },
  {
    id: 'brk-2',
    title: 'Modelos de raciocínio LLM superam benchmark humano em depuração de código complexo',
    category: 'Inteligência Artificial',
    time: 'Há 2 min',
    isUrgent: false
  },
  {
    id: 'brk-3',
    title: 'Framework WebAssembly atinge 100M downloads com suporte a multithreading nativo',
    category: 'Dev & Open Source',
    time: 'Há 4 min',
    isUrgent: false
  },
  {
    id: 'brk-4',
    title: 'Vulnerabilidade Zero-Day crítica em processadores modernos recebe correção de emergência',
    category: 'Cibersegurança',
    time: 'Há 7 min',
    isUrgent: true
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Revolução nos Modelos de Raciocínio: Nova geração de LLMs domina testes de arquitetura de software',
    summary: 'Avanços em técnicas de Test-Time Compute e chain-of-thought expandem a capacidade dos assistentes de programação para refatoração autônoma de repositórios inteiros.',
    content: `A comunidade global de engenharia de software está presenciando um salto histórico. Com a introdução de novos paradigmas de inferência adaptativa e raciocínio multi-etapa, os modelos de ponta agora conseguem manter consistência de contexto em projetos com dezenas de milhares de linhas de código.

Grandes laboratórios de inteligência artificial demonstraram que, ao permitir que o modelo execute ciclos internos de verificação de sintaxe, testes unitários simulados e auto-crítica antes de fornecer a resposta final, a taxa de sucesso na resolução de bugs complexos aumentou em mais de 78%.

Os novos benchmarks destacam que a preferência de desenvolvedores por respostas com justificativa passo a passo superou largamente os modelos tradicionais de geração direta. Especialistas apontam que o próximo passo será a integração com ambientes de execução isolados em WebAssembly diretamente no navegador.`,
    category: 'Inteligência Artificial',
    author: {
      name: 'Gustavo Peixoto',
      avatar: GUSTAVO_AVATAR,
      role: 'Editor-Chefe'
    },
    publishedAt: 'Há 1 minuto',
    timestamp: Date.now() - 60000,
    readTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    likes: 0,
    views: 0,
    breaking: true,
    trending: true,
    tags: ['LLM', 'AI Coding', 'Engenharia de Software'],
    commentsCount: 0,
    source: 'Gustavo Tec Exclusive',
    keyTakeaways: [
      'Modelos de raciocínio realizam auto-verificação antes da saída.',
      'Aumento de 78% na precisão de resolução de bugs concorrentes.',
      'Suporte a contextos estendidos com baixo consumo de VRAM.'
    ]
  },
  {
    id: 'news-2',
    title: 'Chips de 2nm entram em produção em massa com ganho de 35% em eficiência energética',
    summary: 'Nova litografia GAAFET (Gate-All-Around) revoluciona dispositivos móveis e servidores de alta densidade, reduzindo consumo térmico drasticamente.',
    content: `As principais fundições de semicondutores do mundo anunciaram o início oficial das remessas de wafers de 2 nanômetros com arquitetura GAAFET de canais nanosheet. 

O avanço permite acomodar mais de 50 bilhões de transistores em uma área equivalente à ponta de um dedo, possibilitando que processadores para smartphones e data centers executem modelos de IA on-device com uma fração do consumo elétrico anterior.

Testes de bancada iniciais indicam ganhos térmicos notáveis, permitindo clocks sustentados de até 4.8 GHz em chips mobile sem thermal throttling perceptível.`,
    category: 'Hardware & Chips',
    author: {
      name: 'Gustavo Peixoto',
      avatar: GUSTAVO_AVATAR,
      role: 'Editor-Chefe'
    },
    publishedAt: 'Há 3 minutos',
    timestamp: Date.now() - 180000,
    readTime: '3 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    likes: 0,
    views: 0,
    breaking: false,
    trending: true,
    tags: ['Hardware', '2nm', 'Semicondutores', 'GAAFET', 'Eficiência'],
    commentsCount: 0,
    source: 'Hardware Insider',
    keyTakeaways: [
      'Tecnologia Nanosheet substitui FinFET para melhor controle de corrente.',
      'Redução de até 35% no consumo elétrico na mesma frequência.',
      'Primeiros dispositivos comerciais esperados para o segundo semestre.'
    ]
  },
  {
    id: 'news-3',
    title: 'Novo compilador Rust-to-Wasm atinge tempo de inicialização quase instantâneo',
    summary: 'Ferramenta open source reduz o overhead de compilação e empacota binários otimizados com suporte a SIMD e memória compartilhada.',
    content: `Uma equipe de contribuidores open source lançou a versão estável de um compilador experimental focado em transformar código Rust em módulos WebAssembly ultracompactos.

Em testes comparativos, o bundle gerado teve uma redução de 45% em tamanho e inicializou em menos de 3 milissegundos no V8 e SpiderMonkey. Isso abre caminho para engines de jogos, editores de vídeo e suítes CAD rodando com performance nativa no browser.`,
    category: 'Dev & Open Source',
    author: {
      name: 'Gustavo Peixoto',
      avatar: GUSTAVO_AVATAR,
      role: 'Editor-Chefe'
    },
    publishedAt: 'Há 6 minutos',
    timestamp: Date.now() - 360000,
    readTime: '5 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    likes: 0,
    views: 0,
    breaking: false,
    trending: false,
    tags: ['Rust', 'WebAssembly', 'Open Source', 'Performance'],
    commentsCount: 0,
    source: 'Open Source Today',
    keyTakeaways: [
      'Geração de bytecode Wasm otimizado para navegadores modernos.',
      'Suporte nativo a threads via Web Workers e SharedArrayBuffer.',
      'Licença MIT com ecossistema de crates integrados.'
    ]
  },
  {
    id: 'news-4',
    title: 'Criptografia Pós-Quântica é adotada como padrão global em novos protocolos TLS',
    summary: 'Algoritmos resistentes a computadores quânticos baseados em reticulados (lattice-based) começam a ser implementados em massa por navegadores e provedores de nuvem.',
    content: `Para antecipar a ameaça de que computadores quânticos futuros quebrem a criptografia RSA e ECC atual, órgãos de padronização internacional finalizaram os parâmetros para a transição dos certificados SSL/TLS.

Grandes infraestruturas de nuvem já ativaram os algoritmos ML-KEM e ML-DSA em seus edge routers. A mudança garante que comunicações confidenciais gravadas hoje não possam ser decifradas retroativamente quando sistemas quânticos atingirem capacidade suficiente.`,
    category: 'Cibersegurança',
    author: {
      name: 'Gustavo Peixoto',
      avatar: GUSTAVO_AVATAR,
      role: 'Editor-Chefe'
    },
    publishedAt: 'Há 9 minutos',
    timestamp: Date.now() - 540000,
    readTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    likes: 0,
    views: 0,
    breaking: true,
    trending: true,
    tags: ['Criptografia', 'Segurança', 'Quantum', 'TLS 1.4', 'NIST'],
    commentsCount: 0,
    source: 'Cyber Threat Weekly',
    keyTakeaways: [
      'Migração protege contra ataques no modelo "Harvest Now, Decrypt Later".',
      'Compatibilidade retroativa sem degradação perceptível de handshake.',
      'Suporte liberado nos principais browsers na última atualização.'
    ]
  },
  {
    id: 'news-5',
    title: 'Robôs humanoides inteligentes começam testes autônomos em linhas de montagem de alta precisão',
    summary: 'Sistemas com visão espacial avançada e atuadores hápticos realizam soldas e encaixes milimétricos com feedback tátil em tempo real.',
    content: `A robótica industrial deu um salto expressivo com a chegada de androides equipados com modelos de fundação visual-linguagem-ação (VLA). 

Diferente de braços robóticos programados com rotinas rígidas, esses robôs compreendem comandos em linguagem natural e se adaptam automaticamente caso uma peça esteja fora de posição ou ocorra um imprevisto na esteira de produção.`,
    category: 'Espaço & Robótica',
    author: {
      name: 'Gustavo Peixoto',
      avatar: GUSTAVO_AVATAR,
      role: 'Editor-Chefe'
    },
    publishedAt: 'Há 12 minutos',
    timestamp: Date.now() - 720000,
    readTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    likes: 0,
    views: 0,
    breaking: false,
    trending: false,
    tags: ['Robótica', 'VLA', 'Automação', 'Humanoides'],
    commentsCount: 0,
    source: 'Robotics Future',
    keyTakeaways: [
      'Modelos VLA proporcionam destreza adaptativa em tempo real.',
      'Redução de paradas operacionais em linhas de montagem complexas.',
      'Atuadores com sensores de torque de alta sensibilidade.'
    ]
  },
  {
    id: 'news-6',
    title: 'Baterias de estado sólido de grafeno atingem 1.200 km de autonomia em testes práticos',
    summary: 'Nova química elimina risco de fuga térmica e recarrega de 10% a 80% em menos de 8 minutos com carregadores de 600kW.',
    content: `Protótipos de células de bateria de estado sólido à base de grafeno e compósitos de silício completaram 1.500 ciclos de recarga rápida mantendo 94% da capacidade original.

A novidade promete acelerar a eletrificação do transporte pesado e de veículos elétricos comerciais, garantindo segurança total mesmo sob condições extremas de temperatura.`,
    category: 'Mobile & Gadgets',
    author: {
      name: 'Gustavo Peixoto',
      avatar: GUSTAVO_AVATAR,
      role: 'Editor-Chefe'
    },
    publishedAt: 'Há 15 minutos',
    timestamp: Date.now() - 900000,
    readTime: '3 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-646b22ad440c?w=800&auto=format&fit=crop&q=80',
    likes: 0,
    views: 0,
    breaking: false,
    trending: true,
    tags: ['Baterias', 'Estado Sólido', 'Grafeno', 'Gadgets', 'Mobilidade'],
    commentsCount: 0,
    source: 'Tech Energy Review',
    keyTakeaways: [
      'Carregamento ultra-rápido de 10% a 80% em 8 minutos.',
      'Densidade energética superior a 500 Wh/kg.',
      'Imunidade contra sobreaquecimento e curto-circuito interno.'
    ]
  }
];

export const INITIAL_COMMENTS: Record<string, NewsComment[]> = {};

// Procedural 10-second tech news templates published by Gustavo Peixoto
export const STREAM_NEWS_TEMPLATES = [
  {
    title: 'Nova versão de Kernel Linux otimiza agendador EEVDF para processadores híbridos',
    category: 'Dev & Open Source' as const,
    summary: 'Ganhos de até 18% em compilações paralelas e menor latência de interrupção em CPUs de alta densidade.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
    tags: ['Linux', 'Kernel', 'Open Source', 'Performance'],
    source: 'Gustavo Tec'
  },
  {
    title: 'Framework de Agentes Autônomos ganha integração com MCP (Model Context Protocol)',
    category: 'Inteligência Artificial' as const,
    summary: 'Padronização aberta permite conectar ferramentas, bancos de dados e APIs a qualquer LLM sem código intermediário.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    tags: ['MCP', 'AI Agents', 'Context Protocol', 'LLM'],
    source: 'Gustavo Tec'
  },
  {
    title: 'Nova falha de canal lateral em caches L3 é mitigada via microcódigo de CPU',
    category: 'Cibersegurança' as const,
    summary: 'Pesquisadores de segurança acadêmica publicam prova de conceito sem impacto no throughput geral.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    tags: ['Cibersegurança', 'Microcódigo', 'Hardware Security', 'Zero-Day'],
    source: 'Gustavo Tec'
  },
  {
    title: 'Display OLED Tandem de 480Hz para monitores gamers chega ao mercado com HDR 2000',
    category: 'Hardware & Chips' as const,
    summary: 'Dupla camada emissiva eleva o brilho sustentado para 2000 nits com tempo de resposta de 0.03ms.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    tags: ['Hardware', 'OLED', 'Tandem', 'Monitores', 'Gaming'],
    source: 'Gustavo Tec'
  },
  {
    title: 'Telescópio Espacial descobre atmosfera rica em vapor d\'água em exoplaneta rochoso',
    category: 'Espaço & Robótica' as const,
    summary: 'Espectroscopia de transmissão de alta precisão confirma presença de nuvens condensadas a 40 anos-luz.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    tags: ['Espaço', 'Exoplanetas', 'Astrofísica', 'Ciência'],
    source: 'Gustavo Tec'
  },
  {
    title: 'TypeScript 5.8 traz otimizações de checagem de tipos 40% mais velozes em monorepos',
    category: 'Dev & Open Source' as const,
    summary: 'Novo algoritmo de memoização reduz uso de memória durante build de projetos com múltiplos pacotes.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['TypeScript', 'JavaScript', 'Dev Tools', 'Monorepo'],
    source: 'Gustavo Tec'
  },
  {
    title: 'Nova rede neural multimodal gera modelos 3D com malha poligonal perfeita em 1 segundo',
    category: 'Inteligência Artificial' as const,
    summary: 'Avanço com representações Gaussian Splatting e difusão geométrica permite exportação instantânea para motores de jogos.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    tags: ['IA Generativa', '3D', 'Gaussian Splatting', 'Game Dev'],
    source: 'Gustavo Tec'
  },
  {
    title: 'Navegadores adotam suporte nativo a WebGPU 2.0 com Ray Tracing por hardware',
    category: 'Dev & Open Source' as const,
    summary: 'Acesso direto a núcleos RT de placas de vídeo modernas transforma o navegador em workstation gráfica.',
    author: { name: 'Gustavo Peixoto', avatar: GUSTAVO_AVATAR, role: 'Editor-Chefe' },
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    tags: ['WebGPU', 'Ray Tracing', 'Browser', 'Graphics'],
    source: 'Gustavo Tec'
  }
];
