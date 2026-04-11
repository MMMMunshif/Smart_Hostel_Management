import Layout from "../../components/Layout";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, { autoConnect: true });

function WardenInbox() {
  const { showToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API}/warden-messages/admin/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load conversations", "error");
    }
  };

  const openConversation = async (conv) => {
    try {
      setSelected(conv.conversationId);
      setSelectedConv(conv);
      socket.emit("join_conversation", conv.conversationId);
      const res = await axios.get(
        `${API}/warden-messages/admin/conversations/${conv.conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(Array.isArray(res.data) ? res.data : []);
      await axios.put(
        `${API}/warden-messages/read/${conv.conversationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConversations();
    } catch {
      showToast("Failed to load messages", "error");
    }
  };

  useEffect(() => {
    fetchConversations();
    socket.on("receive_message", (message) => {
      if (message.conversationId === selected) {
        setMessages((prev) => [...prev, message]);
      }
      fetchConversations();
    });
    return () => socket.off("receive_message");
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selected) return;
    try {
      const res = await axios.post(
        `${API}/warden-messages`,
        { text, conversationId: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("send_message", newMessage);
      setText("");
      inputRef.current?.focus();
      fetchConversations();
    } catch {
      showToast("Failed to send message", "error");
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !selected) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", selected);
      if (text.trim()) formData.append("text", text);
      const res = await axios.post(`${API}/warden-messages/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("send_message", newMessage);
      setText("");
      fetchConversations();
    } catch {
      showToast("Failed to upload file", "error");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      recordingStartRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(recordingTimerRef.current);
        setRecordingSeconds(0);
        const durationSeconds = Math.round((Date.now() - recordingStartRef.current) / 1000);
        const ext = mimeType.includes("ogg") ? "ogg" : "webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.${ext}`, { type: mimeType });
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("duration", durationSeconds);
        if (selected) formData.append("conversationId", selected);
        try {
          const res = await axios.post(`${API}/warden-messages/upload`, formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
          const newMessage = res.data;
          setMessages((prev) => [...prev, newMessage]);
          socket.emit("send_message", newMessage);
          fetchConversations();
        } catch {
          showToast("Failed to send voice message", "error");
        }
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(250);
      setRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      showToast("Microphone access denied", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const cancelRecording = () => {
    clearInterval(recordingTimerRef.current);
    setRecordingSeconds(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = () => {};
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatRecordingTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "S";

  const filtered = useMemo(
    () => conversations.filter((c) =>
      (c.sender?.name || "Student").toLowerCase().includes(search.toLowerCase())
    ),
    [conversations, search]
  );

  const getMediaUrl = (msg) => {
    const raw =
      (msg.voiceUrl && msg.voiceUrl.trim()) ||
      (msg.fileUrl && msg.fileUrl.trim()) ||
      (msg.imageUrl && msg.imageUrl.trim()) ||
      (msg.url && msg.url.trim()) ||
      "";
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `http://localhost:5000/${raw.replace(/^\/+/, "").replace(/\\/g, "/")}`;
  };

  // Custom audio player
  const AudioPlayer = ({ url, duration, isMine }) => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(duration || 0);
    const [error, setError] = useState(false);

    const togglePlay = () => {
      if (!audioRef.current) return;
      if (playing) audioRef.current.pause();
      else audioRef.current.play().catch(() => setError(true));
    };

    const fmtSec = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

    if (error) return (
      <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
        ⚠️ Audio unavailable &nbsp;
        <a href={url} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>Download</a>
      </div>
    );

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 190 }}>
        <audio
          ref={audioRef}
          src={url}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); }}
          onTimeUpdate={(e) => {
            const a = e.target;
            setCurrentTime(a.currentTime);
            if (a.duration && !isNaN(a.duration)) {
              setProgress((a.currentTime / a.duration) * 100);
              setTotalDuration(a.duration);
            }
          }}
          onLoadedMetadata={(e) => {
            const d = e.target.duration;
            if (d && !isNaN(d) && isFinite(d)) setTotalDuration(d);
          }}
          onError={() => setError(true)}
          style={{ display: "none" }}
        />
        <button onClick={togglePlay} style={{
          width: 32, height: 32, borderRadius: "50%", border: "none",
          background: isMine ? "rgba(255,255,255,0.25)" : "rgba(217,119,6,0.15)",
          color: isMine ? "#fff" : "#d97706",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0, fontSize: 12,
        }}>
          {playing ? "⏸" : "▶"}
        </button>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              height: 3, borderRadius: 99,
              background: isMine ? "rgba(255,255,255,0.2)" : "rgba(217,119,6,0.15)",
              cursor: "pointer", position: "relative",
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              if (audioRef.current?.duration) audioRef.current.currentTime = pct * audioRef.current.duration;
            }}
          >
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: 99,
              background: isMine ? "rgba(255,255,255,0.75)" : "#d97706",
              transition: "width 0.1s linear",
            }} />
          </div>
          <div style={{ fontSize: 10, opacity: 0.6, fontFamily: "'DM Mono', monospace" }}>
            {playing ? fmtSec(currentTime) : "🎙"} · {fmtSec(totalDuration)}
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (msg, isMine) => {
    const url = getMediaUrl(msg);
    const type = msg.messageType || msg.type || "";

    if (type === "image" && url) return (
      <div>
        {msg.text && <div style={{ marginBottom: 8, fontSize: 13 }}>{msg.text}</div>}
        <img
          src={url} alt={msg.fileName || "image"}
          style={{ maxWidth: 220, width: "100%", borderRadius: 12, display: "block", cursor: "pointer",
            border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          onClick={() => setPreviewImage(url)}
          onError={(e) => {
            e.target.outerHTML = `<div style="font-size:12px;opacity:0.6;padding:4px">⚠️ Image failed · <a href="${url}" target="_blank" style="color:inherit">Open</a></div>`;
          }}
        />
      </div>
    );

    if (type === "file" && url) return (
      <div>
        {msg.text && <div style={{ marginBottom: 8, fontSize: 13 }}>{msg.text}</div>}
        <a href={url} target="_blank" rel="noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 6, color: "inherit",
          textDecoration: "none", background: "rgba(0,0,0,0.06)",
          padding: "6px 12px", borderRadius: 8, fontSize: 12.5,
          border: "1px solid rgba(0,0,0,0.08)",
        }}>
          📎 {msg.fileName || "Download file"}
        </a>
      </div>
    );

    if (type === "voice" && url) return (
      <div>
        {msg.text && <div style={{ marginBottom: 8, fontSize: 13 }}>{msg.text}</div>}
        <AudioPlayer url={url} duration={msg.duration} isMine={isMine} />
      </div>
    );

    if (url) {
      const lower = url.toLowerCase();
      if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) return (
        <img src={url} alt="attachment"
          style={{ maxWidth: 220, borderRadius: 12, display: "block", cursor: "pointer" }}
          onClick={() => setPreviewImage(url)}
          onError={(e) => { e.target.style.display = "none"; }} />
      );
      if (/\.(webm|ogg|mp3|m4a|wav)/.test(lower)) return (
        <AudioPlayer url={url} duration={msg.duration} isMine={isMine} />
      );
    }

    return <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{msg.text}</span>;
  };

  const totalUnread = conversations.reduce((a, c) => a + (c.unreadCount || 0), 0);

  return (
    <Layout role="admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .wi * { box-sizing: border-box; }
        .wi { font-family: 'DM Sans', sans-serif; }

        /* ── Page ── */
        .wi-page {
          min-height: 100vh;
          background: #faf7f2;
          background-image:
            radial-gradient(ellipse 60% 50% at 15% 0%, rgba(251,191,36,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 85% 100%, rgba(134,239,172,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(253,230,138,0.04) 0%, transparent 70%);
          padding: 28px 24px 24px;
        }

        /* ── Header ── */
        .wi-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }

        .wi-header-left { display: flex; align-items: center; gap: 16px; }

        .wi-logo {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(245,158,11,0.25), 0 0 0 1px rgba(245,158,11,0.15);
          flex-shrink: 0;
        }

        .wi-logo svg {
          width: 24px; height: 24px;
          stroke: #fff; fill: none;
          stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        .wi-title {
          font-family: 'Fraunces', serif;
          font-size: 26px; font-weight: 600;
          color: #1c1917; letter-spacing: -0.5px; margin: 0 0 3px;
        }

        .wi-sub { font-size: 13px; color: #78716c; margin: 0; }

        .wi-header-right { display: flex; align-items: center; gap: 10px; }

        .wi-stat-chip {
          display: flex; align-items: center; gap: 7px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 999px;
          padding: 7px 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          font-size: 12.5px; font-weight: 500; color: #57534e;
        }

        .wi-stat-chip .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
          animation: livePulse 2s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,0.08); }
        }

        .wi-unread-chip {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 12.5px; font-weight: 600;
          box-shadow: 0 4px 12px rgba(245,158,11,0.25);
          display: ${totalUnread > 0 ? "flex" : "none"};
          align-items: center; gap: 6px;
        }

        /* ── Layout grid ── */
        .wi-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 16px;
          height: calc(100vh - 148px);
          min-height: 520px;
        }

        /* ── Sidebar ── */
        .wi-sidebar {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 24px;
          display: flex; flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
        }

        .wi-sidebar-head {
          padding: 18px 16px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          flex-shrink: 0;
        }

        .wi-sidebar-label {
          font-size: 10.5px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px;
          color: #a8a29e; margin: 0 0 12px;
        }

        .wi-search-box {
          display: flex; align-items: center; gap: 8px;
          background: #faf7f2;
          border: 1.5px solid rgba(0,0,0,0.07);
          border-radius: 12px; padding: 9px 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .wi-search-box:focus-within {
          border-color: rgba(245,158,11,0.4);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
          background: #fff;
        }

        .wi-search-box svg {
          width: 14px; height: 14px;
          stroke: #a8a29e; fill: none; stroke-width: 2;
          stroke-linecap: round; flex-shrink: 0;
        }

        .wi-search {
          flex: 1; background: transparent; border: none; outline: none;
          font-size: 13px; color: #1c1917;
          font-family: 'DM Sans', sans-serif;
          caret-color: #f59e0b;
        }

        .wi-search::placeholder { color: #c4bfba; }

        /* Conv list */
        .wi-conv-list {
          flex: 1; overflow-y: auto; padding: 10px 10px;
        }

        .wi-conv-list::-webkit-scrollbar { width: 3px; }
        .wi-conv-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.07); border-radius: 99px; }

        .wi-conv-item {
          display: flex; align-items: center; gap: 11px;
          padding: 12px 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 3px;
          border: 1.5px solid transparent;
          position: relative;
        }

        .wi-conv-item:hover { background: #faf7f2; }

        .wi-conv-item.active {
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border-color: rgba(245,158,11,0.25);
          box-shadow: 0 2px 10px rgba(245,158,11,0.1);
        }

        .wi-conv-avatar {
          width: 40px; height: 40px; border-radius: 13px;
          background: linear-gradient(135deg, #e7e5e4, #d6d3d1);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          color: #78716c; flex-shrink: 0;
          border: 1.5px solid rgba(0,0,0,0.06);
          font-family: 'Fraunces', serif;
        }

        .wi-conv-item.active .wi-conv-avatar {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 10px rgba(245,158,11,0.3);
        }

        .wi-conv-body { flex: 1; min-width: 0; }

        .wi-conv-name {
          font-size: 13.5px; font-weight: 600; color: #1c1917;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 3px;
        }

        .wi-conv-preview {
          font-size: 12px; color: #a8a29e;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .wi-conv-meta {
          display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0;
        }

        .wi-conv-time {
          font-size: 10.5px; color: #c4bfba;
          font-family: 'DM Mono', monospace;
        }

        .wi-unread-badge {
          min-width: 20px; height: 20px; padding: 0 6px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 999px; color: #fff;
          font-size: 10.5px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(245,158,11,0.3);
        }

        .wi-empty-list {
          padding: 40px 16px; text-align: center;
          color: #c4bfba; font-size: 13px;
        }

        /* ── Chat pane ── */
        .wi-chat {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 24px;
          display: flex; flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
        }

        /* Topbar */
        .wi-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 22px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          background: #fff;
          flex-shrink: 0;
        }

        .wi-topbar-user { display: flex; align-items: center; gap: 12px; }

        .wi-topbar-avatar {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          font-family: 'Fraunces', serif;
          box-shadow: 0 4px 10px rgba(245,158,11,0.25);
        }

        .wi-topbar-name {
          font-size: 15px; font-weight: 600; color: #1c1917;
          font-family: 'Fraunces', serif; margin-bottom: 2px;
        }

        .wi-topbar-role { font-size: 11.5px; color: #a8a29e; }

        .wi-topbar-badges { display: flex; gap: 8px; }

        .wi-badge {
          font-size: 11px; font-weight: 600;
          padding: 5px 11px; border-radius: 999px; letter-spacing: 0.2px;
        }

        .wi-badge-admin {
          background: #fef3c7; color: #d97706;
          border: 1px solid rgba(245,158,11,0.2);
        }

        .wi-badge-live {
          background: #f0fdf4; color: #16a34a;
          border: 1px solid rgba(34,197,94,0.2);
        }

        /* Empty chat */
        .wi-chat-empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
        }

        .wi-empty-icon-wrap {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border: 1.5px solid rgba(245,158,11,0.2);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(245,158,11,0.1);
        }

        .wi-empty-icon-wrap svg {
          width: 32px; height: 32px;
          stroke: #f59e0b; fill: none;
          stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round;
        }

        .wi-empty-title {
          font-family: 'Fraunces', serif;
          font-size: 18px; font-weight: 600; color: #78716c; margin: 0;
        }

        .wi-empty-hint { font-size: 13px; color: #c4bfba; margin: 0; text-align: center; }

        /* Messages */
        .wi-messages {
          flex: 1; overflow-y: auto;
          padding: 22px 20px;
          display: flex; flex-direction: column; gap: 2px;
          background: #faf7f2;
        }

        .wi-messages::-webkit-scrollbar { width: 4px; }
        .wi-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.07); border-radius: 99px; }

        /* Date divider */
        .wi-date-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 16px 0 10px;
        }

        .wi-date-divider::before, .wi-date-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.07);
        }

        .wi-date-label {
          font-size: 10.5px; font-weight: 600; color: #a8a29e;
          text-transform: uppercase; letter-spacing: 0.7px;
          background: #fff; padding: 3px 10px; border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.06);
        }

        /* Message rows */
        .wi-msg-row {
          display: flex; margin-bottom: 5px;
          animation: msgIn 0.22s ease both;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wi-msg-row.mine { justify-content: flex-end; }
        .wi-msg-row.other { justify-content: flex-start; }

        .wi-bubble-wrap {
          display: flex; flex-direction: column;
          max-width: 68%; gap: 3px;
        }

        .wi-msg-row.mine .wi-bubble-wrap { align-items: flex-end; }
        .wi-msg-row.other .wi-bubble-wrap { align-items: flex-start; }

        .wi-sender-label {
          font-size: 10.5px; font-weight: 600; color: #a8a29e; padding: 0 4px;
        }

        .wi-bubble {
          padding: 11px 15px; border-radius: 20px; word-break: break-word;
        }

        /* Admin = warm amber gradient */
        .wi-bubble.mine {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          border-bottom-right-radius: 5px;
          box-shadow: 0 6px 18px rgba(245,158,11,0.22);
        }

        /* Student = white card */
        .wi-bubble.other {
          background: #fff;
          color: #1c1917;
          border: 1px solid rgba(0,0,0,0.07);
          border-bottom-left-radius: 5px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.06);
        }

        .wi-time {
          font-size: 10px; color: #c4bfba; padding: 0 4px;
          font-family: 'DM Mono', monospace;
        }

        .wi-seen { font-size: 10px; color: #a8a29e; padding: 0 4px; }

        /* Input area */
        .wi-input-area {
          padding: 13px 16px;
          border-top: 1px solid rgba(0,0,0,0.05);
          background: #fff;
          display: flex; align-items: center; gap: 9px;
          flex-shrink: 0;
        }

        .wi-icon-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: #faf7f2;
          border: 1.5px solid rgba(0,0,0,0.08);
          color: #78716c; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: all 0.15s;
        }

        .wi-icon-btn:hover {
          background: #fef3c7; border-color: rgba(245,158,11,0.3);
          transform: translateY(-1px);
        }

        /* Recording bar */
        .wi-rec-bar {
          flex: 1; display: flex; align-items: center; gap: 10px;
          background: #fff5f5; border: 1.5px solid rgba(239,68,68,0.2);
          border-radius: 14px; padding: 10px 14px;
        }

        .wi-rec-dot {
          width: 9px; height: 9px; background: #ef4444;
          border-radius: 50%; flex-shrink: 0;
          animation: recBlink 1s ease-in-out infinite;
        }

        @keyframes recBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .wi-rec-time {
          font-size: 13px; font-weight: 600; color: #dc2626;
          font-family: 'DM Mono', monospace; flex: 1;
        }

        .wi-rec-cancel {
          font-size: 11.5px; font-weight: 600; color: #a8a29e;
          cursor: pointer; background: transparent; border: none;
          padding: 2px 6px; border-radius: 6px; transition: color 0.15s;
        }

        .wi-rec-cancel:hover { color: #ef4444; }

        .wi-input-wrap {
          flex: 1; display: flex; align-items: center;
          background: #faf7f2;
          border: 1.5px solid rgba(0,0,0,0.08);
          border-radius: 14px; padding: 4px 4px 4px 14px;
          transition: all 0.2s;
        }

        .wi-input-wrap:focus-within {
          background: #fff;
          border-color: rgba(245,158,11,0.4);
          box-shadow: 0 0 0 4px rgba(245,158,11,0.08);
        }

        .wi-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-size: 13.5px; color: #1c1917;
          font-family: 'DM Sans', sans-serif; padding: 8px 0;
          caret-color: #f59e0b;
        }

        .wi-input::placeholder { color: #c4bfba; }
        .wi-input:disabled { opacity: 0.4; cursor: not-allowed; }

        .wi-send-btn {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(245,158,11,0.3);
          transition: all 0.15s;
        }

        .wi-send-btn svg {
          width: 15px; height: 15px;
          stroke: #fff; fill: none;
          stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        .wi-send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(245,158,11,0.4);
        }

        .wi-send-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

        .wi-stop-btn {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 15px; color: #fff;
          box-shadow: 0 4px 14px rgba(239,68,68,0.25);
          transition: transform 0.15s;
        }

        .wi-stop-btn:hover { transform: translateY(-1px); }

        .wi-hint {
          padding: 0 18px 12px; font-size: 11px; color: #c4bfba; flex-shrink: 0;
        }

        .wi-hint kbd {
          background: #faf7f2; border: 1px solid rgba(0,0,0,0.09);
          border-bottom-width: 2px; color: #a8a29e;
          padding: 2px 6px; border-radius: 5px;
          font-size: 10px; font-family: 'DM Mono', monospace;
        }

        /* Lightbox */
        .wi-lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(28,25,23,0.8);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 24px;
          animation: msgIn 0.2s ease;
        }

        .wi-lightbox img {
          max-width: 88vw; max-height: 85vh;
          border-radius: 18px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
        }

        .wi-lightbox-close {
          position: absolute; top: 20px; right: 20px;
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%; color: #fff; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }

        .wi-lightbox-close:hover { background: rgba(255,255,255,0.25); }

        @media (max-width: 960px) {
          .wi-grid { grid-template-columns: 1fr; height: auto; }
          .wi-sidebar { min-height: 260px; }
          .wi-chat { min-height: 540px; }
        }
      `}</style>

      {/* Lightbox */}
      {previewImage && (
        <div className="wi-lightbox" onClick={() => setPreviewImage(null)}>
          <div className="wi-lightbox-close" onClick={() => setPreviewImage(null)}>✕</div>
          <img src={previewImage} alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="wi wi-page">
        {/* Header */}
        <div className="wi-header">
          <div className="wi-header-left">
            <div className="wi-logo">
              <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="wi-title">Warden Inbox</h1>
              <p className="wi-sub">Manage hostel support conversations</p>
            </div>
          </div>
          <div className="wi-header-right">
            <div className="wi-stat-chip">
              <span className="dot" />
              {conversations.length} active
            </div>
            {totalUnread > 0 && (
              <div className="wi-unread-chip">
                📬 {totalUnread} unread
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="wi-grid">

          {/* ── Sidebar ── */}
          <div className="wi-sidebar">
            <div className="wi-sidebar-head">
              <p className="wi-sidebar-label">Conversations</p>
              <div className="wi-search-box">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/>
                  <line x1="20" y1="20" x2="16.6" y2="16.6"/>
                </svg>
                <input
                  className="wi-search"
                  placeholder="Search students…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="wi-conv-list">
              {filtered.length === 0 ? (
                <div className="wi-empty-list">No conversations found.</div>
              ) : (
                filtered.map((c) => (
                  <div
                    key={c._id}
                    className={`wi-conv-item ${selected === c.conversationId ? "active" : ""}`}
                    onClick={() => openConversation(c)}
                  >
                    <div className="wi-conv-avatar">
                      {getInitials(c.sender?.name || "Student")}
                    </div>
                    <div className="wi-conv-body">
                      <div className="wi-conv-name">{c.sender?.name || "Student"}</div>
                      <div className="wi-conv-preview">{c.text || "No messages yet"}</div>
                    </div>
                    <div className="wi-conv-meta">
                      <span className="wi-conv-time">{formatTime(c.createdAt)}</span>
                      {c.unreadCount > 0 && (
                        <div className="wi-unread-badge">
                          {c.unreadCount > 9 ? "9+" : c.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Chat pane ── */}
          <div className="wi-chat">
            {!selected ? (
              <>
                <div className="wi-topbar">
                  <span style={{ fontSize: 13, color: "#a8a29e", fontWeight: 500 }}>
                    No conversation selected
                  </span>
                  <div className="wi-topbar-badges">
                    <span className="wi-badge wi-badge-admin">Admin View</span>
                  </div>
                </div>
                <div className="wi-chat-empty-state">
                  <div className="wi-empty-icon-wrap">
                    <svg viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <p className="wi-empty-title">Select a conversation</p>
                  <p className="wi-empty-hint">Pick a student from the left panel to view their messages.</p>
                </div>
              </>
            ) : (
              <>
                {/* Topbar */}
                <div className="wi-topbar">
                  <div className="wi-topbar-user">
                    <div className="wi-topbar-avatar">
                      {getInitials(selectedConv?.sender?.name || "S")}
                    </div>
                    <div>
                      <div className="wi-topbar-name">{selectedConv?.sender?.name || "Student"}</div>
                      <div className="wi-topbar-role">Student · Hostel Resident</div>
                    </div>
                  </div>
                  <div className="wi-topbar-badges">
                    <span className="wi-badge wi-badge-admin">Admin View</span>
                    <span className="wi-badge wi-badge-live">● Live</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="wi-messages">
                  {messages.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontSize: 13, color: "#c4bfba" }}>No messages in this conversation yet.</p>
                    </div>
                  ) : (
                    (() => {
                      // Group by date
                      const groups = messages.reduce((acc, msg) => {
                        const key = msg.createdAt
                          ? new Date(msg.createdAt).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
                          : "Today";
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(msg);
                        return acc;
                      }, {});

                      return Object.entries(groups).map(([dateKey, dayMsgs]) => (
                        <div key={dateKey}>
                          <div className="wi-date-divider">
                            <span className="wi-date-label">{dateKey}</span>
                          </div>
                          {dayMsgs.map((msg) => {
                            const mine = msg.sender?.role === "admin";
                            return (
                              <div
                                key={msg._id || Math.random()}
                                className={`wi-msg-row ${mine ? "mine" : "other"}`}
                              >
                                <div className="wi-bubble-wrap">
                                  <span className="wi-sender-label">
                                    {msg.sender?.name || (mine ? "Warden" : "Student")}
                                  </span>
                                  <div className={`wi-bubble ${mine ? "mine" : "other"}`}>
                                    {renderMessageContent(msg, mine)}
                                  </div>
                                  <span className="wi-time">{formatTime(msg.createdAt)}</span>
                                  {mine && (
                                    <span className="wi-seen">
                                      {msg.isRead ? "✓✓ Seen" : "✓ Delivered"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input area */}
                <div className="wi-input-area">
                  {!recording ? (
                    <>
                      <label className="wi-icon-btn" title="Upload file or image">
                        📎
                        <input
                          type="file"
                          accept="image/*,application/pdf,.doc,.docx,.txt"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileUpload(e.target.files?.[0])}
                        />
                      </label>

                      <button
                        className="wi-icon-btn"
                        onClick={startRecording}
                        title="Record voice message"
                      >
                        🎤
                      </button>

                      <div className="wi-input-wrap">
                        <input
                          ref={inputRef}
                          className="wi-input"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Reply to student…"
                          disabled={!selected}
                        />
                      </div>

                      <button
                        className="wi-send-btn"
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        title="Send reply"
                      >
                        <svg viewBox="0 0 24 24">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="wi-rec-bar">
                        <div className="wi-rec-dot" />
                        <span className="wi-rec-time">
                          🎙 {formatRecordingTime(recordingSeconds)}
                        </span>
                        <button className="wi-rec-cancel" onClick={cancelRecording}>
                          Cancel
                        </button>
                      </div>
                      <button
                        className="wi-stop-btn"
                        onClick={stopRecording}
                        title="Stop & send"
                      >
                        ✓
                      </button>
                    </>
                  )}
                </div>

                <div className="wi-hint">
                  Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WardenInbox;