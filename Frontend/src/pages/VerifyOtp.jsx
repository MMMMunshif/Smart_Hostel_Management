import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .otp-page {
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f6f8fb;
    padding: 20px;
  }

  .otp-card {
    width: 100%;
    max-width: 430px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 22px;
    padding: 28px;
    box-shadow: 0 12px 28px rgba(17,24,39,.06);
  }

  .otp-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 8px;
  }

  .otp-sub {
    font-size: .9rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 22px;
  }

  .otp-email {
    font-weight: 700;
    color: #00a7a0;
  }

  .otp-input {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid #d1d5db;
    border-radius: 14px;
    font-size: 1rem;
    margin-bottom: 14px;
    outline: none;
    text-align: center;
    letter-spacing: 6px;
    font-weight: 700;
  }

  .otp-input:focus {
    border-color: #00d4c8;
    box-shadow: 0 0 0 3px rgba(0,212,200,0.10);
  }

  .otp-btn {
    width: 100%;
    border: none;
    border-radius: 14px;
    padding: 13px 16px;
    background: #111827;
    color: #fff;
    font-size: .95rem;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 12px;
  }

  .otp-btn:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .otp-btn-secondary {
    width: 100%;
    border: none;
    border-radius: 14px;
    padding: 13px 16px;
    background: #58e4de;
    color: #0f3d3c;
    font-size: .95rem;
    font-weight: 700;
    cursor: pointer;
  }

  .otp-msg {
    margin-top: 14px;
    font-size: .9rem;
    text-align: center;
    font-weight: 600;
  }

  .otp-success { color: #059669; }
  .otp-error { color: #dc2626; }
  .otp-info { color: #6b7280; }

  .otp-back {
    margin-top: 16px;
    text-align: center;
    font-size: .88rem;
    color: #00a7a0;
    cursor: pointer;
    font-weight: 600;
  }
`;

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (!email || !otp) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "OTP verification failed.");
        return;
      }

      setSuccess(data.message || "Email verified successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      const res = await fetch(`${API}/users/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to resend OTP.");
        return;
      }

      setSuccess(data.message || "OTP resent successfully.");
      setCountdown(60);
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="otp-page">
        <div className="otp-card">
          <div className="otp-title">Verify your email</div>
          <div className="otp-sub">
            We sent a 6-digit OTP to <span className="otp-email">{email}</span>
          </div>

          <input
            className="otp-input"
            type="text"
            placeholder="------"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          />

          <button className="otp-btn" onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {countdown > 0 ? (
            <div className="otp-msg otp-info">Resend available in {countdown}s</div>
          ) : (
            <button
              className="otp-btn-secondary"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}

          {success ? <div className="otp-msg otp-success">{success}</div> : null}
          {error ? <div className="otp-msg otp-error">{error}</div> : null}

          <div className="otp-back" onClick={() => navigate("/login")}>
            Back to login
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;