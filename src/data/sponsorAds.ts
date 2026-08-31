export interface SponsorAd {
  id: string;
  brand: string;
  tagline: string;
  title: string;
  description: string;
  badge: string;
  category: string;
  ctaText: string;
  ctaUrl: string;
  highlights: string[];
  gradient: string;
  accentColor: string;
  textColor: string;
}

export const SPONSOR_ADS: SponsorAd[] = [
  {
    id: 'ad-pixel-9-pro',
    brand: 'Google Hardware',
    tagline: 'A Revolução da IA no seu Bolso',
    title: 'Novo Google Pixel 9 Pro & Fold',
    description: 'Experimente a potência máxima do processador Google Tensor G4 com Gemini Nano integrado nativamente no Android 15. Câmaras de nível profissional e 7 anos de atualizações de segurança.',
    badge: 'DESTAQUE TECH 2026',
    category: 'Smartphones & IA',
    ctaText: 'Explorar Google Pixel 9 Pro',
    ctaUrl: 'https://store.google.com',
    highlights: [
      'Gemini Live integrado com processamento neural on-device',
      'Ecrã Super Actua OLED 120Hz com 3000 nits de pico',
      'Câmara tripla de 50MP com zoom óptico Super Res 30x',
      'Bateria com carregamento rápido e autonomia de mais de 24h'
    ],
    gradient: 'from-blue-600/20 via-cyan-500/20 to-teal-500/10',
    accentColor: 'border-cyan-400/40 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    textColor: 'text-cyan-400'
  },
  {
    id: 'ad-steam-deck-oled',
    brand: 'Steam Gaming',
    tagline: 'A Sua Biblioteca de Jogos PC Onde Quer Que Vá',
    title: 'Steam Deck OLED Edição Especial',
    description: 'Ecrã OLED HDR de 90Hz deslumbrante, bateria aprimorada de até 12h e milhares de jogos compatíveis na palma da sua mão com áudio espacial imersivo.',
    badge: 'GAMING PORTÁTIL',
    category: 'Consolas & Jogos',
    ctaText: 'Ver Steam Deck OLED',
    ctaUrl: 'https://store.steampowered.com/steamdeck',
    highlights: [
      'Ecrã HDR OLED com pretos perfeitos e contraste infinito',
      'Wi-Fi 6E para downloads até 3x mais velozes',
      'Design ergonómico com trackpads táteis de alta precisão',
      'Compatível com emuladores, mods e SteamOS aberto'
    ],
    gradient: 'from-purple-600/20 via-pink-500/20 to-indigo-500/10',
    accentColor: 'border-pink-400/40 text-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.35)]',
    textColor: 'text-pink-400'
  },
  {
    id: 'ad-cloudflare-dev',
    brand: 'Cloudflare Portugal',
    tagline: 'Infraestrutura Global a Milissegundos de Lisboa e Porto',
    title: 'Cloudflare Workers & AI Cloud',
    description: 'Implemente microsserviços e bases de dados Serverless distribuídas em centenas de data centers mundiais com zero latência e proteção DDoS automática de classe mundial.',
    badge: 'DESENVOLVIMENTO WEB',
    category: 'Cloud & DevOps',
    ctaText: 'Criar Conta Gratuita de Desenvolvedor',
    ctaUrl: 'https://workers.cloudflare.com',
    highlights: [
      'Deploy instantâneo em menos de 500ms globalmente',
      'Execução de modelos Llama 3 e embeddings na borda (Edge)',
      'Plano gratuito generoso com 100.000 pedidos diários',
      'Conexão segura nativa com CDN e certificados SSL automáticos'
    ],
    gradient: 'from-amber-600/20 via-orange-500/20 to-yellow-500/10',
    accentColor: 'border-amber-400/40 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    textColor: 'text-amber-400'
  },
  {
    id: 'ad-macbook-m4',
    brand: 'Apple Pro Tech',
    tagline: 'O Portátil Mais Eficiente Para Programação e Design',
    title: 'MacBook Pro 16" com Chip M4 Max',
    description: 'Até 128GB de memória unificada para compilações instantâneas, edição de vídeo 8K ProRes e autonomia inacreditável de até 24 horas longe da tomada.',
    badge: 'PRO WORKSTATION',
    category: 'Computadores & Portáteis',
    ctaText: 'Configurar MacBook Pro M4',
    ctaUrl: 'https://www.apple.com/pt/macbook-pro',
    highlights: [
      'CPU de 16 núcleos e GPU de até 40 núcleos gráficos',
      'Ecrã Liquid Retina XDR com opção de vidro nanotexturizado',
      'Portas Thunderbolt 5 com velocidades de transferência até 120 Gb/s',
      'Suporte para até 4 monitores externos de alta resolução'
    ],
    gradient: 'from-blue-600/20 via-indigo-500/20 to-slate-500/10',
    accentColor: 'border-indigo-400/40 text-indigo-300 shadow-[0_0_25px_rgba(129,140,248,0.35)]',
    textColor: 'text-indigo-400'
  }
];
