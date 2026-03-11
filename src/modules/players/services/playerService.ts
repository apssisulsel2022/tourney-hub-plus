import { Player, CreatePlayerInput, AgeCategory, Position } from "../types/player";

const mockClubs = [
  { id: "CLB1", name: "FC Thunder", logo: "https://example.com/thunder.png" },
  { id: "CLB2", name: "Red Lions", logo: "https://example.com/lions.png" },
  { id: "CLB3", name: "Phoenix SC", logo: "https://example.com/phoenix.png" },
  { id: "CLB4", name: "United FC", logo: "https://example.com/united.png" },
  { id: "CLB5", name: "Blue Eagles", logo: "https://example.com/eagles.png" },
  { id: "CLB6", name: "Golden Stars", logo: "https://example.com/stars.png" },
];

const mockPositions: Position[] = ["Goalkeeper", "Defender", "Midfielder", "Forward", "Multi-position"];
const mockAgeCategories: AgeCategory[] = ["U8", "U10", "U12", "U14", "U16", "U18", "Senior"];

export const generateMockPlayers = (count: number): Player[] => {
  const players: Player[] = [];
  const now = new Date();
  
  for (let i = 1; i <= count; i++) {
    const club = mockClubs[Math.floor(Math.random() * mockClubs.length)];
    const primaryPos = mockPositions[Math.floor(Math.random() * mockPositions.length)];
    const ageCat = mockAgeCategories[Math.floor(Math.random() * mockAgeCategories.length)];
    const year = now.getFullYear();
    const id = `${club.id.replace("CLB", "KICK")}-${year}-${String(i).padStart(4, '0')}`;
    
    players.push({
      id,
      name: `Player ${i}`,
      photoUrl: `https://i.pravatar.cc/200?u=${id}`,
      dateOfBirth: "2000-01-01",
      clubId: club.id,
      clubName: club.name,
      clubLogo: club.logo,
      ageCategory: ageCat,
      primaryPosition: primaryPos,
      secondaryPosition: i % 3 === 0 ? mockPositions[(mockPositions.indexOf(primaryPos) + 1) % mockPositions.length] : undefined,
      nationality: "USA",
      email: `player${i}@example.com`,
      phone: `+1 555-000-${String(i).padStart(4, '0')}`,
      address: `${i} Stadium Way, New York, NY`,
      emergencyContact: {
        name: `Parent ${i}`,
        relationship: "Parent",
        phone: `+1 555-111-${String(i).padStart(4, '0')}`
      },
      stats: {
        matchesPlayed: Math.floor(Math.random() * 50),
        goals: Math.floor(Math.random() * 20),
        assists: Math.floor(Math.random() * 15),
        cleanSheets: primaryPos === "Goalkeeper" ? Math.floor(Math.random() * 10) : undefined,
        averageRating: 6.5 + Math.random() * 3,
        careerHighlights: [`MVP Season ${year - 1}`, `Leading Scorer Cup ${year - 1}`]
      },
      documents: [],
      matchHistory: [],
      trainingRecords: [],
      status: i % 20 === 0 ? "suspended" : i % 15 === 0 ? "inactive" : "active",
      createdAt: now.toISOString(),
    });
  }
  return players;
};

// Singleton in-memory storage for mock data
let playerStorage: Player[] = generateMockPlayers(52); // Default to 52 for initial display

export const playerService = {
  getPlayers: async (page = 1, limit = 10, filters?: { 
    search?: string; 
    clubId?: string[]; 
    ageCategory?: AgeCategory[]; 
    position?: Position[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...playerStorage];
    
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.id.toLowerCase().includes(s) || 
        p.clubName.toLowerCase().includes(s)
      );
    }
    
    if (filters?.clubId && filters.clubId.length > 0) {
      filtered = filtered.filter(p => filters.clubId!.includes(p.clubId));
    }
    
    if (filters?.ageCategory && filters.ageCategory.length > 0) {
      filtered = filtered.filter(p => filters.ageCategory!.includes(p.ageCategory));
    }
    
    if (filters?.position && filters.position.length > 0) {
      filtered = filtered.filter(p => filters.position!.includes(p.primaryPosition));
    }

    if (filters?.sortBy) {
      const field = filters.sortBy as keyof Player;
      filtered.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return filters.sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return 0;
      });
    }
    
    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    
    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  getPlayerById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return playerStorage.find(p => p.id === id);
  },
  
  createPlayer: async (data: CreatePlayerInput) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPlayer: Player = {
      ...data,
      id: `KO-2026-${String(playerStorage.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      stats: {
        matchesPlayed: 0,
        goals: 0,
        assists: 0,
        averageRating: 0,
        careerHighlights: []
      },
      documents: [],
      matchHistory: [],
      trainingRecords: [],
    };
    playerStorage.unshift(newPlayer);
    return newPlayer;
  },
  
  updatePlayer: async (id: string, data: Partial<Player>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = playerStorage.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Player not found");
    playerStorage[index] = { ...playerStorage[index], ...data };
    return playerStorage[index];
  },
  
  deletePlayer: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    playerStorage = playerStorage.filter(p => p.id !== id);
    return true;
  },

  bulkDelete: async (ids: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    playerStorage = playerStorage.filter(p => !ids.includes(p.id));
    return true;
  }
};
