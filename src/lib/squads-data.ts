// Plantillas por equipo (shortName). Datos aportados por el árbitro (FExF / LaPreferente / etc.).
export interface SquadPlayer {
  name: string;
  position?: string;
  trajectory?: string;
  prevGoals?: number;
  prevYellow?: number;
  prevRed?: number;
}
export const SQUADS: Record<string, SquadPlayer[]> = {
  "Montijo": [
    {
      "name": "Ivan Acosta Garrido"
    },
    {
      "name": "Alvaro Alcantara Sanchez"
    },
    {
      "name": "Ernest Boateng"
    },
    {
      "name": "Rodrigo De Lucas Iniesta"
    },
    {
      "name": "Aidan Martin Edwards"
    },
    {
      "name": "Asier García Tarraga"
    },
    {
      "name": "Martin Gomez Spinoglio"
    },
    {
      "name": "Ismael Gutiérrez Cerda"
    },
    {
      "name": "Pablo Jorques Navalon"
    },
    {
      "name": "Henoc Konan"
    },
    {
      "name": "Marcelino Lopez Jimenez"
    },
    {
      "name": "Santiago Daniel Maidana"
    },
    {
      "name": "Kwabena Junior Nkrumah"
    },
    {
      "name": "Luis Alberto Piro Morales"
    },
    {
      "name": "Waldemar Recagno Umpierrez"
    },
    {
      "name": "Ivan Riveiro Vallo"
    },
    {
      "name": "Elias Enrique Romero Barrios"
    },
    {
      "name": "Alfonso Sanchez Casillas"
    },
    {
      "name": "Javier Sanchez Perez"
    },
    {
      "name": "Jose Sanchez Piedehierro"
    }
  ],
  "Cabeza del Buey": [
    {
      "name": "Douglas Jr Arango Escorcia",
      "position": "WINGER",
      "trajectory": "Dos Hermanas CF (2019/20-2020/21) → CD Inter Sevilla (2021/22) → CD Utrera (2022/23) → CD Inter Sevilla (2023/24) → Coria CF (2025/26) → Cabeza del Buey (2026/27)",
      "prevGoals": 0,
      "prevYellow": 0,
      "prevRed": 0
    },
    {
      "name": "Raul Balsera Moyano",
      "position": "CM",
      "trajectory": "Cabeza del Buey (seis temporadas registradas desde 2020/21; continúa en 2026/27)",
      "prevGoals": 0,
      "prevYellow": 0,
      "prevRed": 0
    },
    {
      "name": "Karamoko Bamba",
      "position": "FB",
      "trajectory": "Royal FC Bobo → FC Cubillas → Recreativo Granada → Trival Valderas → CF Talavera → CD Manchego Ciudad Real → Cabeza del Buey",
      "prevGoals": 0,
      "prevYellow": 5,
      "prevRed": 1
    },
    {
      "name": "Jhoan Cadavid Rueda",
      "position": "CM",
      "trajectory": "CF Campanario → Cabeza del Buey (desde 2023/24)",
      "prevGoals": 6,
      "prevYellow": 8,
      "prevRed": 1
    },
    {
      "name": "Luis Miguel Cruz Bueno",
      "position": "AM",
      "trajectory": "CD Diocesano → Moralo CP → CD Don Benito → CD Cieza → CF Jaraíz → Cabeza del Buey",
      "prevGoals": 14,
      "prevYellow": 4,
      "prevRed": 0
    },
    {
      "name": "Jorge Gonzalez Vargas",
      "position": "ST",
      "trajectory": "CD Castuera (2022/23-2024/25) → Cabeza del Buey (desde 2025/26)",
      "prevGoals": 0,
      "prevYellow": 1,
      "prevRed": 0
    },
    {
      "name": "Ahamadou Gumaneh Singateh",
      "position": "CB",
      "trajectory": "UE Fornells / UE Fornells B (2024/25) → Sporting Atlético, juvenil y senior (2025/26) → Cabeza del Buey",
      "prevGoals": 2,
      "prevYellow": 4,
      "prevRed": 0
    },
    {
      "name": "Sacha Tahan Lambourde",
      "position": "CB",
      "trajectory": "CD Benagalbón → Patrimonio Almadén CF → CD Gévora → Cabeza del Buey",
      "prevGoals": 1,
      "prevYellow": 3,
      "prevRed": 0
    },
    {
      "name": "David Leon Moyano",
      "position": "FB",
      "trajectory": "Córdoba CF (cadete, juvenil y Córdoba CF B; 2022/23-2025/26) → Cabeza del Buey",
      "prevGoals": 0,
      "prevYellow": 7,
      "prevRed": 0
    },
    {
      "name": "Jared Mbuamangongo Malango Jimenez",
      "position": "CM",
      "trajectory": "NYCFC Academy / AD Alcorcón → UD Rayo Ibense → Villaverde San Andrés → Cabeza del Buey",
      "prevGoals": 4,
      "prevYellow": 1,
      "prevRed": 0
    },
    {
      "name": "Quinn Tadhg Mcnutt",
      "position": "WINGER",
      "trajectory": "UCD La Cañada Atlético, juvenil (2024/25) → Jerez CF (2025/26) → Cabeza del Buey (2025/26-)",
      "prevGoals": 1,
      "prevYellow": 0,
      "prevRed": 0
    },
    {
      "name": "Ekow Mills",
      "position": "FB",
      "trajectory": "Real Valladolid Juvenil (2020/21) → Loja CD (2021/22) → Cabeza del Buey (desde 2025/26)",
      "prevGoals": 1,
      "prevYellow": 4,
      "prevRed": 0
    },
    {
      "name": "Pedro Andres Mina Quiñones",
      "position": "ST",
      "trajectory": "CP Malpartida → Cabeza del Buey (desde 2024/25)",
      "prevGoals": 10,
      "prevYellow": 9,
      "prevRed": 1
    },
    {
      "name": "Sako Da Conceicao Muela",
      "position": "CM",
      "trajectory": "Cabeza del Buey (desde 2025/26). Trayectoria anterior no consta en las fuentes consultadas.",
      "prevGoals": 6,
      "prevYellow": 4,
      "prevRed": 0
    },
    {
      "name": "Ruben Ramos Higuero",
      "position": "CB",
      "trajectory": "Olivenza FC (2023/24) → CD Gévora (2024/25) → CD Inter Ibiza (2025/26) → Cabeza del Buey",
      "prevGoals": 0,
      "prevYellow": 5,
      "prevRed": 0
    },
    {
      "name": "Joaquin Rocha Garcia",
      "position": "GK",
      "trajectory": "UD Almería (formación) → CD Don Benito / CD Miajadas → CF Trujillo → Moralo CP → CF Villanovense → Cabeza del Buey",
      "prevGoals": 0,
      "prevYellow": 2,
      "prevRed": 1
    },
    {
      "name": "Soumaila Sagna Djiba",
      "position": "FB",
      "trajectory": "Ciudad de Roquetas / Poli El Ejido → Arenas de Armilla → Moralo CP / Moralo B → Cabeza del Buey",
      "prevGoals": 0,
      "prevYellow": 5,
      "prevRed": 0
    },
    {
      "name": "Duvan Alberto Salgado Perez",
      "position": "CB",
      "trajectory": "CF Campanario (2022/23) → CD Castuera (2024/25) → Cabeza del Buey (desde 2025/26)",
      "prevGoals": 0,
      "prevYellow": 7,
      "prevRed": 1
    },
    {
      "name": "Pablo Trapiello Sarmiento",
      "position": "CB",
      "trajectory": "Real Avilés Juvenil → UP Langreo B / CF Sant Rafel → PE Sant Jordi → Real Unión Tenerife / CD Praviano → Cabeza del Buey",
      "prevGoals": 0,
      "prevYellow": 2,
      "prevRed": 0
    }
  ]
};
