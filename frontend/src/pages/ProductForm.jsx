import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const emptyForm = { title: '', description: '', category: '', fileFormat: '', price: '', fileUrl: '', status: 'published' };

export default function ProductForm() {
  const { id } = useParams(); // present only when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then((res) => {
        const p = res.data.product;
        setForm({
          title: p.title, description: p.description, category: p.category,
          fileFormat: p.fileFormat, price: p.price, fileUrl: p.fileUrl, status: p.status,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.title || !form.description || !form.category || !form.fileFormat || !form.fileUrl) {
      return 'Please fill in all required fields before submitting.';
    }
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) {
      return 'Price must be a valid non-negative number.';
    }
    return '';
  };

  const handleSubmit = async (e, statusOverride) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    const payload = { ...form, price: Number(form.price), status: statusOverride || form.status };
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  return (
    <div className="page">
      <h2>{isEdit ? 'Edit Product' : 'Add New Template'}</h2>
      {error && <div className="message error">{error}</div>}
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Template Title</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>Short Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <label>Product Category</label>
        <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Communication Mgmt" />

        <label>File Format</label>
        <input name="fileFormat" value={form.fileFormat} onChange={handleChange} placeholder="e.g. PDF, XLSX" />

        <label>Price (AUD)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" />

        <label>Template File URL</label>
        <input name="fileUrl" value={form.fileUrl} onChange={handleChange} placeholder="https://..." />

        <div className="form-actions">
          <button type="button" onClick={(e) => handleSubmit(e, 'draft')}>Save as Draft</button>
          <button type="button" onClick={(e) => handleSubmit(e, 'published')} className="btn-primary">Publish</button>
        </div>
      </form>
    </div>
  );
}
