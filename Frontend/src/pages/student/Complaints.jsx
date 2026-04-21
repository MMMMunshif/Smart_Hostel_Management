// IMPORTANT: Only showing FIXED core parts (conflict removed)
// Keep your imports same

// ✅ FIXED helpers
const normalize = (v = "") => v.toString().toLowerCase().trim();

const statusConfig = (status = "") => {
  const s = normalize(status);
  if (s === "resolved") return { cls: "badge-resolved", label: "Resolved" };
  if (s === "in progress") return { cls: "badge-progress", label: "In Progress" };
  return { cls: "badge-pending", label: "Pending" };
};

// ✅ FIXED state (merged)
const [statusFilter, setStatusFilter] = useState("all");
const [imageFile, setImageFile] = useState(null);
const [preview, setPreview] = useState("");

// ✅ FIXED submit (supports image)
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title.trim() || !form.description.trim()) {
    setMsg({ type: "err", text: "Title and description are required." });
    return;
  }

  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("priority", form.priority);
    if (imageFile) formData.append("image", imageFile);

    await axios.post(`${API}/complaints`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setForm({ title: "", description: "", category: "Other", priority: "Medium" });
    setImageFile(null);
    setPreview("");

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

// ✅ FIXED filtering
const filtered = useMemo(() =>
  complaints.filter((c) => {
    const q = search.toLowerCase();

    const matchSearch =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "all" ||
      normalize(c.status) === statusFilter;

    return matchSearch && matchStatus;
  }),
[complaints, search, statusFilter]);

// ✅ FIXED image preview
const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  setImageFile(file || null);

  if (file) {
    const url = URL.createObjectURL(file);
    setPreview(url);
  } else {
    setPreview("");
  }
};