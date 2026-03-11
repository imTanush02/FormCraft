
import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function useForm() {
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/forms');
      setForms(data.forms);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFormById = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/forms/${id}`);
      setCurrentForm(data.form);
      return data.form;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load form');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createForm = useCallback(async (title, description = '') => {
    try {
      const { data } = await api.post('/forms', { title, description });
      toast.success('Form created!');
      return data.form;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create form');
      return null;
    }
  }, []);

  const updateForm = useCallback(async (id, payload) => {
    try {
      const { data } = await api.put(`/forms/${id}`, payload);
      setCurrentForm(data.form);
      toast.success('Form saved!');
      return data.form;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save form');
      return null;
    }
  }, []);

  const deleteForm = useCallback(async (id) => {
    try {
      await api.delete(`/forms/${id}`);
      setForms((prev) => prev.filter((f) => f._id !== id));
      toast.success('Form deleted');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete form');
      return false;
    }
  }, []);

  const togglePublish = useCallback(async (id) => {
    try {
      const { data } = await api.patch(`/forms/${id}/publish`);
      setForms((prev) =>
        prev.map((f) => (f._id === id ? { ...f, isPublished: data.form.isPublished } : f))
      );
      toast.success(data.message);
      return data.form;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      return null;
    }
  }, []);

  const duplicateForm = useCallback(async (id) => {
    try {
      const { data } = await api.post(`/forms/${id}/duplicate`);
      toast.success('Form duplicated!');
      return data.form;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to duplicate form');
      return null;
    }
  }, []);

  return {
    forms, currentForm, isLoading,
    fetchForms, fetchFormById, createForm,
    updateForm, deleteForm, togglePublish, duplicateForm,
  };
}
