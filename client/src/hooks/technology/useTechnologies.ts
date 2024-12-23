import { useState, useEffect } from 'react';
import { technologyService } from '@/services/technologyService';
import { Technology, TechnologyCategory } from '@/types';

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const data = await technologyService.getAllTechnologies();
      setTechnologies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTechnologyById = async (id: string) => {
    try {
      setLoading(true);
      const technology = await technologyService.getTechnologyById(id);
      return technology;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTechnologiesByCategory = async (category: TechnologyCategory) => {
    try {
      setLoading(true);
      const filteredTechnologies = await technologyService.getTechnologiesByCategory(category);
      return filteredTechnologies;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTechnology = async (technologyData: FormData) => {
    try {
      setLoading(true);
      const newTechnology = await technologyService.createTechnology(technologyData);
      setTechnologies(prev => [...prev, newTechnology]);
      return newTechnology;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTechnology = async (id: string, technologyData: FormData) => {
    try {
      setLoading(true);
      const updatedTechnology = await technologyService.updateTechnology(id, technologyData);
      setTechnologies(prev => prev.map(t => t.id === id ? updatedTechnology : t));
      return updatedTechnology;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTechnology = async (id: string) => {
    try {
      setLoading(true);
      await technologyService.deleteTechnology(id);
      setTechnologies(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProficiencyLevel = async (id: string, level: number) => {
    try {
      setLoading(true);
      const updatedTechnology = await technologyService.updateProficiencyLevel(id, level);
      setTechnologies(prev => prev.map(t => t.id === id ? updatedTechnology : t));
      return updatedTechnology;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTechnologiesByIds = (ids: string[]) => {
    return technologies.filter(tech => ids.includes(tech.id));
  };

  return {
    technologies,
    loading,
    error,
    getTechnologyById,
    getTechnologiesByCategory,
    createTechnology,
    updateTechnology,
    deleteTechnology,
    updateProficiencyLevel,
    getTechnologiesByIds,
    refreshTechnologies: fetchTechnologies,
  };
} 