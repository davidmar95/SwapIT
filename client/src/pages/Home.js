import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Alle Kategorien");
  const categories = [
    "Handy",
    "Laptop",
    "Monitor",
    "Drucker",
    "Software",
    "Kopfhörer",
    "Konsole",
    "Zubehör",
  ];
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    name: "",
    contact: "",
    location: "",
    condition: "",
    price: "",
    mode: "",
    image: null,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries({ ...form, createdAt: new Date().toISOString() }).forEach(
      ([key, value]) => {
        formData.append(key, value);
      }
    );

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/items`, formData);
      alert("Item erfolgreich gepostet!");
      setForm({
        title: "",
        description: "",
        type: "",
        name: "",
        contact: "",
        location: "",
        condition: "",
        price: "",
        mode: "",
        image: null,
      });
      fetchItems();
    } catch (err) {
      alert("Fehler beim Hochladen.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/items/${id}`);
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      applyFilters(search, categoryFilter, updated);
    } catch (err) {
      alert("Fehler beim Löschen.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    applyFilters(term, categoryFilter, items);
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategoryFilter(cat);
    applyFilters(search, cat, items);
  };

  const applyFilters = (searchTerm, category, data) => {
    let result = data;
    if (searchTerm.trim() !== "") {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (category !== "Alle Kategorien") {
      result = result.filter((item) => item.type === category);
    }
    setFilteredItems(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10 px-6 py-4 border-b flex flex-col gap-4 items-center">
        <div className="flex justify-between items-center w-full">
          <img src="/Logo-SwapIT.png" alt="Logo" className="h-10 md:h-12 mr-3" />
          <div className="text-sm text-green-700 font-semibold hidden md:block">
            🌿 Nachhaltig. Kostenlos. Studifreundlich.
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/account-icon.png"
              alt="Account"
              className="h-8 w-8 rounded-full border border-gray-300 shadow-sm"
            />
            <span className="text-sm font-medium text-gray-700">Mein Account</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-2xl">
          <input
            type="text"
            placeholder="🔍 Suche nach Titel..."
            value={search}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-xl flex-1 w-full"
          />
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="Alle Kategorien">Alle Kategorien</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* === Neues Angebot Formular === */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:col-span-1 border border-gray-200">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">
              🆕 Neues Angebot
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full p-3 border rounded-xl" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required className="w-full p-3 border rounded-xl">
                <option value="">Kategorie wählen</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea placeholder="Beschreibung" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Ort (z.B. Berlin)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="w-full p-3 border rounded-xl" />
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} required className="w-full p-3 border rounded-xl">
                <option value="">Zustand wählen</option>
                <option value="Neu">Neu</option>
                <option value="Gut">Gut</option>
                <option value="Okay">Okay</option>
                <option value="Defekt">Defekt</option>
              </select>
              <input type="text" placeholder="Preis (z.B. 25€ oder 0€ bei Tausch)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full p-3 border rounded-xl" />
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} required className="w-full p-3 border rounded-xl">
                <option value="">Verfügbarkeitsart wählen</option>
                <option value="Verkauf">Verkauf</option>
                <option value="Verleih">Nur Verleih</option>
              </select>
              <input type="text" placeholder="Dein Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Kontakt (z.B. E-Mail)" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required className="w-full p-3 border rounded-xl" />
              <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required className="w-full" />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium">
                📤 Hochladen
              </button>
            </form>
          </div>

          {/* === Angebotsliste === */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              📦 Aktuelle Angebote
            </h2>
            {filteredItems.length === 0 ? (
              <p className="text-pink-600 font-semibold text-center text-lg mt-10">
                ❌ Kein Item mit diesem Titel oder dieser Kategorie gefunden.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                    {item.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${item.image}`}
                        alt={item.title}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-bold text-indigo-700">{item.title}</h3>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-3">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Kategorie: {item.type}</p>
                        <p className="text-xs text-gray-500">📍 Ort: {item.location}</p>
                        <p className="text-xs text-gray-500">🔧 Zustand: {item.condition}</p>
                        <p className="text-xs text-gray-500">💶 Preis: {item.price}</p>
                        <p className="text-xs text-gray-500">🏷️ Art: {item.mode}</p>
                        <p className="text-xs text-gray-500">🕒 {new Date(item.createdAt).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">👤 Kontakt: {item.name} – {item.contact}</p>
                        <button
                          disabled
                          className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-600 cursor-not-allowed"
                        >
                          💬 Chat starten
                        </button>
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="mt-4 text-sm text-red-600 hover:underline self-start">
                        🗑️ Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6 mt-10">
        © 2025 SwapIT – Nachhaltig tauschen statt kaufen. Hallo Test!
      </footer>
    </div>
  );
}

export default Home;