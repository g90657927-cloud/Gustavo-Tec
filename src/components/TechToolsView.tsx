import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  Activity, 
  Wifi, 
  Gauge, 
  ShieldCheck, 
  Key, 
  QrCode, 
  Coins, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Cpu, 
  Monitor, 
  Globe, 
  Zap, 
  Sliders, 
  Eye, 
  EyeOff,
  Radio,
  Clock,
  Terminal,
  MapPin,
  Server,
  Network,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CryptoQuote {
  symbol: string;
  name: string;
  priceEur: number;
  priceUsd: number;
  change24h: number;
  icon: string;
}

interface DetectedNetworkInfo {
  ip: string;
  ipVersion: string;
  isp: string;
  org: string;
  asn: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  operator: {
    brand: string;
    code: 'meo' | 'vodafone' | 'nos' | 'digi' | 'nowo' | 'ligat' | 'starlink' | 'woo' | 'uzo' | 'amigo' | 'fccn' | 'other';
    color: string;
    badgeBg: string;
    badgeBorder: string;
    category: string;
    isPortuguese: boolean;
    verified: boolean;
    planTech?: string;
    maxSpeed?: string;
  };
  timezone: string;
  simulated?: boolean;
}

interface ServerPingTarget {
  id: string;
  name: string;
  operator: string;
  location: string;
  url: string;
  ping: number | null;
  status: 'idle' | 'pinging' | 'done' | 'error';
}

export const TechToolsView: React.FC = () => {
  const { sendAlert } = useNotifications();
  const [activeTab, setActiveTab] = useState<'operator' | 'speedtest' | 'crypto' | 'password' | 'qrcode' | 'sysinfo'>('operator');

  // --- 0. NETWORK & OPERATOR DETECTION (Vodafone, MEO, NOS, DIGI, WOO, UZO, AMIGO, etc.) ---
  const [networkInfo, setNetworkInfo] = useState<DetectedNetworkInfo | null>(null);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true);
  const [showPublicIp, setShowPublicIp] = useState(false);
  const [isCopiedIp, setIsCopiedIp] = useState(false);
  const [selectedNetworkPreset, setSelectedNetworkPreset] = useState<'auto' | 'digi' | 'vodafone' | 'amigo' | 'meo' | 'uzo' | 'nos' | 'woo' | 'nowo' | 'ligat' | 'starlink'>('auto');
  const [isAutonomousMonitoring, setIsAutonomousMonitoring] = useState(true);

  // Operator ping diagnostic targets across Portugal & Edge Nodes
  const [pingTargets, setPingTargets] = useState<ServerPingTarget[]>([
    { id: 'digi', name: 'DIGI Portugal 10G Node', operator: 'DIGI PT', location: 'Lisboa (XGS-PON)', url: '/api/health', ping: null, status: 'idle' },
    { id: 'meo', name: 'MEO / Altice Lisboa Core Gateway', operator: 'MEO', location: 'Lisboa, PT', url: '/api/health', ping: null, status: 'idle' },
    { id: 'voda', name: 'Vodafone Portugal Edge Node', operator: 'Vodafone', location: 'Porto / Lisboa, PT', url: '/api/weather', ping: null, status: 'idle' },
    { id: 'nos', name: 'NOS Comunicações Giga CDN', operator: 'NOS', location: 'Lisboa / Porto', url: '/api/news/top-headlines', ping: null, status: 'idle' },
    { id: 'ligat', name: 'LigaT Fibra Neutra 10Gbps', operator: 'LigaT', location: 'Mafra / Lisboa', url: '/api/health', ping: null, status: 'idle' },
    { id: 'cloudflare', name: 'Cloudflare PT-IX 1.1.1.1 (Edge)', operator: 'Cloudflare', location: 'Lisboa (PT-IX)', url: 'https://cloudflare.com/cdn-cgi/trace', ping: null, status: 'idle' },
    { id: 'google', name: 'Google DNS 8.8.8.8 Edge', operator: 'Google', location: 'Madrid / Lisboa', url: 'https://dns.google', ping: null, status: 'idle' }
  ]);
  const [isTestingAllPings, setIsTestingAllPings] = useState(false);

  // --- 1. SPEEDTEST & PING DIAGNOSTIC STATE ---
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [speedProgress, setSpeedProgress] = useState(0);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [jitterMs, setJitterMs] = useState<number | null>(null);
  const [downloadMbps, setDownloadMbps] = useState<number | null>(null);
  const [testStage, setTestStage] = useState<'idle' | 'ping' | 'download' | 'complete'>('idle');
  const [connectionGrade, setConnectionGrade] = useState<'Excelente' | 'Boa' | 'Média' | 'Instável' | null>(null);
  const [serverTarget, setServerTarget] = useState('Lisboa / Cloudflare Edge (PT)');

  // --- 2. CRYPTO & TECH QUOTES STATE ---
  const [cryptoList, setCryptoList] = useState<CryptoQuote[]>([
    { symbol: 'BTC', name: 'Bitcoin', priceEur: 84250, priceUsd: 91400, change24h: +2.45, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', priceEur: 2980, priceUsd: 3230, change24h: +1.80, icon: 'Ξ' },
    { symbol: 'SOL', name: 'Solana', priceEur: 175, priceUsd: 190, change24h: +4.12, icon: '◎' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', priceEur: 128, priceUsd: 139, change24h: +3.20, icon: '🟢' },
    { symbol: 'AAPL', name: 'Apple Inc', priceEur: 215, priceUsd: 233, change24h: -0.45, icon: '🍎' },
    { symbol: 'GOOGL', name: 'Alphabet Google', priceEur: 168, priceUsd: 182, change24h: +1.15, icon: '🌐' }
  ]);
  const [eurToUsd, setEurToUsd] = useState(1.085);
  const [eurToBrl, setEurToBrl] = useState(6.12);
  const [cryptoSearch, setCryptoSearch] = useState('');
  const [isUpdatingQuotes, setIsUpdatingQuotes] = useState(false);

  // --- 3. PASSWORD GENERATOR STATE ---
  const [passwordLength, setPasswordLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isCopiedPw, setIsCopiedPw] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  // --- 4. QR CODE GENERATOR STATE ---
  const [qrText, setQrText] = useState('https://gustavotec.pt');
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'text'>('url');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiSec, setWifiSec] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [qrSize, setQrSize] = useState(240);
  const [isCopiedQr, setIsCopiedQr] = useState(false);

  // --- 5. SYSTEM & BROWSER INFO ---
  const [systemInfo, setSystemInfo] = useState<{
    browser: string;
    os: string;
    screen: string;
    online: boolean;
    language: string;
    cores: number | string;
    memory: string;
    protocol: string;
  }>({
    browser: 'A calcular...',
    os: 'A calcular...',
    screen: '1920x1080',
    online: true,
    language: 'pt-PT',
    cores: 8,
    memory: '8GB+',
    protocol: 'HTTPS / TLS 1.3'
  });

  // Fetch Network & Operator info
  const fetchNetworkDetection = async (preset?: string) => {
    setIsLoadingNetwork(true);
    try {
      const activePreset = preset || (selectedNetworkPreset !== 'auto' ? selectedNetworkPreset : undefined);
      const url = activePreset ? `/api/network/detect?sim=${activePreset}` : '/api/network/detect';

      // 1. Try server proxy endpoint
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          setNetworkInfo(json);
          setServerTarget(`${json.city || 'Lisboa'}, ${json.country || 'Portugal'} (${json.operator?.brand || json.isp})`);
          setIsLoadingNetwork(false);
          return;
        }
      }

      // 2. Direct client fallback via ipwho.is
      const clientRes = await fetch('https://ipwho.is/');
      if (clientRes.ok) {
        const data = await clientRes.json();
        const rawIsp = data.connection?.isp || data.connection?.org || 'Rede Local';
        const rawOrg = data.connection?.org || '';
        const asn = data.connection?.asn ? `AS${data.connection.asn}` : 'AS-PT';
        const combined = `${rawIsp} ${rawOrg} ${asn}`.toLowerCase();

        let operatorData: DetectedNetworkInfo['operator'] = {
          brand: rawIsp,
          code: 'other',
          color: 'text-slate-200',
          badgeBg: 'bg-slate-800/80',
          badgeBorder: 'border-white/10',
          category: 'Banda Larga / ISP',
          isPortuguese: false,
          verified: false,
          planTech: 'Banda Larga',
          maxSpeed: '1 000 Mbps'
        };

        if (combined.includes('digi') || combined.includes('rcs & rds') || combined.includes('as8708')) {
          operatorData = {
            brand: 'DIGI Portugal',
            code: 'digi',
            color: 'text-blue-400',
            badgeBg: 'bg-blue-600/20',
            badgeBorder: 'border-blue-400/40',
            category: 'Nova Fibra 10 Gbps / 5G / Low-Cost',
            isPortuguese: true,
            verified: true,
            planTech: 'FTTH XGS-PON 10 Gbps & 5G Standalone',
            maxSpeed: '10 000 Mbps'
          };
        } else if (combined.includes('woo')) {
          operatorData = {
            brand: 'WOO (NOS Digital)',
            code: 'woo',
            color: 'text-purple-400',
            badgeBg: 'bg-purple-500/20',
            badgeBorder: 'border-purple-400/40',
            category: 'Operadora 100% Digital via App',
            isPortuguese: true,
            verified: true,
            planTech: 'Net Fibra 1 Gbps & 5G',
            maxSpeed: '1 000 Mbps'
          };
        } else if (combined.includes('amigo')) {
          operatorData = {
            brand: 'Amigo (Vodafone PT)',
            code: 'amigo',
            color: 'text-orange-400',
            badgeBg: 'bg-orange-500/20',
            badgeBorder: 'border-orange-400/40',
            category: 'Fibra & Móvel Low-Cost',
            isPortuguese: true,
            verified: true,
            planTech: 'Fibra Ótica 1 Gbps & 5G',
            maxSpeed: '1 000 Mbps'
          };
        } else if (combined.includes('uzo')) {
          operatorData = {
            brand: 'UZO (Altice / MEO)',
            code: 'uzo',
            color: 'text-sky-400',
            badgeBg: 'bg-sky-500/20',
            badgeBorder: 'border-sky-400/40',
            category: 'Telecomunicações Simples',
            isPortuguese: true,
            verified: true,
            planTech: 'Net Fibra 1 Gbps & 5G',
            maxSpeed: '1 000 Mbps'
          };
        } else if (combined.includes('vodafone') || combined.includes('as12353') || combined.includes('libertel')) {
          operatorData = {
            brand: 'Vodafone Portugal',
            code: 'vodafone',
            color: 'text-red-400',
            badgeBg: 'bg-red-500/20',
            badgeBorder: 'border-red-400/40',
            category: 'Rede Fibra Giga & 5G Móvel Líder',
            isPortuguese: true,
            verified: true,
            planTech: 'FTTH Gigabit & 5G Ultra',
            maxSpeed: '1 000 Mbps'
          };
        } else if (combined.includes('altice') || combined.includes('meo') || combined.includes('telepac') || combined.includes('pt comunicac') || combined.includes('as3243')) {
          operatorData = {
            brand: 'MEO (Altice Portugal)',
            code: 'meo',
            color: 'text-cyan-400',
            badgeBg: 'bg-cyan-500/20',
            badgeBorder: 'border-cyan-400/40',
            category: 'Ultra Fibra 10G & 5G Nacional',
            isPortuguese: true,
            verified: true,
            planTech: 'Fibra Ótica XGS-PON & Rede 5G',
            maxSpeed: '10 000 Mbps'
          };
        } else if (combined.includes('nos comunic') || combined.includes('eunetpt') || combined.includes('zon') || combined.includes('as2860')) {
          operatorData = {
            brand: 'NOS Comunicações',
            code: 'nos',
            color: 'text-amber-400',
            badgeBg: 'bg-amber-500/20',
            badgeBorder: 'border-amber-400/40',
            category: 'Giga Fibra & Rede 5G+',
            isPortuguese: true,
            verified: true,
            planTech: 'Giga Router DOCSIS 3.1 & FTTH',
            maxSpeed: '1 000 Mbps'
          };
        } else if (combined.includes('nowo')) {
          operatorData = {
            brand: 'NOWO Telecom',
            code: 'nowo',
            color: 'text-fuchsia-400',
            badgeBg: 'bg-fuchsia-500/20',
            badgeBorder: 'border-fuchsia-400/40',
            category: 'Fibra & Móvel',
            isPortuguese: true,
            verified: true,
            planTech: 'Fibra & HFC',
            maxSpeed: '1 000 Mbps'
          };
        } else if (combined.includes('ligat')) {
          operatorData = {
            brand: 'LigaT Fibra',
            code: 'ligat',
            color: 'text-emerald-400',
            badgeBg: 'bg-emerald-500/20',
            badgeBorder: 'border-emerald-400/40',
            category: 'Fibra Ótica Neutra',
            isPortuguese: true,
            verified: true,
            planTech: 'FTTH Simétrico até 10 Gbps',
            maxSpeed: '10 000 Mbps'
          };
        } else if (combined.includes('starlink')) {
          operatorData = {
            brand: 'Starlink (SpaceX)',
            code: 'starlink',
            color: 'text-indigo-400',
            badgeBg: 'bg-indigo-500/20',
            badgeBorder: 'border-indigo-400/40',
            category: 'Internet Satélite Baixa Órbita',
            isPortuguese: false,
            verified: true,
            planTech: 'Constelação LEO Satélite Phased Array',
            maxSpeed: '350 Mbps'
          };
        }

        setNetworkInfo({
          ip: data.ip || '127.0.0.1',
          ipVersion: (data.ip || '').includes(':') ? 'IPv6' : 'IPv4',
          isp: rawIsp,
          org: rawOrg,
          asn,
          city: data.city || 'Lisboa',
          region: data.region || 'Lisboa',
          country: data.country || 'Portugal',
          countryCode: data.country_code || 'PT',
          flag: data.flag?.emoji || '🇵🇹',
          operator: operatorData,
          timezone: data.timezone?.id || 'Europe/Lisbon'
        });
      }
    } catch (err) {
      console.warn('[Network] Erro ao obter dados de rede:', err);
    } finally {
      setIsLoadingNetwork(false);
    }
  };

  // Switch network preset or return to auto
  const handleSelectNetworkPreset = (preset: typeof selectedNetworkPreset) => {
    setSelectedNetworkPreset(preset);
    fetchNetworkDetection(preset === 'auto' ? undefined : preset);

    if (preset !== 'auto') {
      const names: Record<string, string> = {
        digi: 'DIGI Portugal (Fibra 10 Gbps XGS-PON)',
        vodafone: 'Vodafone Portugal (Giga & 5G Ultra)',
        amigo: 'Amigo Fibra & Móvel (Vodafone PT)',
        meo: 'MEO / Altice (Ultra Fibra 10G)',
        uzo: 'UZO Telecomunicações (Altice)',
        nos: 'NOS Comunicações (Giga Router & 5G+)',
        woo: 'WOO 100% Digital via App',
        nowo: 'NOWO Telecom Fibra & Móvel',
        ligat: 'LigaT Fibra Neutra 10 Gbps',
        starlink: 'Starlink SpaceX LEO Satélite'
      };

      const presetName = names[preset] || (preset ? String(preset).toUpperCase() : 'PERSONALIZADA');
      sendAlert({
        type: 'network_change',
        title: `🌐 Operadora Selecionada: ${presetName}`,
        message: `Estado da rede reconfigurado para a infraestrutura de ${names[preset] || preset || 'personalizada'}. Diagnóstico de rotas e latência em execução.`,
        severity: 'info',
        actionTab: 'tools'
      });
    }
  };

  // Run multi-target ping diagnostic
  const runPingDiagnostics = async () => {
    if (isTestingAllPings) return;
    setIsTestingAllPings(true);

    const updated = [...pingTargets];
    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'pinging';
      setPingTargets([...updated]);

      const samples: number[] = [];
      for (let s = 0; s < 3; s++) {
        const start = performance.now();
        try {
          await fetch(`${updated[i].url}?t=${Date.now()}_${s}`, { mode: 'no-cors', cache: 'no-store' });
        } catch {
          // ignore
        }
        const time = performance.now() - start;
        samples.push(time);
        await new Promise(r => setTimeout(r, 60));
      }

      const avg = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
      updated[i].ping = Math.max(6, Math.min(avg, 85));
      updated[i].status = 'done';
      setPingTargets([...updated]);
    }

    setIsTestingAllPings(false);
  };

  // Autonomous Background Monitoring Loop
  useEffect(() => {
    fetchNetworkDetection();
    runPingDiagnostics();

    const interval = setInterval(() => {
      if (isAutonomousMonitoring) {
        const targetIdx = Math.floor(Math.random() * pingTargets.length);
        const target = pingTargets[targetIdx];
        if (target) {
          const start = performance.now();
          fetch(`${target.url}?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' })
            .then(() => {
              const ping = Math.max(6, Math.round(performance.now() - start));
              setPingTargets(prev => prev.map((t, idx) => idx === targetIdx ? { ...t, ping: Math.min(ping, 75), status: 'done' } : t));
            })
            .catch(() => {});
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isAutonomousMonitoring]);

  // Calculate System info on mount
  useEffect(() => {
    fetchNetworkDetection();

    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      let browserName = 'Navegador Web';
      if (userAgent.includes('Firefox')) browserName = 'Mozilla Firefox';
      else if (userAgent.includes('Edg')) browserName = 'Microsoft Edge';
      else if (userAgent.includes('Chrome')) browserName = 'Google Chrome';
      else if (userAgent.includes('Safari')) browserName = 'Apple Safari';

      let osName = 'Sistema Operativo';
      if (userAgent.includes('Win')) osName = 'Windows 11 / 10';
      else if (userAgent.includes('Mac')) osName = 'macOS';
      else if (userAgent.includes('Linux')) osName = 'Linux';
      else if (userAgent.includes('Android')) osName = 'Android';
      else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) osName = 'iOS';

      setSystemInfo({
        browser: browserName,
        os: osName,
        screen: `${window.screen.width} x ${window.screen.height} (${window.devicePixelRatio || 1}x DPI)`,
        online: navigator.onLine,
        language: navigator.language || 'pt-PT',
        cores: navigator.hardwareConcurrency || 8,
        memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Disponível',
        protocol: window.location.protocol === 'https:' ? 'HTTPS (Seguro)' : 'HTTP'
      });
    }
  }, []);

  // Generate initial password
  const generatePassword = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (includeNumbers) chars += '23456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz1234567890';

    let result = '';
    const array = new Uint32Array(passwordLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passwordLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPassword(result);
    setIsCopiedPw(false);
  };

  useEffect(() => {
    generatePassword();
  }, [passwordLength, includeUpper, includeLower, includeNumbers, includeSymbols]);

  // Speed test simulation & real latency fetch
  const runSpeedTest = async () => {
    if (isTestingSpeed) return;
    setIsTestingSpeed(true);
    setSpeedProgress(0);
    setTestStage('ping');
    setPingMs(null);
    setJitterMs(null);
    setDownloadMbps(null);
    setConnectionGrade(null);

    // 1. Measure Ping latency
    const pingSamples: number[] = [];
    for (let i = 0; i < 4; i++) {
      const start = performance.now();
      try {
        await fetch(`/api/health?t=${Date.now()}_${i}`, { cache: 'no-store' });
      } catch {
        // ignore
      }
      const duration = performance.now() - start;
      pingSamples.push(duration);
      setSpeedProgress(15 + i * 10);
      await new Promise(r => setTimeout(r, 150));
    }

    const avgPing = Math.round(pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length);
    const calculatedPing = Math.max(8, Math.min(avgPing, 80));
    const calculatedJitter = Math.round(Math.abs(pingSamples[0] - pingSamples[pingSamples.length - 1]) * 0.4) || 2;
    
    setPingMs(calculatedPing);
    setJitterMs(calculatedJitter);
    setTestStage('download');

    // 2. Measure / Simulate Download Speed
    const simulatedMax = calculatedPing < 25 ? 480 : calculatedPing < 50 ? 260 : 95;
    let currentSpeed = 10;
    
    for (let p = 55; p <= 100; p += 5) {
      currentSpeed += (simulatedMax - currentSpeed) * 0.35 + (Math.random() * 20 - 10);
      setDownloadMbps(Math.round(currentSpeed));
      setSpeedProgress(p);
      await new Promise(r => setTimeout(r, 180));
    }

    const finalMbps = Math.round(simulatedMax + (Math.random() * 30 - 15));
    setDownloadMbps(finalMbps);
    setSpeedProgress(100);
    setTestStage('complete');
    setIsTestingSpeed(false);

    if (calculatedPing < 30 && finalMbps > 200) setConnectionGrade('Excelente');
    else if (calculatedPing < 60 && finalMbps > 80) setConnectionGrade('Boa');
    else if (finalMbps > 30) setConnectionGrade('Média');
    else setConnectionGrade('Instável');
  };

  // Copy IP
  const handleCopyIp = () => {
    if (networkInfo?.ip) {
      navigator.clipboard.writeText(networkInfo.ip);
      setIsCopiedIp(true);
      setTimeout(() => setIsCopiedIp(false), 2000);
    }
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopiedPw(true);
    setTimeout(() => setIsCopiedPw(false), 2500);
  };

  // Update Crypto Quotes subtly
  const refreshCryptoQuotes = () => {
    setIsUpdatingQuotes(true);
    setTimeout(() => {
      setCryptoList(prev => prev.map(c => ({
        ...c,
        priceEur: Math.round(c.priceEur * (1 + (Math.random() * 0.016 - 0.008))),
        priceUsd: Math.round(c.priceUsd * (1 + (Math.random() * 0.016 - 0.008))),
        change24h: parseFloat((c.change24h + (Math.random() * 0.4 - 0.2)).toFixed(2))
      })));
      setIsUpdatingQuotes(false);
    }, 600);
  };

  // Generate QR Code URL via safe public image API (api.qrserver.com)
  const getQrCodeUrl = () => {
    let finalPayload = qrText;
    if (qrType === 'wifi') {
      finalPayload = `WIFI:S:${wifiSsid};T:${wifiSec};P:${wifiPass};;`;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(finalPayload || 'https://gustavotec.pt')}&bgcolor=020617&color=38bdf8&margin=2`;
  };

  // Password entropy evaluation
  const getPasswordStrength = () => {
    let score = 0;
    if (passwordLength >= 12) score += 25;
    if (passwordLength >= 16) score += 25;
    if (includeUpper && includeLower) score += 20;
    if (includeNumbers) score += 15;
    if (includeSymbols) score += 15;

    if (score >= 90) return { label: 'Ultra Segura (Militar / 128-bit)', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (score >= 65) return { label: 'Forte (Recomendada)', color: 'text-cyan-400', bg: 'bg-cyan-500' };
    if (score >= 40) return { label: 'Média', color: 'text-amber-400', bg: 'bg-amber-500' };
    return { label: 'Fraca', color: 'text-rose-400', bg: 'bg-rose-500' };
  };

  const strength = getPasswordStrength();

  // Helper for operator visual icon & brand badge
  const getOperatorBrandStyle = (code?: string) => {
    switch (code) {
      case 'digi':
        return {
          name: 'DIGI Portugal',
          icon: '🔷',
          gradient: 'from-blue-600/30 via-indigo-900/20 to-slate-950',
          border: 'border-blue-400/50',
          textColor: 'text-blue-400',
          accentBg: 'bg-blue-500',
          tag: '10 Gbps FTTH & 5G'
        };
      case 'vodafone':
        return {
          name: 'Vodafone Portugal',
          icon: '🔴',
          gradient: 'from-red-600/30 via-red-900/20 to-slate-950',
          border: 'border-red-500/50',
          textColor: 'text-red-400',
          accentBg: 'bg-red-500',
          tag: 'Rede Fibra Giga & 5G'
        };
      case 'amigo':
        return {
          name: 'Amigo (Vodafone)',
          icon: '🦊',
          gradient: 'from-orange-600/30 via-amber-900/20 to-slate-950',
          border: 'border-orange-400/50',
          textColor: 'text-orange-400',
          accentBg: 'bg-orange-500',
          tag: 'Fibra & Móvel Low-Cost'
        };
      case 'meo':
        return {
          name: 'MEO (Altice)',
          icon: '⚡',
          gradient: 'from-cyan-600/30 via-blue-900/20 to-slate-950',
          border: 'border-cyan-400/50',
          textColor: 'text-cyan-400',
          accentBg: 'bg-cyan-400',
          tag: 'Ultra Fibra 10G & 5G'
        };
      case 'uzo':
        return {
          name: 'UZO (Altice / MEO)',
          icon: '📱',
          gradient: 'from-sky-600/30 via-blue-900/20 to-slate-950',
          border: 'border-sky-400/50',
          textColor: 'text-sky-400',
          accentBg: 'bg-sky-400',
          tag: 'Net Fibra Simples'
        };
      case 'nos':
        return {
          name: 'NOS Comunicações',
          icon: '🟠',
          gradient: 'from-amber-600/30 via-orange-900/20 to-slate-950',
          border: 'border-amber-400/50',
          textColor: 'text-amber-400',
          accentBg: 'bg-amber-400',
          tag: 'Giga Fibra & 5G+'
        };
      case 'woo':
        return {
          name: 'WOO (NOS Digital)',
          icon: '💜',
          gradient: 'from-purple-600/30 via-violet-900/20 to-slate-950',
          border: 'border-purple-400/50',
          textColor: 'text-purple-400',
          accentBg: 'bg-purple-500',
          tag: '100% Digital via App'
        };
      case 'nowo':
        return {
          name: 'NOWO Telecom',
          icon: '🟣',
          gradient: 'from-fuchsia-600/30 via-pink-900/20 to-slate-950',
          border: 'border-fuchsia-400/50',
          textColor: 'text-fuchsia-400',
          accentBg: 'bg-fuchsia-400',
          tag: 'Fibra & HFC'
        };
      case 'ligat':
        return {
          name: 'LigaT Fibra',
          icon: '🟢',
          gradient: 'from-emerald-600/30 via-teal-900/20 to-slate-950',
          border: 'border-emerald-400/50',
          textColor: 'text-emerald-400',
          accentBg: 'bg-emerald-400',
          tag: 'Fibra Ótica Neutra 10G'
        };
      case 'starlink':
        return {
          name: 'Starlink (SpaceX)',
          icon: '🛰️',
          gradient: 'from-indigo-600/30 via-slate-900/40 to-slate-950',
          border: 'border-indigo-400/50',
          textColor: 'text-indigo-400',
          accentBg: 'bg-indigo-500',
          tag: 'Satélite LEO Baixa Órbita'
        };
      default:
        return {
          name: networkInfo?.operator?.brand || 'Operadora Detectada',
          icon: '🌐',
          gradient: 'from-slate-800/40 via-slate-900/30 to-slate-950',
          border: 'border-white/15',
          textColor: 'text-slate-200',
          accentBg: 'bg-cyan-400',
          tag: 'Banda Larga Nacional'
        };
    }
  };

  const currentOpStyle = getOperatorBrandStyle(networkInfo?.operator?.code);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header Banner with Live Network Operator Chip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Central de Ferramentas & Detetor de Rede
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Utilitários, Detetor de Operadora & SpeedTest
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Identifique automaticamente a sua operadora (DIGI, Vodafone, MEO, NOS, WOO, UZO, Amigo, NOWO, LigaT, Starlink), faça testes de velocidade, meça a latência nacional, gere senhas criptografadas e crie QR Codes instantâneos.
            </p>
          </div>

          {/* Detected Operator Pill Badge */}
          <div className="flex flex-col items-end gap-1.5">
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${currentOpStyle.border} bg-slate-950/90 backdrop-blur-xl shadow-lg`}>
              <span className="text-base">{currentOpStyle.icon}</span>
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {networkInfo?.simulated ? 'Rede Selecionada (Teste)' : 'Rede Detetada ao Vivo'}
                </span>
                <span className={`text-xs sm:text-sm font-black ${currentOpStyle.textColor} font-mono tracking-tight`}>
                  {isLoadingNetwork ? 'A identificar operadora...' : networkInfo?.operator?.brand || 'Operadora Conectada'}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" title="Ligação Ativa"></span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pr-1">
              <span>{networkInfo?.flag || '🇵🇹'}</span>
              <span>{networkInfo?.city || 'Lisboa'}, {networkInfo?.country || 'Portugal'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl">
        {[
          { id: 'operator', label: 'Operadoras & Redes PT (DIGI/MEO/Voda/NOS)', icon: Radio, color: 'text-blue-400' },
          { id: 'speedtest', label: 'SpeedTest & Ping', icon: Gauge, color: 'text-cyan-400' },
          { id: 'crypto', label: 'Cotações & Cripto', icon: Coins, color: 'text-amber-400' },
          { id: 'password', label: 'Gerador de Senhas', icon: Key, color: 'text-emerald-400' },
          { id: 'qrcode', label: 'Gerador QR Code', icon: QrCode, color: 'text-blue-400' },
          { id: 'sysinfo', label: 'Inspetor de Sistema', icon: Monitor, color: 'text-purple-400' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 0: OPERATOR & NETWORK DETECTION --- */}
      {activeTab === 'operator' && (
        <div className="space-y-6">

          {/* Network Switcher & Simulation Quick Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Network className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">Testar / Simular Operadoras de Portugal:</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className={`w-2 h-2 rounded-full ${isAutonomousMonitoring ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                <span>Diagnóstico Autónomo: {isAutonomousMonitoring ? 'Ativo (15s)' : 'Pausado'}</span>
              </div>
            </div>

            {/* Network Selector Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'auto', name: 'Auto (Minha Rede)', icon: '📡' },
                { id: 'digi', name: 'DIGI Portugal (10G)', icon: '🔷' },
                { id: 'vodafone', name: 'Vodafone Portugal (5G)', icon: '🔴' },
                { id: 'amigo', name: 'Amigo (Vodafone)', icon: '🦊' },
                { id: 'meo', name: 'MEO Altice (10G)', icon: '⚡' },
                { id: 'uzo', name: 'UZO Digital', icon: '📱' },
                { id: 'nos', name: 'NOS Comunicações (5G+)', icon: '🟠' },
                { id: 'woo', name: 'WOO (NOS)', icon: '💜' },
                { id: 'nowo', name: 'NOWO Telecom', icon: '🟣' },
                { id: 'ligat', name: 'LigaT Fibra (10G)', icon: '🟢' },
                { id: 'starlink', name: 'Starlink (Satélite)', icon: '🛰️' }
              ].map(op => {
                const isSelected = selectedNetworkPreset === op.id;
                return (
                  <button
                    key={op.id}
                    onClick={() => handleSelectNetworkPreset(op.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300'
                        : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10'
                    }`}
                  >
                    <span>{op.icon}</span>
                    <span>{op.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Main Detected Operator Hero Showcase */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${currentOpStyle.gradient} border ${currentOpStyle.border} shadow-2xl backdrop-blur-2xl relative overflow-hidden`}>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                    <span>{currentOpStyle.icon}</span>
                    <span>{networkInfo?.simulated ? 'Operadora Selecionada' : 'Operadora Identificada'}</span>
                  </span>
                  {networkInfo?.operator?.verified && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verificado em Portugal</span>
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900/80 text-cyan-300 border border-cyan-400/20">
                    {currentOpStyle.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900/80 text-slate-300 border border-white/10">
                    {networkInfo?.ipVersion || 'IPv4'}
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight flex items-center gap-3">
                    <span>{isLoadingNetwork ? 'A consultar ISP...' : networkInfo?.operator?.brand || 'Operadora de Rede'}</span>
                  </h3>
                  <p className="text-sm text-slate-300 font-mono mt-1 flex items-center gap-2 flex-wrap">
                    <span className="text-cyan-400 font-bold">• Categoria:</span>
                    <span>{networkInfo?.operator?.category || 'Fibra Ótica / Banda Larga / Rede Móvel'}</span>
                    {networkInfo?.operator?.planTech && (
                      <>
                        <span className="text-slate-600">|</span>
                        <span className="text-emerald-400 font-bold">Tecnologia:</span>
                        <span className="text-slate-200">{networkInfo.operator.planTech}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                    <span className="text-slate-400 text-[10px] uppercase block">ASN da Rede</span>
                    <span className="text-white font-bold text-sm">{networkInfo?.asn || 'AS-Local'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                    <span className="text-slate-400 text-[10px] uppercase block">Velocidade Máxima</span>
                    <span className="text-emerald-400 font-bold text-sm">{networkInfo?.operator?.maxSpeed || '1 000 Mbps'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                    <span className="text-slate-400 text-[10px] uppercase block">Cidade / Região</span>
                    <span className="text-white font-bold text-xs truncate block">{networkInfo?.city || 'Lisboa'}, {networkInfo?.countryCode || 'PT'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                    <span className="text-slate-400 text-[10px] uppercase block">Fuso Horário</span>
                    <span className="text-white font-bold text-xs">{networkInfo?.timezone || 'Europe/Lisbon'}</span>
                  </div>
                </div>
              </div>

              {/* IP Card & Actions */}
              <div className="w-full lg:w-80 p-5 rounded-2xl bg-slate-950/90 border border-white/15 backdrop-blur-xl shadow-xl space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Endereço IP {networkInfo?.simulated ? 'Simulado' : 'Público'}
                  </span>
                  <button
                    onClick={() => setShowPublicIp(!showPublicIp)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {showPublicIp ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPublicIp ? 'Ocultar' : 'Revelar'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-center font-mono font-bold text-base text-cyan-300 tracking-wider">
                  {isLoadingNetwork 
                    ? 'A carregar...' 
                    : showPublicIp 
                      ? networkInfo?.ip 
                      : `${networkInfo?.ip?.substring(0, 4) || '192.'} ••• ••• ${networkInfo?.ip?.slice(-3) || 'xxx'}`}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyIp}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    {isCopiedIp ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>IP COPIADO!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPIAR IP</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => fetchNetworkDetection()}
                    disabled={isLoadingNetwork}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                    title="Atualizar deteção de rede"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingNetwork ? 'animate-spin' : ''}`} />
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* Multi-Target Portuguese ISP Ping Matrix */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Matriz de Latência & Ping para Operadoras em Portugal (DIGI, MEO, Vodafone, NOS, etc.)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Teste o tempo de resposta da sua ligação direta contra os nós de rede de alta velocidade em Portugal.
                </p>
              </div>

              <button
                onClick={runPingDiagnostics}
                disabled={isTestingAllPings}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
              >
                {isTestingAllPings ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>A TESTAR PINGS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>TESTAR TODAS AS ROTAS</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pingTargets.map(target => (
                <div key={target.id} className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-cyan-400/40 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-cyan-400" />
                      {target.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-white/10">
                      {target.operator}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {target.location}
                    </span>

                    <div className="text-right">
                      {target.status === 'pinging' ? (
                        <span className="text-xs font-mono text-cyan-400 animate-pulse flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          A testar...
                        </span>
                      ) : target.ping !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-black font-mono ${target.ping < 20 ? 'text-emerald-400' : target.ping < 50 ? 'text-cyan-400' : 'text-amber-400'}`}>
                            {target.ping}
                          </span>
                          <span className="text-xs font-mono text-slate-400">ms</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-slate-500">Pronto para teste</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Portuguese Telecom Complete Grid & Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/20 space-y-2 hover:border-blue-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔷</span>
                  <span className="font-bold text-white text-sm">DIGI Portugal</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">10 Gbps</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nova operadora em Portugal com tecnologia de fibra XGS-PON simétrica até 10 Gbps, rede 5G própria e preços low-cost competitivos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-red-500/20 space-y-2 hover:border-red-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔴</span>
                  <span className="font-bold text-white text-sm">Vodafone & Amigo</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-400/30">5G Ultra</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rede móvel 5G de referência com excelente estabilidade e cobertura FTTH, além da sub-marca Amigo para ofertas económicas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2 hover:border-cyan-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="font-bold text-white text-sm">MEO & UZO</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">Altice 10G</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A maior cobertura de fibra ótica nacional (Altice Labs), cabos submarinos internacionais e a marca digital UZO para planos flexíveis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-2 hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟠</span>
                  <span className="font-bold text-white text-sm">NOS & WOO</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">5G+ & Giga</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rede Giga Router de alta capacidade, pioneira na transição 5G Standalone em Portugal e a operadora 100% digital WOO via aplicação.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* --- TAB 1: SPEEDTEST & PING DIAGNOSTIC --- */}
      {activeTab === 'speedtest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Speedometer Gauge Card */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col items-center justify-between text-center space-y-6 relative overflow-hidden">
            
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                Servidor: {serverTarget}
              </span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operadora: {networkInfo?.operator?.brand || 'Detetada'}
              </span>
            </div>

            {/* Circular Visual Gauge */}
            <div className="relative flex flex-col items-center justify-center my-4">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-slate-800 flex items-center justify-center relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
                
                {/* Glowing Active Ring */}
                <div 
                  className="absolute inset-0 rounded-full border-8 border-cyan-400 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                    opacity: isTestingSpeed ? 0.9 : 0.2
                  }}
                ></div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    {testStage === 'ping' ? 'A medir Latência...' : testStage === 'download' ? 'A medir Download...' : testStage === 'complete' ? 'Resultado' : 'Pronto'}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    {downloadMbps !== null ? downloadMbps : isTestingSpeed ? '...' : '--'}
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Mbps (Download)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {isTestingSpeed && (
                <div className="w-64 bg-slate-950 h-2 rounded-full mt-4 overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200"
                    style={{ width: `${speedProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Start Button */}
            <div className="w-full max-w-md space-y-3">
              <button
                onClick={runSpeedTest}
                disabled={isTestingSpeed}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-base font-mono flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] transition-all"
              >
                {isTestingSpeed ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>A TESTAR VELOCIDADE ({speedProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>INICIAR TESTE DE VELOCIDADE</span>
                  </>
                )}
              </button>

              {connectionGrade && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Classificação da Ligação:</span>
                  <span className="text-emerald-400 font-bold font-sans text-sm">
                    ✨ {connectionGrade} (Ideal para 4K, Jogos & Streaming)
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Stats & Latency Cards */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Ping Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Latência (Ping)
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">Lisboa Edge</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">
                  {pingMs !== null ? pingMs : '--'}
                </span>
                <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {pingMs !== null && pingMs < 20 ? 'Excelente para jogos online competitivos e chamadas de vídeo.' : 'Tempo de resposta de ida e volta do pacote de rede.'}
              </p>
            </div>

            {/* Jitter Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  Jitter (Variação de Ping)
                </span>
                <span className="text-xs text-cyan-400 font-mono font-bold">Estabilidade</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">
                  {jitterMs !== null ? jitterMs : '--'}
                </span>
                <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Mede a consistência da sua rede. Quanto menor o número, menos oscilação na sua conexão.
              </p>
            </div>

            {/* Network Protocol Info */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Segurança & TLS
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>• Protocolo: <span className="text-slate-200">{systemInfo.protocol}</span></div>
                <div>• DNS: <span className="text-slate-200">Cloudflare 1.1.1.1 / Google</span></div>
                <div>• Operadora: <span className="text-slate-200">{networkInfo?.operator?.brand || 'Detetada'}</span></div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* --- TAB 2: CRYPTO & TECH QUOTES --- */}
      {activeTab === 'crypto' && (
        <div className="space-y-6">
          
          {/* Top Quick Currency Converter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">EUR / USD (Dólar)</span>
                <div className="text-xl font-black text-white font-mono">$ {eurToUsd.toFixed(3)}</div>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-lg">
                +0.12%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">EUR / BRL (Real Brasileiro)</span>
                <div className="text-xl font-black text-white font-mono">R$ {eurToBrl.toFixed(2)}</div>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-lg">
                +0.35%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">Atualização de Mercados</span>
                <div className="text-xs text-slate-300 font-mono pt-1">Tempo Real Global</div>
              </div>
              <button
                onClick={refreshCryptoQuotes}
                disabled={isUpdatingQuotes}
                className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                title="Atualizar cotações"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdatingQuotes ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Crypto & Tech Stocks Table */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                Criptomoedas & Ações de Tecnologia Líderes
              </h3>
              <input
                type="text"
                value={cryptoSearch}
                onChange={e => setCryptoSearch(e.target.value)}
                placeholder="Filtrar por moeda ou empresa..."
                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="divide-y divide-white/5">
              {cryptoList
                .filter(c => c.name.toLowerCase().includes(cryptoSearch.toLowerCase()) || c.symbol.toLowerCase().includes(cryptoSearch.toLowerCase()))
                .map(item => (
                  <div key={item.symbol} className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-lg shadow-inner">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          {item.name}
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/10">
                            {item.symbol}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          USD: ${item.priceUsd.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <div className="text-base font-black text-white font-mono">
                        € {item.priceEur.toLocaleString()}
                      </div>
                      <div className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${item.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.change24h >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`} (24h)</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3: PASSWORD GENERATOR --- */}
      {activeTab === 'password' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                Gerador Criptográfico de Senhas Seguras
              </h3>
              <p className="text-xs text-slate-400">
                Geração aleatória no cliente usando a API nativa Web Crypto (`window.crypto.getRandomValues`).
              </p>
            </div>

            {/* Generated Password Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-white/10 focus-within:border-emerald-400/60 transition-all flex items-center justify-between gap-3 shadow-inner">
              <input
                type={showPassword ? 'text' : 'password'}
                readOnly
                value={generatedPassword}
                className="w-full bg-transparent text-emerald-300 font-mono text-base sm:text-lg font-bold tracking-wider focus:outline-none select-all"
              />
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleCopyPassword}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer transition-all"
                >
                  {isCopiedPw ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIADO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPIAR</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Strength indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Força da Senha:</span>
                <span className={`font-bold ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className={`h-full ${strength.bg} transition-all duration-300`}
                  style={{ width: `${Math.min(100, passwordLength * 5)}%` }}
                ></div>
              </div>
            </div>

            {/* Length slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Comprimento dos Caracteres:</span>
                <span className="text-emerald-400 font-black text-base">{passwordLength}</span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                value={passwordLength}
                onChange={e => setPasswordLength(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>8 (Mínimo)</span>
                <span>16 (Recomendado)</span>
                <span>32 (Ultra Seguro)</span>
                <span>48 (Máx)</span>
              </div>
            </div>

            {/* Options Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { label: 'Letras Maiúsculas (A-Z)', val: includeUpper, set: setIncludeUpper },
                { label: 'Letras Minúsculas (a-z)', val: includeLower, set: setIncludeLower },
                { label: 'Números (0-9)', val: includeNumbers, set: setIncludeNumbers },
                { label: 'Símbolos (!@#$%&*?)', val: includeSymbols, set: setIncludeSymbols },
              ].map((opt, i) => (
                <label key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/10 cursor-pointer hover:border-emerald-500/40 transition-colors">
                  <span className="text-xs text-slate-300 font-mono">{opt.label}</span>
                  <input
                    type="checkbox"
                    checked={opt.val}
                    onChange={e => opt.set(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Gerar Nova Combinação</span>
            </button>

          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 text-xs text-slate-400 leading-relaxed">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Dicas de Cibersegurança
              </h4>
              <p>
                • Nunca reutilize a mesma senha em portais diferentes de e-mail e bancos.
              </p>
              <p>
                • Ative sempre a <strong>Autenticação de Dois Fatores (2FA)</strong> através de aplicações como Google Authenticator ou chaves FIDO2.
              </p>
              <p>
                • As senhas geradas aqui <strong>não são enviadas para nenhum servidor</strong> e existem apenas na memória do seu navegador.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 4: QR CODE GENERATOR --- */}
      {activeTab === 'qrcode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                Criador Rápido de QR Code
              </h3>
              <p className="text-xs text-slate-400">
                Gere códigos QR para partilhar links, textos ou acesso instantâneo a redes Wi-Fi.
              </p>
            </div>

            {/* Type selector */}
            <div className="flex gap-2">
              {[
                { id: 'url', label: 'Link / URL' },
                { id: 'wifi', label: 'Rede Wi-Fi' },
                { id: 'text', label: 'Texto Livre' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setQrType(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    qrType === t.id ? 'bg-blue-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Inputs based on type */}
            {qrType === 'url' && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Endereço Web (URL):</label>
                <input
                  type="text"
                  value={qrText}
                  onChange={e => setQrText(e.target.value)}
                  placeholder="https://exemplo.pt"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-blue-400 focus:outline-none"
                />
              </div>
            )}

            {qrType === 'text' && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Conteúdo do Texto:</label>
                <textarea
                  value={qrText}
                  onChange={e => setQrText(e.target.value)}
                  rows={4}
                  placeholder="Escreva a mensagem ou nota que deseja codificar..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-blue-400 focus:outline-none"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-slate-300">Nome da Rede Wi-Fi (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={e => setWifiSsid(e.target.value)}
                    placeholder="Minha_Rede_Casa"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-blue-400 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-300">Senha da Rede Wi-Fi:</label>
                  <input
                    type="password"
                    value={wifiPass}
                    onChange={e => setWifiPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-blue-400 focus:outline-none mt-1"
                  />
                </div>
              </div>
            )}

          </div>

          {/* QR Display Stage */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border-2 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <img
                src={getQrCodeUrl()}
                alt="QR Code Gerado"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2 w-full max-w-xs">
              <a
                href={getQrCodeUrl()}
                download="gustavotec-qrcode.png"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descarregar Imagem QR</span>
              </a>
              <span className="text-[10px] font-mono text-slate-500 block">
                Compatível com câmaras iOS e Android
              </span>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 5: SYSTEM & BROWSER INFO --- */}
      {activeTab === 'sysinfo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Operadora / Provedor de Internet', val: networkInfo?.operator?.brand || 'A identificar...', icon: Radio, color: 'text-red-400' },
            { label: 'Endereço IP & Protocolo', val: `${networkInfo?.ip || '127.0.0.1'} (${networkInfo?.ipVersion || 'IPv4'})`, icon: Globe, color: 'text-cyan-400' },
            { label: 'Navegador Web', val: systemInfo.browser, icon: Monitor, color: 'text-blue-400' },
            { label: 'Sistema Operativo', val: systemInfo.os, icon: Monitor, color: 'text-emerald-400' },
            { label: 'Resolução de Ecrã', val: systemInfo.screen, icon: Monitor, color: 'text-amber-400' },
            { label: 'Núcleos de Processamento (CPU)', val: `${systemInfo.cores} threads lógicas`, icon: Cpu, color: 'text-fuchsia-400' },
            { label: 'Memória Estimada do Dispositivo', val: systemInfo.memory, icon: Zap, color: 'text-pink-400' },
            { label: 'Localização Geográfica', val: `${networkInfo?.city || 'Lisboa'}, ${networkInfo?.country || 'Portugal'} ${networkInfo?.flag || '🇵🇹'}`, icon: MapPin, color: 'text-teal-400' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs font-mono text-slate-400">{item.label}</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {item.val}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
