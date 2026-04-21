import Layout from "../../components/Layout";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, { autoConnect: true });

function WardenSupport() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping] = useState(false);
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
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name") || "Student";

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/warden-messages/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msgs = Array.isArray(res.data) ? res.data : [];
      // DEBUG: log message structure to confirm field names
      if (msgs.length > 0) {
        console.log("[WardenSupport] Sample message fields:", JSON.stringify(msgs[msgs.length - 1], null, 2));
      }
      setMessages(msgs);
    } catch (err) {
      showToast("Failed to load support messages", "error");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const conversationId = `student_${userId || "me"}_admin`;
    socket.emit("join_conversation", conversationId);
    socket.on("receive_message", (message) => {
      console.log("[WardenSupport] Socket message received:", JSON.stringify(message, null, 2));
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `${API}/warden-messages`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("send_message", newMessage);
      setText("");
      inputRef.current?.focus();
    } catch (err) {
      showToast("Failed to send message", "error");
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (text.trim()) formData.append("text", text);
      const res = await axios.post(`${API}/warden-messages/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("send_message", newMessage);
      setText("");
    } catch (err) {
      showToast("Failed to upload file", "error");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick best supported mimeType
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      recordingStartRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        clearInterval(recordingTimerRef.current);
        setRecordingSeconds(0);

        const durationSeconds = recordingStartRef.current
          ? Math.round((Date.now() - recordingStartRef.current) / 1000)
          : 0;

        const ext = mimeType.includes("ogg") ? "ogg" : "webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.${ext}`, {
          type: mimeType,
        });

        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("duration", durationSeconds);

        try {
          const res = await axios.post(`${API}/warden-messages/upload`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          const newMessage = res.data;
          setMessages((prev) => [...prev, newMessage]);
          socket.emit("send_message", newMessage);
          showToast("Voice message sent!", "success");
        } catch (err) {
          showToast("Failed to send voice message", "error");
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // collect data every 250ms to ensure chunks
      setRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
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
      // Override onstop to do nothing (cancel)
      mediaRecorderRef.current.onstop = () => {};
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    showToast("Recording cancelled", "error");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatRecordingTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = msg.createdAt
      ? new Date(msg.createdAt).toLocaleDateString([], {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      : "Today";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
    return groups;
  }, {});

  const getMediaUrl = (msg) => {
    // From console log: backend returns fileUrl for images/files, voiceUrl for voice
    // voiceUrl is "" (empty string) for non-voice messages — must check truthiness
    const raw =
      (msg.voiceUrl && msg.voiceUrl.trim()) ||
      (msg.fileUrl && msg.fileUrl.trim()) ||
      (msg.imageUrl && msg.imageUrl.trim()) ||
      (msg.mediaUrl && msg.mediaUrl.trim()) ||
      (msg.url && msg.url.trim()) ||
      "";
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const cleaned = raw.replace(/^\/+/, "").replace(/\\/g, "/");
    return `http://localhost:5000/${cleaned}`;
  };

  const getAudioMimeType = (url = "") => {
    if (url.includes(".ogg")) return "audio/ogg";
    if (url.includes(".mp3")) return "audio/mpeg";
    if (url.includes(".m4a")) return "audio/mp4";
    return "audio/webm";
  };

  // Custom themed audio player component
  const AudioPlayer = ({ url, duration, isMine }) => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(duration || 0);
    const [error, setError] = useState(false);

    const togglePlay = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        audio.pause();
      } else {
        audio.play().catch(() => setError(true));
      }
    };

    const formatSecs = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    if (error) {
      return (
        <div style={{ fontSize: 12, opacity: 0.6, display: "flex", alignItems: "center", gap: 6 }}>
          ⚠️ Audio unavailable
          <a href={url} target="_blank" rel="noreferrer" style={{ color: "inherit", fontSize: 11 }}>
            Download
          </a>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 200 }}>
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

        {/* Play/pause button */}
        <button
          onClick={togglePlay}
          style={{
            width: 34, height: 34, borderRadius: "50%", border: "none",
            background: isMine ? "rgba(255,255,255,0.25)" : "rgba(14,165,233,0.15)",
            color: isMine ? "#fff" : "#0ea5e9",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, fontSize: 13,
            transition: "background 0.15s",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>

        {/* Waveform / progress bar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              height: 4, borderRadius: 99,
              background: isMine ? "rgba(255,255,255,0.2)" : "rgba(14,165,233,0.15)",
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const audio = audioRef.current;
              if (audio && audio.duration) {
                audio.currentTime = pct * audio.duration;
              }
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: isMine ? "rgba(255,255,255,0.7)" : "#0ea5e9",
                borderRadius: 99,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div style={{ fontSize: 10, opacity: 0.65, fontFamily: "'DM Mono', monospace" }}>
            {playing ? formatSecs(currentTime) : "🎙"} · {formatSecs(totalDuration)}
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (msg) => {
    const url = getMediaUrl(msg);
    const type = msg.messageType || msg.type || "";

    if (type === "image" && url) {
      return (
        <div>
          {msg.text && <div style={{ marginBottom: 8, fontSize: 13 }}>{msg.text}</div>}
          <img
            src={url}
            alt={msg.fileName || "image"}
            style={{
              maxWidth: 240, width: "100%",
              borderRadius: 14, display: "block",
              objectFit: "cover", cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
            onClick={() => setPreviewImage(url)}
            onLoad={(e) => { e.target.style.display = "block"; }}
            onError={(e) => {
              console.error("Image load failed:", url);
              e.target.outerHTML = `<div style="padding:8px;font-size:12px;opacity:0.6">⚠️ Image failed · <a href="${url}" target="_blank" style="color:inherit">Open link</a></div>`;
            }}
          />
        </div>
      );
    }

    if (type === "file" && url) {
      return (
        <div>
          {msg.text && <div style={{ marginBottom: 8, fontSize: 13 }}>{msg.text}</div>}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: "inherit", textDecoration: "none",
              background: "rgba(255,255,255,0.15)", padding: "6px 12px",
              borderRadius: 8, fontSize: 12.5,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            📎 {msg.fileName || "Download file"}
          </a>
        </div>
      );
    }

    if (type === "voice" && url) {
      const isMine = msg.sender?.name === name || msg.sender?.role === "student";
      return (
        <div>
          {msg.text && <div style={{ marginBottom: 8, fontSize: 13 }}>{msg.text}</div>}
          <AudioPlayer url={url} duration={msg.duration} isMine={isMine} />
        </div>
      );
    }

    // Fallback: if URL exists but type not matched, try to render smartly
    if (url) {
      const lower = url.toLowerCase();
      if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) {
        return (
          <img
            src={url}
            alt="attachment"
            style={{ maxWidth: 240, borderRadius: 14, display: "block", cursor: "pointer" }}
            onClick={() => setPreviewImage(url)}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        );
      }
      if (/\.(webm|ogg|mp3|m4a|wav)/.test(lower)) {
        const isMine = msg.sender?.name === name || msg.sender?.role === "student";
        return <AudioPlayer url={url} duration={msg.duration} isMine={isMine} />;
      }
    }

    return <span style={{ fontSize: 13.5, lineHeight: 1.55 }}>{msg.text}</span>;
  };

  return (
    <Layout role="student">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .ws-page * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }

        .ws-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 35%, #fdf4ff 70%, #fff7ed 100%);
          padding: 24px 20px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background orbs */
        .ws-page::before {
          content: '';
          position: fixed;
          top: -120px; left: -120px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(56,189,183,0.18) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .ws-page::after {
          content: '';
          position: fixed;
          bottom: -100px; right: -100px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .ws-content { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; }

        /* Header */
        .ws-header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 20px;
        }

        .ws-avatar {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #0ea5e9, #38bdb7);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(14,165,233,0.3), 0 0 0 1px rgba(255,255,255,0.6) inset;
          flex-shrink: 0;
        }

        .ws-avatar svg {
          width: 24px; height: 24px;
          stroke: #fff; fill: none;
          stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        .ws-title {
          font-size: 22px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.5px; margin: 0 0 3px;
        }

        .ws-sub {
          font-size: 12.5px; color: #64748b; margin: 0;
          display: flex; align-items: center; gap: 6px;
        }

        .ws-status-dot {
          width: 7px; height: 7px;
          background: #22c55e; border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.25);
          animation: pulse-green 2s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.25); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,0.1); }
        }

        /* Glass shell */
        .ws-chat-shell {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 28px;
          overflow: hidden;
          height: calc(100vh - 160px);
          min-height: 500px;
          display: flex; flex-direction: column;
          box-shadow:
            0 32px 80px rgba(0,0,0,0.08),
            0 8px 24px rgba(0,0,0,0.05),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Topbar */
        .ws-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.6);
          flex-shrink: 0;
        }

        .ws-warden-pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 999px;
          padding: 6px 14px 6px 8px;
        }

        .ws-warden-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #0ea5e9, #38bdb7);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          box-shadow: 0 4px 10px rgba(14,165,233,0.3);
        }

        .ws-warden-name { font-size: 13px; font-weight: 600; color: #0f172a; }

        .ws-topbar-badges { display: flex; align-items: center; gap: 8px; }

        .ws-badge {
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 999px;
          letter-spacing: 0.3px;
        }

        .ws-badge-secure {
          background: rgba(168,85,247,0.1); color: #7c3aed;
          border: 1px solid rgba(168,85,247,0.2);
        }

        .ws-badge-live {
          background: rgba(34,197,94,0.1); color: #16a34a;
          border: 1px solid rgba(34,197,94,0.2);
        }

        /* Messages */
        .ws-messages {
          flex: 1; overflow-y: auto;
          padding: 20px;
          display: flex; flex-direction: column; gap: 2px;
        }

        .ws-messages::-webkit-scrollbar { width: 4px; }
        .ws-messages::-webkit-scrollbar-track { background: transparent; }
        .ws-messages::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.08); border-radius: 99px;
        }

        /* Date divider */
        .ws-date-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 16px 0 10px;
        }

        .ws-date-divider::before, .ws-date-divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(0,0,0,0.07);
        }

        .ws-date-label {
          font-size: 10.5px; font-weight: 600; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.8px;
          background: rgba(255,255,255,0.7);
          padding: 3px 10px; border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.06);
        }

        /* Message rows */
        .ws-msg-row {
          display: flex; margin-bottom: 4px;
          animation: fadeUp 0.22s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ws-msg-row.mine { justify-content: flex-end; }
        .ws-msg-row.other { justify-content: flex-start; }

        .ws-bubble-wrap {
          display: flex; flex-direction: column;
          max-width: 70%; gap: 3px;
        }

        .ws-msg-row.mine .ws-bubble-wrap { align-items: flex-end; }
        .ws-msg-row.other .ws-bubble-wrap { align-items: flex-start; }

        .ws-sender {
          font-size: 10.5px; font-weight: 600;
          color: #94a3b8; padding: 0 4px;
        }

        /* Bubbles */
        .ws-bubble {
          padding: 10px 14px; border-radius: 20px;
          word-break: break-word; position: relative;
        }

        .ws-bubble.mine {
          background: linear-gradient(135deg, #0ea5e9 0%, #38bdb7 100%);
          color: #fff;
          border-bottom-right-radius: 5px;
          box-shadow: 0 6px 20px rgba(14,165,233,0.25);
        }

        .ws-bubble.other {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          color: #1e293b;
          border: 1px solid rgba(255,255,255,0.9);
          border-bottom-left-radius: 5px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.07);
        }

        .ws-time {
          font-size: 10px; color: #94a3b8; padding: 0 4px;
          font-family: 'DM Mono', monospace;
        }

        /* Empty state */
        .ws-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 14px; padding-bottom: 30px;
        }

        .ws-empty-icon {
          width: 64px; height: 64px;
          background: rgba(14,165,233,0.08);
          border: 1.5px solid rgba(14,165,233,0.2);
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(14,165,233,0.1);
        }

        .ws-empty-icon svg {
          width: 28px; height: 28px;
          stroke: #0ea5e9; fill: none;
          stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
        }

        .ws-empty-title { font-size: 15px; font-weight: 600; color: #475569; margin: 0; }
        .ws-empty-hint { font-size: 13px; color: #94a3b8; margin: 0; text-align: center; }

        /* Typing indicator */
        .ws-typing {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 4px 8px;
          animation: fadeUp 0.2s ease both;
        }

        .ws-typing-bubble {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 18px; border-bottom-left-radius: 5px;
          padding: 10px 14px;
          display: flex; gap: 4px; align-items: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.07);
        }

        .ws-typing-bubble span {
          width: 6px; height: 6px; border-radius: 50%;
          background: #94a3b8;
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .ws-typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
        .ws-typing-bubble span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* Input area */
        .ws-input-area {
          padding: 12px 14px;
          border-top: 1px solid rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }

        /* Recording bar */
        .ws-recording-bar {
          flex: 1;
          display: flex; align-items: center; gap: 10px;
          background: rgba(239,68,68,0.07);
          border: 1.5px solid rgba(239,68,68,0.25);
          border-radius: 14px;
          padding: 10px 14px;
        }

        .ws-rec-dot {
          width: 10px; height: 10px;
          background: #ef4444; border-radius: 50%;
          animation: recPulse 1s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes recPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .ws-rec-time {
          font-size: 13px; font-weight: 600; color: #ef4444;
          font-family: 'DM Mono', monospace; flex: 1;
        }

        .ws-rec-cancel {
          font-size: 11.5px; font-weight: 600; color: #94a3b8;
          cursor: pointer; padding: 2px 8px;
          border-radius: 6px; border: none; background: transparent;
          transition: color 0.15s;
        }

        .ws-rec-cancel:hover { color: #ef4444; }

        .ws-icon-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          color: #64748b; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: all 0.15s;
        }

        .ws-icon-btn:hover {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .ws-icon-btn.recording {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #ef4444;
        }

        .ws-input-wrap {
          flex: 1; display: flex; align-items: center;
          background: rgba(255,255,255,0.7);
          border: 1.5px solid rgba(255,255,255,0.9);
          border-radius: 14px;
          padding: 4px 4px 4px 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .ws-input-wrap:focus-within {
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 0 0 4px rgba(14,165,233,0.08), 0 2px 8px rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.9);
        }

        .ws-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-size: 13.5px; color: #1e293b;
          font-family: 'Outfit', sans-serif; padding: 8px 0;
          caret-color: #0ea5e9;
        }

        .ws-input::placeholder { color: #b0bec5; }

        .ws-send-btn {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #0ea5e9, #38bdb7);
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(14,165,233,0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .ws-send-btn svg {
          width: 15px; height: 15px;
          stroke: #fff; fill: none;
          stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        .ws-send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(14,165,233,0.4);
        }

        .ws-send-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

        /* Stop send button for voice */
        .ws-stop-btn {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(239,68,68,0.3);
          font-size: 14px; color: #fff;
          transition: transform 0.15s;
        }

        .ws-stop-btn:hover { transform: translateY(-1px); }

        /* Hint */
        .ws-hint {
          padding: 0 16px 12px;
          font-size: 11px; color: #b0bec5; flex-shrink: 0;
        }

        .ws-hint kbd {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(0,0,0,0.1);
          border-bottom-width: 2px;
          color: #94a3b8; padding: 2px 6px;
          border-radius: 5px; font-size: 10px;
          font-family: 'DM Mono', monospace;
        }

        /* Image lightbox */
        .ws-lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeUp 0.2s ease;
        }

        .ws-lightbox img {
          max-width: 90vw; max-height: 85vh;
          border-radius: 16px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }

        .ws-lightbox-close {
          position: absolute; top: 20px; right: 20px;
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50%; color: #fff; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }

        .ws-lightbox-close:hover { background: rgba(255,255,255,0.25); }

        /* Orb decorations */
        .ws-orb1 {
          position: fixed; top: 20%; right: 8%;
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(56,189,183,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }

        .ws-orb2 {
          position: fixed; top: 55%; left: 5%;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(249,168,212,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }
      `}</style>

      {/* Image lightbox */}
      {previewImage && (
        <div className="ws-lightbox" onClick={() => setPreviewImage(null)}>
          <div className="ws-lightbox-close" onClick={() => setPreviewImage(null)}>✕</div>
          <img src={previewImage} alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="ws-page">
        <div className="ws-orb1" />
        <div className="ws-orb2" />

        <div className="ws-content">
          {/* Header */}
          <div className="ws-header">
            <div className="ws-avatar">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
                <path d="M12 14c-6 0-8 3-8 4v1h16v-1c0-1-2-4-8-4z" />
              </svg>
            </div>
            <div>
              <h1 className="ws-title">Warden Support</h1>
              <p className="ws-sub">
                <span className="ws-status-dot" />
                Warden is online · Real-time chat
              </p>
            </div>
          </div>

          {/* Chat shell */}
          <div className="ws-chat-shell">
            {/* Topbar */}
            <div className="ws-topbar">
              <div className="ws-warden-pill">
                <div className="ws-warden-icon">W</div>
                <span className="ws-warden-name">Hostel Warden</span>
              </div>
              <div className="ws-topbar-badges">
                <span className="ws-badge ws-badge-secure">🔒 Secure</span>
                <span className="ws-badge ws-badge-live">● Live</span>
              </div>
            </div>

            {/* Messages */}
            <div className="ws-messages">
              {messages.length === 0 ? (
                <div className="ws-empty">
                  <div className="ws-empty-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="ws-empty-title">No messages yet</p>
                  <p className="ws-empty-hint">Send a message to start chatting with the warden.</p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([dateKey, dayMsgs]) => (
                  <div key={dateKey}>
                    <div className="ws-date-divider">
                      <span className="ws-date-label">{dateKey}</span>
                    </div>
                    {dayMsgs.map((msg) => {
                      const mine =
                        msg.sender?.name === name || msg.sender?.role === "student";
                      return (
                        <div
                          key={msg._id || Math.random()}
                          className={`ws-msg-row ${mine ? "mine" : "other"}`}
                        >
                          <div className="ws-bubble-wrap">
                            <span className="ws-sender">
                              {msg.sender?.name || (mine ? "You" : "Warden")}
                            </span>
                            <div className={`ws-bubble ${mine ? "mine" : "other"}`}>
                              {renderMessageContent(msg)}
                            </div>
                            <span className="ws-time">{formatTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}

              {isTyping && (
                <div className="ws-typing">
                  <div className="ws-bubble-wrap">
                    <span className="ws-sender">Warden</span>
                    <div className="ws-typing-bubble">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="ws-input-area">
              {!recording ? (
                <>
                  <label className="ws-icon-btn" title="Upload file or image">
                    📎
                    <input
                      type="file"
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    />
                  </label>

                  <button
                    className="ws-icon-btn"
                    onClick={startRecording}
                    title="Record voice message"
                  >
                    🎤
                  </button>

                  <div className="ws-input-wrap">
                    <input
                      ref={inputRef}
                      className="ws-input"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message the warden…"
                    />
                  </div>

                  <button
                    className="ws-send-btn"
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    title="Send message"
                  >
                    <svg viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <div className="ws-recording-bar">
                    <div className="ws-rec-dot" />
                    <span className="ws-rec-time">
                      🎙 Recording… {formatRecordingTime(recordingSeconds)}
                    </span>
                    <button className="ws-rec-cancel" onClick={cancelRecording}>
                      Cancel
                    </button>
                  </div>
                  <button
                    className="ws-stop-btn"
                    onClick={stopRecording}
                    title="Stop & send voice message"
                  >
                    ✓
                  </button>
                </>
              )}
            </div>

            <div className="ws-hint">
              Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WardenSupport;