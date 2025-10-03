const API_URL_MANUAL = "http://localhost:8080/api/publications"; 

// Types pour les publications
export interface Publication {
  id?: number;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  // Ajoutant d'autres propriétés selon vos besoins
}

export const publicationService = {
  getAll: async (): Promise<Publication[]> => {
    try {
      const res = await fetch(API_URL_MANUAL, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des publications:', error);
      throw error;
    }
  },

  getById: async (id: number | string): Promise<Publication> => {
    try {
      const res = await fetch(`${API_URL_MANUAL}/${id}`);
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de la publication ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<Publication, 'id'>): Promise<Publication> => {
    try {
      const res = await fetch(API_URL_MANUAL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Erreur lors de la création de la publication:', error);
      throw error;
    }
  },

  update: async (id: number | string, data: Partial<Publication>): Promise<Publication> => {
    try {
      const res = await fetch(`${API_URL_MANUAL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la publication ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number | string): Promise<void> => {
    try {
      const res = await fetch(`${API_URL_MANUAL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la publication ${id}:`, error);
      throw error;
    }
  }
};
