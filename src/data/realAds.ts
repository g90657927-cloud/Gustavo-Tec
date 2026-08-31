export interface RealTechAd {
  id: string;
  brand: string;
  brandTag: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  officialUrl: string;
  ctaText: string;
  promoCode?: string;
  discountText: string;
  logoLetter: string;
  logoBg: string;
  verifiedLabel: string;
  highlights: string[];
  bannerTheme: {
    bgGradient: string;
    borderGlow: string;
    accentColor: string;
    buttonGradient: string;
  };
}

export const REAL_TECH_ADS: RealTechAd[] = [
  {
    id: 'ad-digi-portugal',
    brand: 'DIGI Portugal',
    brandTag: 'Operadora Oficial Telecomunicações',
    badge: 'FIBRA 10 GBPS & 5G',
    title: 'DIGI Fibra Óptica XGS-PON & 5G Ilimitado',
    tagline: 'A Revolução das Telecomunicações em Portugal: Preços Justos Sem Fidelização Obrigatória',
    description: 'Aceda à rede de fibra óptica própria mais moderna da Europa com velocidades reais até 10 Gbps simétricos e cartões móveis 5G com dados acumuláveis a partir de apenas 4€/mês.',
    category: 'Telecomunicações & Fibra Portugal',
    officialUrl: 'https://www.digi.pt',
    ctaText: 'Verificar Cobertura DIGI Oficial',
    promoCode: 'DIGI-PT-2026',
    discountText: '⚡ Fibra 10 Gbps a 10€/mês • 5G Ilimitado a 7€/mês',
    logoLetter: 'D',
    logoBg: 'from-blue-600 to-indigo-700',
    verifiedLabel: 'Anunciante Verificado ANACOM 🇵🇹',
    highlights: [
      'Velocidade simétrica até 10 Gbps (10.000 Mbps de download e upload)',
      'Router Wi-Fi 6 e Wi-Fi 7 de última geração incluído',
      'Cartões Móveis 5G com gigas ilimitados e chamadas ilimitadas',
      'Sem surpresas na fatura: preços garantidos e transparentes'
    ],
    bannerTheme: {
      bgGradient: 'from-blue-950/90 via-indigo-950/80 to-slate-950',
      borderGlow: 'border-blue-500/50',
      accentColor: 'text-blue-400',
      buttonGradient: 'from-blue-500 via-indigo-600 to-blue-700'
    }
  },
  {
    id: 'ad-google-cloud-vertex',
    brand: 'Google Cloud & AI',
    brandTag: 'Infraestrutura Global Google',
    badge: '300$ EM CRÉDITOS GRÁTIS',
    title: 'Google Cloud Platform & Vertex AI Studio',
    tagline: 'Construa a Próxima Geração de Aplicações com Modelos Gemini 1.5 Pro e Flash',
    description: 'Aceda à maior infraestrutura de Inteligência Artificial do planeta. Treine, ajuste e implemente agentes inteligentes com o ecossistema Google Cloud, Cloud Run e bases de dados Spanner.',
    category: 'Cloud Computing & Inteligência Artificial',
    officialUrl: 'https://cloud.google.com/free',
    ctaText: 'Resgatar 300$ de Crédito Google Cloud',
    promoCode: 'GCP-STUDIO-FREE',
    discountText: '🎁 300$ USD Gratuitos para Novos Desenvolvedores',
    logoLetter: 'G',
    logoBg: 'from-cyan-500 via-blue-600 to-indigo-600',
    verifiedLabel: 'Google Cloud Certified Partner 🌐',
    highlights: [
      '300$ em créditos de avaliação gratuita durante 90 dias',
      'Acesso total à API do Gemini 1.5 Pro com janela de 2M tokens',
      'Mais de 20 produtos sempre gratuitos (Cloud Run, Firestore, BigQuery)',
      'Data Centers com latência inferior a 15ms em toda a Europa Ocidental'
    ],
    bannerTheme: {
      bgGradient: 'from-cyan-950/90 via-blue-950/80 to-slate-950',
      borderGlow: 'border-cyan-500/50',
      accentColor: 'text-cyan-400',
      buttonGradient: 'from-cyan-500 via-blue-600 to-indigo-600'
    }
  },
  {
    id: 'ad-cloudflare-edge',
    brand: 'Cloudflare',
    brandTag: 'Segurança Web & Rede Global',
    badge: 'SERVIÇO GRATUITO DISPONÍVEL',
    title: 'Cloudflare Workers, Zero Trust & Proteção DDoS',
    tagline: 'Mais de 20% da Internet Mundial Protegida pela Rede da Cloudflare',
    description: 'Execute código Serverless na borda (Edge) em mais de 330 cidades globais incluindo Lisboa e Porto. Garanta proteção DDoS ilimitada e certificados SSL instantâneos para os seus domínios.',
    category: 'DevOps, DNS & Cibersegurança',
    officialUrl: 'https://www.cloudflare.com',
    ctaText: 'Ativar Cloudflare Grátis',
    promoCode: 'EDGE-SECURITY',
    discountText: '🛡️ Plano Free Vitalício com 100.000 requisições/dia',
    logoLetter: 'C',
    logoBg: 'from-amber-500 to-orange-600',
    verifiedLabel: 'Infraestrutura Global Verificada ⚡',
    highlights: [
      'DNS mais rápido do mundo com resolução média de 12ms',
      'Deploy instantâneo de Workers com suporte nativo a JavaScript, TypeScript e Rust',
      'Proteção contra ataques DDoS de camada 3, 4 e 7 em tempo real',
      'Armazenamento R2 sem taxas de transferência de dados (Zero Egress Fees)'
    ],
    bannerTheme: {
      bgGradient: 'from-amber-950/90 via-orange-950/80 to-slate-950',
      borderGlow: 'border-amber-500/50',
      accentColor: 'text-amber-400',
      buttonGradient: 'from-amber-500 via-orange-500 to-red-600'
    }
  },
  {
    id: 'ad-nvidia-geforce-ai',
    brand: 'NVIDIA GeForce NOW & RTX',
    brandTag: 'Computação Gráfica & IA',
    badge: 'CLOUD GAMING 4K 240FPS',
    title: 'NVIDIA GeForce NOW Ultimate & Arquitetura Blackwell',
    tagline: 'Transforme Qualquer Portátil, Celular ou Smart TV num Supercomputador RTX 4080',
    description: 'Jogue os títulos mais exigentes do mercado com Ray Tracing completo e DLSS 3.5 com latência ultra-baixa transmitido diretamente dos servidores dedicados NVIDIA em Frankfurt e Madrid.',
    category: 'Gaming, Hardware & GPUs',
    officialUrl: 'https://www.nvidia.com/pt-pt/geforce-now/',
    ctaText: 'Experimentar GeForce NOW Oficial',
    promoCode: 'RTX-ULTIMATE',
    discountText: '🎮 Acesso Gratuito Disponível • 1 Dia de Teste Ultimate',
    logoLetter: 'N',
    logoBg: 'from-emerald-500 to-green-700',
    verifiedLabel: 'NVIDIA Hardware Official 🚀',
    highlights: [
      'Streaming em 4K até 240 FPS com suporte a monitores Ultrawide e HDR',
      'Tecnologia NVIDIA Reflex com tempo de resposta impercetível (<20ms)',
      'Compatível com Steam, Epic Games Store, Xbox Game Pass e Ubisoft Connect',
      'Jogue em MacBook, Windows, Linux, Android, iOS e iPadOS sem instalar'
    ],
    bannerTheme: {
      bgGradient: 'from-emerald-950/90 via-teal-950/80 to-slate-950',
      borderGlow: 'border-emerald-500/50',
      accentColor: 'text-emerald-400',
      buttonGradient: 'from-emerald-500 via-green-600 to-teal-700'
    }
  },
  {
    id: 'ad-starlink-spacex',
    brand: 'Starlink (SpaceX)',
    brandTag: 'Internet por Satélite de Baixa Órbita',
    badge: 'COBERTURA 100% PORTUGAL',
    title: 'Starlink Internet de Alta Velocidade em Qualquer Ponto',
    tagline: 'Conectividade de Banda Larga Onde a Fibra Convencional Não Chega',
    description: 'Conecte a sua casa, empresa ou autocaravana com a constelação de satélites LEO da SpaceX. Instalação simples em 10 minutos com velocidades até 250 Mbps e latência reduzida para teletrabalho e streaming.',
    category: 'Satélite & Conectividade Remota',
    officialUrl: 'https://www.starlink.com',
    ctaText: 'Encomendar Kit Starlink Portugal',
    promoCode: 'STARLINK-PT',
    discountText: '🛰️ Teste por 30 dias sem fidelização com devolução total',
    logoLetter: 'S',
    logoBg: 'from-slate-700 via-slate-800 to-slate-950',
    verifiedLabel: 'SpaceX Official Satellite Network 🛰️',
    highlights: [
      'Velocidades consistentes entre 150 Mbps e 250 Mbps em áreas rurais',
      'Kit autoinstalável com antena motorizada e router Wi-Fi 6 incluído',
      'Plano residencial e plano itinerante para viagens e nomadismo digital',
      'Dados ilimitados sem limites de tráfego'
    ],
    bannerTheme: {
      bgGradient: 'from-slate-900 via-zinc-950 to-black',
      borderGlow: 'border-slate-400/40',
      accentColor: 'text-slate-200',
      buttonGradient: 'from-slate-200 via-slate-300 to-white'
    }
  },
  {
    id: 'ad-github-copilot',
    brand: 'GitHub Copilot Enterprise',
    brandTag: 'IA Para Engenharia de Software',
    badge: 'O PARCEIRO DE CÓDIGO N.º 1',
    title: 'GitHub Copilot: Escreva Código 55% Mais Rápido',
    tagline: 'A Ferramenta de IA Adotada por Mais de 1 Milhão de Desenvolvedores e Empresas',
    description: 'Receba sugestões em tempo real diretamente no VS Code, JetBrains e Neovim. Depure erros, gere testes unitários e converta código legado entre dezenas de linguagens instantaneamente.',
    category: 'Ferramentas de Programação & IA',
    officialUrl: 'https://github.com/features/copilot',
    ctaText: 'Iniciar Teste Gratuito de 30 Dias',
    promoCode: 'COPILOT-AI',
    discountText: '💻 Grátis para Estudantes e Mantenedores Open Source',
    logoLetter: 'GH',
    logoBg: 'from-purple-600 via-indigo-600 to-slate-900',
    verifiedLabel: 'GitHub & Microsoft Verified 🧑‍💻',
    highlights: [
      'Geração de funções e testes em TypeScript, Python, Go, Rust, Java e C#',
      'Copilot Chat com contexto total do repositório e histórico de commits',
      'Conformidade empresarial com privacidade estrita de código fonte',
      'Integração direta com Pull Requests e automações GitHub Actions'
    ],
    bannerTheme: {
      bgGradient: 'from-purple-950/90 via-indigo-950/80 to-slate-950',
      borderGlow: 'border-purple-500/50',
      accentColor: 'text-purple-400',
      buttonGradient: 'from-purple-500 via-indigo-600 to-blue-600'
    }
  }
];
