import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

/* Helpers */
const norm = (v = "") => v.toString().toLowerCase().trim();

const statusCfg = (status = "") => {
  const s = norm(status);
  if (s === "resolved") return { cls: "badge-resolved", label: "Resolved" };
  if (s === "in progress") return { cls: "badge-progress", label: "In Progress" };
  return { cls: "badge-pending", label: "Pending" };
};

export default function Complaints() {
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [msg, setMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    priority: "Medium",
  });

  /* Load complaints */
  const load = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.complaints || [];

      setComplaints(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* Form change */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setMsg({ type: "err", text: "Title and description are required." });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API}/complaints`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        title: "",
        description: "",
        category: "Other",
        priority: "Medium",
      });

      setMsg({ type: "ok", text: "Complaint submitted successfully!" });
      showToast("Complaint submitted ✅");

      load();
    } catch (err) {
      const m = err.response?.data?.message || "Failed to submit.";
      setMsg({ type: "err", text: m });
      showToast(m, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* Filter */
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const q = search.toLowerCase();

      const matchSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || norm(c.status) === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [complaints, search, statusFilter]);

  return (
    <Layout role="student">
      <div style={{ padding: "20px" }}>
        <h2>Complaints</h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {msg.text && (
          <p style={{ color: msg.type === "ok" ? "green" : "red" }}>
            {msg.text}
          </p>
        )}

        {/* Search */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          filtered.map((c) => {
            const status = statusCfg(c.status);

            return (
              <div key={c._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <span>{status.label}</span>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}