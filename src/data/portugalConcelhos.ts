export interface WeatherLocation {
  name: string;
  country: string;
  region: string;
  district?: string;
  zone: 'norte' | 'centro' | 'lisboa' | 'alentejo' | 'algarve' | 'ilhas' | 'global';
  latitude: number;
  longitude: number;
}

export interface CityLiveSummary {
  name: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  isDay: number;
  tempMax?: number;
  tempMin?: number;
  lastUpdated: string;
}

// Complete directory of Portugal Concelhos & Major Global Hubs
export const PORTUGAL_CONCELHOS: WeatherLocation[] = [
  // --- GRUPO 1: LISBOA, VALE DO TEJO E SETÚBAL ---
  { name: 'Lisboa', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.7169, longitude: -9.1399 },
  { name: 'Sintra', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.8003, longitude: -9.3783 },
  { name: 'Cascais', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.6979, longitude: -9.4215 },
  { name: 'Loures', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.8315, longitude: -9.1681 },
  { name: 'Amadora', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.7538, longitude: -9.2308 },
  { name: 'Oeiras', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.6969, longitude: -9.3144 },
  { name: 'Odivelas', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.7954, longitude: -9.1835 },
  { name: 'Vila Franca de Xira', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.9553, longitude: -8.9897 },
  { name: 'Mafra', country: 'Portugal', region: 'Grande Lisboa', district: 'Lisboa', zone: 'lisboa', latitude: 38.9372, longitude: -9.3275 },
  { name: 'Torres Vedras', country: 'Portugal', region: 'Oeste', district: 'Lisboa', zone: 'lisboa', latitude: 39.0918, longitude: -9.2600 },
  { name: 'Alenquer', country: 'Portugal', region: 'Oeste', district: 'Lisboa', zone: 'lisboa', latitude: 39.0538, longitude: -9.0117 },
  { name: 'Lourinhã', country: 'Portugal', region: 'Oeste', district: 'Lisboa', zone: 'lisboa', latitude: 39.2422, longitude: -9.3128 },
  { name: 'Arruda dos Vinhos', country: 'Portugal', region: 'Oeste', district: 'Lisboa', zone: 'lisboa', latitude: 38.9856, longitude: -9.0786 },
  { name: 'Santarém', country: 'Portugal', region: 'Lezíria do Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.2367, longitude: -8.6860 },
  { name: 'Tomar', country: 'Portugal', region: 'Médio Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.6036, longitude: -8.4079 },
  { name: 'Abrantes', country: 'Portugal', region: 'Médio Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.4633, longitude: -8.1983 },
  { name: 'Torres Novas', country: 'Portugal', region: 'Médio Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.4811, longitude: -8.5392 },
  { name: 'Entroncamento', country: 'Portugal', region: 'Médio Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.4667, longitude: -8.4667 },
  { name: 'Cartaxo', country: 'Portugal', region: 'Lezíria do Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.1611, longitude: -8.7869 },
  { name: 'Rio Maior', country: 'Portugal', region: 'Lezíria do Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.3364, longitude: -8.9372 },
  { name: 'Benavente', country: 'Portugal', region: 'Lezíria do Tejo', district: 'Santarém', zone: 'lisboa', latitude: 38.9806, longitude: -8.8089 },
  { name: 'Coruche', country: 'Portugal', region: 'Lezíria do Tejo', district: 'Santarém', zone: 'lisboa', latitude: 38.9592, longitude: -8.5256 },
  { name: 'Ourém (Fátima)', country: 'Portugal', region: 'Médio Tejo', district: 'Santarém', zone: 'lisboa', latitude: 39.6417, longitude: -8.5778 },
  { name: 'Setúbal', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.5244, longitude: -8.8882 },
  { name: 'Almada', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.6790, longitude: -9.1569 },
  { name: 'Seixal', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.6437, longitude: -9.1022 },
  { name: 'Barreiro', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.6634, longitude: -9.0728 },
  { name: 'Montijo', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.7067, longitude: -8.9739 },
  { name: 'Moita', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.6514, longitude: -8.9897 },
  { name: 'Palmela', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.5683, longitude: -8.9022 },
  { name: 'Sesimbra', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.4445, longitude: -9.1015 },
  { name: 'Alcochete', country: 'Portugal', region: 'Península de Setúbal', district: 'Setúbal', zone: 'lisboa', latitude: 38.7561, longitude: -8.9611 },
  { name: 'Sines', country: 'Portugal', region: 'Alentejo Litoral', district: 'Setúbal', zone: 'lisboa', latitude: 37.9562, longitude: -8.8698 },
  { name: 'Grândola', country: 'Portugal', region: 'Alentejo Litoral', district: 'Setúbal', zone: 'lisboa', latitude: 38.1764, longitude: -8.5669 },
  { name: 'Santiago do Cacém', country: 'Portugal', region: 'Alentejo Litoral', district: 'Setúbal', zone: 'lisboa', latitude: 38.0153, longitude: -8.6961 },
  { name: 'Alcácer do Sal', country: 'Portugal', region: 'Alentejo Litoral', district: 'Setúbal', zone: 'lisboa', latitude: 38.3725, longitude: -8.5133 },

  // --- GRUPO 2: NORTE, PORTO, MINHO E TRÁS-OS-MONTES ---
  { name: 'Porto', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.1579, longitude: -8.6291 },
  { name: 'Vila Nova de Gaia', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.1239, longitude: -8.6118 },
  { name: 'Matosinhos', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.1820, longitude: -8.6896 },
  { name: 'Maia', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.2299, longitude: -8.6214 },
  { name: 'Gondomar', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.1444, longitude: -8.5323 },
  { name: 'Valongo', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.1897, longitude: -8.4986 },
  { name: 'Póvoa de Varzim', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.3834, longitude: -8.7612 },
  { name: 'Vila do Conde', country: 'Portugal', region: 'Grande Porto', district: 'Porto', zone: 'norte', latitude: 41.3559, longitude: -8.7439 },
  { name: 'Santo Tirso', country: 'Portugal', region: 'Área Metr. Porto', district: 'Porto', zone: 'norte', latitude: 41.3433, longitude: -8.4739 },
  { name: 'Trofa', country: 'Portugal', region: 'Área Metr. Porto', district: 'Porto', zone: 'norte', latitude: 41.3392, longitude: -8.5583 },
  { name: 'Paredes', country: 'Portugal', region: 'Tâmega e Sousa', district: 'Porto', zone: 'norte', latitude: 41.2083, longitude: -8.3317 },
  { name: 'Penafiel', country: 'Portugal', region: 'Tâmega e Sousa', district: 'Porto', zone: 'norte', latitude: 41.2069, longitude: -8.2842 },
  { name: 'Amarante', country: 'Portugal', region: 'Tâmega e Sousa', district: 'Porto', zone: 'norte', latitude: 41.2727, longitude: -8.0827 },
  { name: 'Felgueiras', country: 'Portugal', region: 'Tâmega e Sousa', district: 'Porto', zone: 'norte', latitude: 41.3667, longitude: -8.2000 },
  { name: 'Marco de Canaveses', country: 'Portugal', region: 'Tâmega e Sousa', district: 'Porto', zone: 'norte', latitude: 41.1856, longitude: -8.1469 },
  { name: 'Paços de Ferreira', country: 'Portugal', region: 'Tâmega e Sousa', district: 'Porto', zone: 'norte', latitude: 41.2778, longitude: -8.3778 },
  { name: 'Braga', country: 'Portugal', region: 'Cávado', district: 'Braga', zone: 'norte', latitude: 41.5454, longitude: -8.4265 },
  { name: 'Guimarães', country: 'Portugal', region: 'Ave', district: 'Braga', zone: 'norte', latitude: 41.4425, longitude: -8.2918 },
  { name: 'Vila Nova de Famalicão', country: 'Portugal', region: 'Ave', district: 'Braga', zone: 'norte', latitude: 41.4074, longitude: -8.5195 },
  { name: 'Barcelos', country: 'Portugal', region: 'Cávado', district: 'Braga', zone: 'norte', latitude: 41.5388, longitude: -8.6151 },
  { name: 'Esposende', country: 'Portugal', region: 'Cávado', district: 'Braga', zone: 'norte', latitude: 41.5350, longitude: -8.7819 },
  { name: 'Fafe', country: 'Portugal', region: 'Ave', district: 'Braga', zone: 'norte', latitude: 41.4500, longitude: -8.1667 },
  { name: 'Vila Verde', country: 'Portugal', region: 'Cávado', district: 'Braga', zone: 'norte', latitude: 41.6500, longitude: -8.4333 },
  { name: 'Viana do Castelo', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 41.6938, longitude: -8.8329 },
  { name: 'Ponte de Lima', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 41.7673, longitude: -8.5839 },
  { name: 'Valença', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 42.0294, longitude: -8.6331 },
  { name: 'Caminha', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 41.8756, longitude: -8.8383 },
  { name: 'Monção', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 42.0789, longitude: -8.4817 },
  { name: 'Melgaço', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 42.1147, longitude: -8.2600 },
  { name: 'Arcos de Valdevez', country: 'Portugal', region: 'Alto Minho', district: 'Viana do Castelo', zone: 'norte', latitude: 41.8469, longitude: -8.4186 },
  { name: 'Vila Real', country: 'Portugal', region: 'Douro', district: 'Vila Real', zone: 'norte', latitude: 41.3006, longitude: -7.7441 },
  { name: 'Chaves', country: 'Portugal', region: 'Alto Tâmega', district: 'Vila Real', zone: 'norte', latitude: 41.7418, longitude: -7.4716 },
  { name: 'Peso da Régua', country: 'Portugal', region: 'Douro', district: 'Vila Real', zone: 'norte', latitude: 41.1633, longitude: -7.7889 },
  { name: 'Montalegre (Gerês)', country: 'Portugal', region: 'Alto Tâmega', district: 'Vila Real', zone: 'norte', latitude: 41.8256, longitude: -7.7906 },
  { name: 'Bragança', country: 'Portugal', region: 'Terras de Trás-os-Montes', district: 'Bragança', zone: 'norte', latitude: 41.8058, longitude: -6.7572 },
  { name: 'Mirandela', country: 'Portugal', region: 'Terras de Trás-os-Montes', district: 'Bragança', zone: 'norte', latitude: 41.4871, longitude: -7.1878 },
  { name: 'Macedo de Cavaleiros', country: 'Portugal', region: 'Terras de Trás-os-Montes', district: 'Bragança', zone: 'norte', latitude: 41.5381, longitude: -6.9608 },
  { name: 'Miranda do Douro', country: 'Portugal', region: 'Terras de Trás-os-Montes', district: 'Bragança', zone: 'norte', latitude: 41.4939, longitude: -6.2736 },

  // --- GRUPO 3: CENTRO, BEIRAS E AVEIRO ---
  { name: 'Coimbra', country: 'Portugal', region: 'Região de Coimbra', district: 'Coimbra', zone: 'centro', latitude: 40.2033, longitude: -8.4103 },
  { name: 'Figueira da Foz', country: 'Portugal', region: 'Região de Coimbra', district: 'Coimbra', zone: 'centro', latitude: 40.1508, longitude: -8.8618 },
  { name: 'Cantanhede', country: 'Portugal', region: 'Região de Coimbra', district: 'Coimbra', zone: 'centro', latitude: 40.3464, longitude: -8.5947 },
  { name: 'Montemor-o-Velho', country: 'Portugal', region: 'Região de Coimbra', district: 'Coimbra', zone: 'centro', latitude: 40.1750, longitude: -8.6819 },
  { name: 'Lousã', country: 'Portugal', region: 'Região de Coimbra', district: 'Coimbra', zone: 'centro', latitude: 40.1108, longitude: -8.2464 },
  { name: 'Oliveira do Hospital', country: 'Portugal', region: 'Região de Coimbra', district: 'Coimbra', zone: 'centro', latitude: 40.3592, longitude: -7.8617 },
  { name: 'Aveiro', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.6405, longitude: -8.6538 },
  { name: 'Santa Maria da Feira', country: 'Portugal', region: 'Entre Douro e Vouga', district: 'Aveiro', zone: 'centro', latitude: 40.9258, longitude: -8.5434 },
  { name: 'Espinho', country: 'Portugal', region: 'Grande Porto', district: 'Aveiro', zone: 'centro', latitude: 41.0072, longitude: -8.6410 },
  { name: 'Ovar', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.8586, longitude: -8.6253 },
  { name: 'Ílhavo', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.6006, longitude: -8.6672 },
  { name: 'Águeda', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.5744, longitude: -8.4447 },
  { name: 'Oliveira de Azeméis', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.8389, longitude: -8.4772 },
  { name: 'São João da Madeira', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.9006, longitude: -8.4906 },
  { name: 'Anadia', country: 'Portugal', region: 'Região de Aveiro', district: 'Aveiro', zone: 'centro', latitude: 40.4411, longitude: -8.4350 },
  { name: 'Viseu', country: 'Portugal', region: 'Dão-Lafões', district: 'Viseu', zone: 'centro', latitude: 40.6575, longitude: -7.9143 },
  { name: 'Lamego', country: 'Portugal', region: 'Douro', district: 'Viseu', zone: 'centro', latitude: 41.0984, longitude: -7.8103 },
  { name: 'Mangualde', country: 'Portugal', region: 'Dão-Lafões', district: 'Viseu', zone: 'centro', latitude: 40.6053, longitude: -7.7631 },
  { name: 'Tondela', country: 'Portugal', region: 'Dão-Lafões', district: 'Viseu', zone: 'centro', latitude: 40.5167, longitude: -8.0833 },
  { name: 'São Pedro do Sul', country: 'Portugal', region: 'Dão-Lafões', district: 'Viseu', zone: 'centro', latitude: 40.7553, longitude: -8.0700 },
  { name: 'Leiria', country: 'Portugal', region: 'Região de Leiria', district: 'Leiria', zone: 'centro', latitude: 39.7436, longitude: -8.8071 },
  { name: 'Caldas da Rainha', country: 'Portugal', region: 'Oeste', district: 'Leiria', zone: 'centro', latitude: 39.4039, longitude: -9.1386 },
  { name: 'Alcobaça', country: 'Portugal', region: 'Oeste', district: 'Leiria', zone: 'centro', latitude: 39.5494, longitude: -8.9786 },
  { name: 'Marinha Grande', country: 'Portugal', region: 'Região de Leiria', district: 'Leiria', zone: 'centro', latitude: 39.7500, longitude: -8.9333 },
  { name: 'Pombal', country: 'Portugal', region: 'Região de Leiria', district: 'Leiria', zone: 'centro', latitude: 39.9167, longitude: -8.6333 },
  { name: 'Nazaré', country: 'Portugal', region: 'Oeste', district: 'Leiria', zone: 'centro', latitude: 39.6012, longitude: -9.0712 },
  { name: 'Peniche', country: 'Portugal', region: 'Oeste', district: 'Leiria', zone: 'centro', latitude: 39.3558, longitude: -9.3811 },
  { name: 'Batalha', country: 'Portugal', region: 'Região de Leiria', district: 'Leiria', zone: 'centro', latitude: 39.6606, longitude: -8.8239 },
  { name: 'Guarda', country: 'Portugal', region: 'Beira Interior Norte', district: 'Guarda', zone: 'centro', latitude: 40.5373, longitude: -7.2658 },
  { name: 'Seia (Serra da Estrela)', country: 'Portugal', region: 'Serra da Estrela', district: 'Guarda', zone: 'centro', latitude: 40.4206, longitude: -7.7042 },
  { name: 'Gouveia', country: 'Portugal', region: 'Serra da Estrela', district: 'Guarda', zone: 'centro', latitude: 40.4939, longitude: -7.5936 },
  { name: 'Pinhel', country: 'Portugal', region: 'Beira Interior Norte', district: 'Guarda', zone: 'centro', latitude: 40.7744, longitude: -7.0625 },
  { name: 'Castelo Branco', country: 'Portugal', region: 'Beira Baixa', district: 'Castelo Branco', zone: 'centro', latitude: 39.8222, longitude: -7.4932 },
  { name: 'Covilhã', country: 'Portugal', region: 'Cova da Beira', district: 'Castelo Branco', zone: 'centro', latitude: 40.2827, longitude: -7.5033 },
  { name: 'Fundão', country: 'Portugal', region: 'Cova da Beira', district: 'Castelo Branco', zone: 'centro', latitude: 40.1400, longitude: -7.5008 },
  { name: 'Sertã', country: 'Portugal', region: 'Médio Tejo', district: 'Castelo Branco', zone: 'centro', latitude: 39.8058, longitude: -8.1000 },

  // --- GRUPO 4: ALENTEJO, ALGARVE E ILHAS ---
  { name: 'Évora', country: 'Portugal', region: 'Alentejo Central', district: 'Évora', zone: 'alentejo', latitude: 38.5714, longitude: -7.9135 },
  { name: 'Estremoz', country: 'Portugal', region: 'Alentejo Central', district: 'Évora', zone: 'alentejo', latitude: 38.8433, longitude: -7.5864 },
  { name: 'Montemor-o-Novo', country: 'Portugal', region: 'Alentejo Central', district: 'Évora', zone: 'alentejo', latitude: 38.6444, longitude: -8.2167 },
  { name: 'Vendas Novas', country: 'Portugal', region: 'Alentejo Central', district: 'Évora', zone: 'alentejo', latitude: 38.6833, longitude: -8.4500 },
  { name: 'Reguengos de Monsaraz', country: 'Portugal', region: 'Alentejo Central', district: 'Évora', zone: 'alentejo', latitude: 38.4239, longitude: -7.5344 },
  { name: 'Beja', country: 'Portugal', region: 'Baixo Alentejo', district: 'Beja', zone: 'alentejo', latitude: 38.0151, longitude: -7.8653 },
  { name: 'Serpa', country: 'Portugal', region: 'Baixo Alentejo', district: 'Beja', zone: 'alentejo', latitude: 37.9442, longitude: -7.4981 },
  { name: 'Moura', country: 'Portugal', region: 'Baixo Alentejo', district: 'Beja', zone: 'alentejo', latitude: 38.1403, longitude: -7.4497 },
  { name: 'Castro Verde', country: 'Portugal', region: 'Baixo Alentejo', district: 'Beja', zone: 'alentejo', latitude: 37.7006, longitude: -8.0864 },
  { name: 'Odemira', country: 'Portugal', region: 'Alentejo Litoral', district: 'Beja', zone: 'alentejo', latitude: 37.5975, longitude: -8.6419 },
  { name: 'Mértola', country: 'Portugal', region: 'Baixo Alentejo', district: 'Beja', zone: 'alentejo', latitude: 37.6406, longitude: -7.6628 },
  { name: 'Portalegre', country: 'Portugal', region: 'Alto Alentejo', district: 'Portalegre', zone: 'alentejo', latitude: 39.2938, longitude: -7.4312 },
  { name: 'Elvas', country: 'Portugal', region: 'Alto Alentejo', district: 'Portalegre', zone: 'alentejo', latitude: 38.8815, longitude: -7.1628 },
  { name: 'Ponte de Sor', country: 'Portugal', region: 'Alto Alentejo', district: 'Portalegre', zone: 'alentejo', latitude: 39.2500, longitude: -8.0167 },
  { name: 'Campo Maior', country: 'Portugal', region: 'Alto Alentejo', district: 'Portalegre', zone: 'alentejo', latitude: 39.0142, longitude: -7.0672 },
  { name: 'Faro (Algarve)', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.0174, longitude: -7.9308 },
  { name: 'Portimão', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1364, longitude: -8.5376 },
  { name: 'Albufeira', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.0891, longitude: -8.2479 },
  { name: 'Lagos', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1028, longitude: -8.6730 },
  { name: 'Tavira', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1284, longitude: -7.6496 },
  { name: 'Loulé', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1400, longitude: -8.0210 },
  { name: 'Olhão', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.0270, longitude: -7.8410 },
  { name: 'Silves', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1894, longitude: -8.4394 },
  { name: 'Vila Real de Santo António', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1950, longitude: -7.4178 },
  { name: 'Lagoa (Algarve)', country: 'Portugal', region: 'Algarve', district: 'Faro', zone: 'algarve', latitude: 37.1350, longitude: -8.4536 },
  { name: 'Funchal', country: 'Portugal', region: 'Ilha da Madeira', district: 'Madeira', zone: 'ilhas', latitude: 32.6669, longitude: -16.9241 },
  { name: 'Porto Santo', country: 'Portugal', region: 'Ilha de Porto Santo', district: 'Madeira', zone: 'ilhas', latitude: 33.0603, longitude: -16.3361 },
  { name: 'Santa Cruz', country: 'Portugal', region: 'Ilha da Madeira', district: 'Madeira', zone: 'ilhas', latitude: 32.6883, longitude: -16.7936 },
  { name: 'Câmara de Lobos', country: 'Portugal', region: 'Ilha da Madeira', district: 'Madeira', zone: 'ilhas', latitude: 32.6500, longitude: -16.9667 },
  { name: 'Machico', country: 'Portugal', region: 'Ilha da Madeira', district: 'Madeira', zone: 'ilhas', latitude: 32.7167, longitude: -16.7667 },
  { name: 'Ponta Delgada', country: 'Portugal', region: 'Ilha de São Miguel', district: 'Açores', zone: 'ilhas', latitude: 37.7412, longitude: -25.6756 },
  { name: 'Ribeira Grande', country: 'Portugal', region: 'Ilha de São Miguel', district: 'Açores', zone: 'ilhas', latitude: 37.8211, longitude: -25.5211 },
  { name: 'Angra do Heroísmo', country: 'Portugal', region: 'Ilha Terceira', district: 'Açores', zone: 'ilhas', latitude: 38.6544, longitude: -27.2189 },
  { name: 'Horta', country: 'Portugal', region: 'Ilha do Faial', district: 'Açores', zone: 'ilhas', latitude: 38.5358, longitude: -28.6278 },

  // --- GRUPO 5: CAPITAIS GLOBAIS ---
  { name: 'Madrid', country: 'Espanha', region: 'Comunidade de Madrid', zone: 'global', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Londres', country: 'Reino Unido', region: 'Inglaterra', zone: 'global', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', country: 'França', region: 'Île-de-France', zone: 'global', latitude: 48.8566, longitude: 2.3522 },
  { name: 'São Paulo', country: 'Brasil', region: 'Sudeste', zone: 'global', latitude: -23.5505, longitude: -46.6333 },
  { name: 'Rio de Janeiro', country: 'Brasil', region: 'Sudeste', zone: 'global', latitude: -22.9068, longitude: -43.1729 },
  { name: 'Nova Iorque', country: 'Estados Unidos', region: 'Nova Iorque', zone: 'global', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Tóquio', country: 'Japão', region: 'Kanto', zone: 'global', latitude: 35.6762, longitude: 139.6503 }
];

// Split locations into chunks of max 40 (well under Open-Meteo free tier limit of 50 locations per URL)
export const OPEN_METEO_CHUNK_LIMIT = 40;

export function chunkLocations(locations: WeatherLocation[], chunkSize: number = OPEN_METEO_CHUNK_LIMIT): WeatherLocation[][] {
  const chunks: WeatherLocation[][] = [];
  for (let i = 0; i < locations.length; i += chunkSize) {
    chunks.push(locations.slice(i, i + chunkSize));
  }
  return chunks;
}
