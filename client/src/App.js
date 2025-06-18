// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', type: '', image: null, name: '', contact: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:4000/items');
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    await axios.post('http://localhost:4000/items', formData);
    setForm({ title: '', description: '', type: '', image: null, name: '', contact: '' });
    fetchItems();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/items/${id}`);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-700">SwapIT 📦</h1>
        <p className="text-gray-600">Gebrauchte IT – nachhaltig & kostenlos unter Studis tauschen</p>
      </header>

      {/* Formular */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mb-10 border">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">📝 Neues Angebot</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input className="p-3 border rounded-xl" placeholder="Titel" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea className="p-3 border rounded-xl" placeholder="Beschreibung" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input className="p-3 border rounded-xl" placeholder="Kategorie (z.B. Laptop)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
          <input className="p-3 border rounded-xl" placeholder="Dein Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className="p-3 border rounded-xl" placeholder="Deine Kontaktmöglichkeit" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
          <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="p-2" required />
          <button className="bg-indigo-600 text-white rounded-xl py-3 font-medium hover:bg-indigo-700 transition" type="submit">📤 Angebot posten</button>
        </form>
      </div>

      {/* Angebotsliste */}
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">📋 Aktuelle Angebote</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white border rounded-xl shadow p-4 flex flex-col justify-between">
              {item.image && <img src={`http://localhost:4000${item.image}`} alt={item.title} className="w-full h-40 object-cover rounded-md mb-3" />}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">{item.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">Kategorie: {item.type}</p>
                <p className="text-xs text-gray-500">Kontakt: {item.name} – {item.contact}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="mt-3 text-sm text-red-600 hover:underline self-start">🗑️ Löschen</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
