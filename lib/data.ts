// Local data store for teams and members
export interface Team {
  id: string
  name: string
  description: string | null
  research_area: string | null
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  name: string
  email: string | null
  role: string | null
  is_leader: boolean
  team_id: string | null
  created_at: string
  updated_at: string
}

// Initial demo data
let teams: Team[] = [
  {
    id: "1",
    name: "Équipe Intelligence Artificielle",
    description: "Recherche en IA et apprentissage automatique",
    research_area: "Intelligence Artificielle",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Équipe Cybersécurité",
    description: "Sécurité informatique et cryptographie",
    research_area: "Cybersécurité",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
]

let members: Member[] = [
  {
    id: "1",
    name: "Dr. Ahmed Benali",
    email: "ahmed.benali@uh2c.ma",
    role: "Professeur",
    is_leader: true,
    team_id: "1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Dr. Fatima Zahra",
    email: "fatima.zahra@uh2c.ma",
    role: "Maître Assistant",
    is_leader: false,
    team_id: "1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Dr. Youssef Alami",
    email: "youssef.alami@uh2c.ma",
    role: "Professeur",
    is_leader: true,
    team_id: "2",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
]

// Local storage functions
export const dataService = {
  // Teams
  async getTeams(): Promise<(Team & { members: Member[] })[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const teamsWithMembers = teams.map((team) => ({
          ...team,
          members: members.filter((member) => member.team_id === team.id),
        }))
        resolve(teamsWithMembers)
      }, 100) // Simulate network delay
    })
  },

  async createTeam(teamData: Omit<Team, "id" | "created_at" | "updated_at">): Promise<Team> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTeam: Team = {
          ...teamData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        teams.push(newTeam)
        resolve(newTeam)
      }, 100)
    })
  },

  async deleteTeam(teamId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        teams = teams.filter((team) => team.id !== teamId)
        members = members.filter((member) => member.team_id !== teamId)
        resolve()
      }, 100)
    })
  },

  async getTeam(teamId: string): Promise<Team | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const team = teams.find((t) => t.id === teamId) || null
        resolve(team)
      }, 100)
    })
  },

  // Members
  async getMembers(teamId: string): Promise<Member[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const teamMembers = members.filter((member) => member.team_id === teamId)
        resolve(teamMembers)
      }, 100)
    })
  },

  async createMember(memberData: Omit<Member, "id" | "created_at" | "updated_at">): Promise<Member> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMember: Member = {
          ...memberData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        members.push(newMember)
        resolve(newMember)
      }, 100)
    })
  },

  async deleteMember(memberId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        members = members.filter((member) => member.id !== memberId)
        resolve()
      }, 100)
    })
  },

  async updateMember(memberId: string, updates: Partial<Member>): Promise<Member | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memberIndex = members.findIndex((m) => m.id === memberId)
        if (memberIndex !== -1) {
          members[memberIndex] = { ...members[memberIndex], ...updates, updated_at: new Date().toISOString() }
          resolve(members[memberIndex])
        } else {
          resolve(null)
        }
      }, 100)
    })
  },

  async setTeamLeader(teamId: string, memberId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Remove leader status from all team members
        members = members.map((member) => (member.team_id === teamId ? { ...member, is_leader: false } : member))
        // Set new leader
        const memberIndex = members.findIndex((m) => m.id === memberId)
        if (memberIndex !== -1) {
          members[memberIndex] = { ...members[memberIndex], is_leader: true }
        }
        resolve()
      }, 100)
    })
  },
}
