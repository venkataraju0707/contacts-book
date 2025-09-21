import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail, MdPhone, MdStar, MdStarBorder, MdEdit, MdDelete } from "react-icons/md";

const API_URL = "process.env.REACT_APP_API_URL;";

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingId, setEditingId] = useState(null);
  const limit = 5;

  useEffect(() => {
    fetchContacts(page);
  }, [page, sortOrder, search]);

  const fetchContacts = async (pageNum = 1) => {
    try {
      const res = await fetch(
        `${API_URL}?page=${pageNum}&limit=${limit}&search=${search}&sort=${sortOrder}`
      );
      const data = await res.json();
      setContacts(data.data);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!/.+@.+\..+/.test(form.email)) {
      setError("Invalid email format");
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone must be 10 digits");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
         
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated = await res.json();
          setContacts(contacts.map((c) => (c._id === editingId ? updated : c)));
          toast.success("Contact updated successfully!");
          setEditingId(null);
          setForm({ name: "", email: "", phone: "" });
        } else {
          toast.error("Failed to update contact");
        }
      } else {
         
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const newContact = await res.json();
          setContacts([newContact, ...contacts]);
          setForm({ name: "", email: "", phone: "" });
          toast.success("Contact added successfully!");
        } else {
          const errData = await res.json();
          setError(errData.message || "Failed to add contact");
        }
      }
    } catch {
      setError("Server error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts(contacts.filter((c) => c._id !== id));
        toast.success("Contact deleted successfully!");
      }
    } catch {}
  };

   
  const handleEdit = (contact) => {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone });
    setEditingId(contact._id);
  };

  const toggleFavorite = async (contact) => {
    try {
      const res = await fetch(`${API_URL}/${contact._id}/favorite`, {
        method: "PUT",
      });
      if (res.ok) {
        setContacts(
          contacts.map((c) =>
            c._id === contact._id ? { ...c, favorite: !c.favorite } : c
          )
        );
      }
    } catch {}
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    let pages = [];
    if (totalPages <= maxVisible) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (page <= 3) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (page >= totalPages - 2) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
      }
    }
    return pages;
  };

  const groupedContacts = [...contacts]
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );

  return (
    <div className="app">
      <ToastContainer />
      <div className="container">
        <h1>Contact Book</h1>

        <div className="layout">
          <div className="contacts">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />

            {groupedContacts.length === 0 ? (
              <p>No contacts found.</p>
            ) : (
              <>
                <ul className="contact-list">
                  {groupedContacts.map((contact) => (
                    <li key={contact._id} className="contact-card">
                      <div>
                        <strong>{contact.name}</strong>
                        <br />
                        <small><MdEmail /> {contact.email}</small>
                        <br />
                        <small><MdPhone /> {contact.phone}</small>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => toggleFavorite(contact)}
                          className="favorite-btn"
                        >
                          {contact.favorite ? <MdStar /> : <MdStarBorder />}
                        </button>
                        <button
                          onClick={() => handleEdit(contact)}
                          className="edit-btn"
                        >
                          <MdEdit />
                        </button>
                        <button
                           type="submit"
                          
                          className="delete-btn"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="pagination">
                  <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Prev
                  </button>
                  {getPageNumbers().map((num, index) =>
                    num === "..." ? (
                      <span key={index} className="dots">...</span>
                    ) : (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={num === page ? "active-page" : ""}
                      >
                        {num}
                      </button>
                    )
                  )}
                  <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                    Next
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="form-wrapper">
            <h2>{editingId ? "Edit Contact" : "Add New Contact"}</h2>
            <form onSubmit={handleSubmit} className="form">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone (10 digits)"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="\d{10}"
                title="Phone must be exactly 10 digits"
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="add-btn">
                {editingId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
