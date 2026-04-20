import Layout from "../../components/Layout";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";



const API = "http://localhost:5000/api";

const COLORS = ["#58e4de", "#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6", "#10b981"];

function normalize(v = "") {
  return v.toString().toLowerCase().trim();
}

function timeAgo(dateStr) {
  if (!dateStr) return "Now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function statusPill(status = "") {
  const s = normalize(status);
  if (s === "resolved" || s === "approved" || s === "paid") return "pill-resolved";
  if (s === "rejected") return "pill-rejected";
  if (s === "in progress" || s === "submitted") return "pill-progress";
  return "pill-pending";
}

function monthLabel(monthStr = "") {
  if (!monthStr || !monthStr.includes("-")) return monthStr || "N/A";
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString([], { month: "short", year: "numeric" });
}

function AdminAnalytics() {
  const { showToast } = useToast();
  const reportRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [notices, setNotices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentAnalytics, setPaymentAnalytics] = useState(null);
  const [overduePayments, setOverduePayments] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [
        studentsRes,
        roomsRes,
        requestsRes,
        complaintsRes,
        leavesRes,
        visitorsRes,
        noticesRes,
        paymentsRes,
        paymentAnalyticsRes,
        overduePaymentsRes,
      ] = await Promise.all([
        axios.get(`${API}/users`, { headers }),
        axios.get(`${API}/rooms`, { headers }),
        axios.get(`${API}/requests`, { headers }),
        axios.get(`${API}/complaints`, { headers }),
        axios.get(`${API}/leaves`, { headers }),
        axios.get(`${API}/visitors`, { headers }),
        axios.get(`${API}/notices/admin`, { headers }),
        axios.get(`${API}/payments`, { headers }),
        axios.get(`${API}/payment-analytics`, { headers }),
        axios.get(`${API}/payment-analytics/overdue`, { headers }),
      ]);

      setStudents(
        (Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data.users || []).filter(
          (u) => u.role === "student"
        )
      );
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms || []);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : requestsRes.data.requests || []);
      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : complaintsRes.data.complaints || []);
      setLeaves(Array.isArray(leavesRes.data) ? leavesRes.data : leavesRes.data.leaves || []);
      setVisitors(Array.isArray(visitorsRes.data) ? visitorsRes.data : visitorsRes.data.visitors || []);
      setNotices(Array.isArray(noticesRes.data) ? noticesRes.data : noticesRes.data.notices || []);
      setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
      setPaymentAnalytics(paymentAnalyticsRes.data || null);
      setOverduePayments(Array.isArray(overduePaymentsRes.data) ? overduePaymentsRes.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load analytics", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

 const handleDownloadReport = () => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  const now = new Date();

  // helpers
  const addSectionTitle = (title, y) => {
    doc.setFillColor(88, 228, 222);
    doc.roundedRect(14, y - 6, pageWidth - 28, 10, 2, 2, "F");
    doc.setTextColor(15, 61, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, 18, y);
    doc.setTextColor(17, 24, 39);
  };

  const addStatBox = (x, y, w, h, title, value, sub = "") => {
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(title, x + 4, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text(String(value), x + 4, y + 16);

    if (sub) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      const lines = doc.splitTextToSize(sub, w - 8);
      doc.text(lines, x + 4, y + 22);
    }
  };

  // Header
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("Hostel Management Analytics Report", 14, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Administrative Performance & Operations Summary", 14, 21);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${now.toLocaleString()}`, 14, 38);
  doc.text("Prepared from the live admin analytics dashboard", 14, 44);

  // Executive summary
  addSectionTitle("Executive Summary", 56);

  const y1 = 62;
  const boxW = 43;
  const boxH = 24;
  const gap = 4;

  addStatBox(14, y1, boxW, boxH, "Students", metrics.totalStudents, "Registered hostel students");
  addStatBox(14 + boxW + gap, y1, boxW, boxH, "Rooms", metrics.totalRooms, "Total managed rooms");
  addStatBox(14 + (boxW + gap) * 2, y1, boxW, boxH, "Occupancy", `${metrics.occupancyRate}%`, `${metrics.occupiedBeds}/${metrics.totalCapacity} beds used`);
  addStatBox(14 + (boxW + gap) * 3, y1, boxW, boxH, "Open Issues", metrics.openComplaints, "Pending + in progress complaints");

  addStatBox(14, y1 + 28, 56, 24, "Pending Requests", metrics.pendingRequests, "Room requests awaiting review");
  addStatBox(74, y1 + 28, 56, 24, "Revenue", `LKR ${Number(paymentMetrics.totalRevenue || 0).toLocaleString()}`, "Total paid amount collected");
  addStatBox(134, y1 + 28, 56, 24, "Overdue Payments", paymentMetrics.overdue, "Payments requiring follow-up");

  // Room analytics
  addSectionTitle("Room Analytics", 98);

  autoTable(doc, {
    startY: 103,
    head: [["Metric", "Value"]],
    body: [
      ["Available Rooms", metrics.availableRooms],
      ["Full Rooms", metrics.fullRooms],
      ["Maintenance Rooms", metrics.maintenanceRooms],
      ["Occupancy Rate", `${metrics.occupancyRate}%`],
    ],
    theme: "grid",
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [["Wing", "Occupied", "Capacity", "Occupancy %"]],
    body: occupancyByWing.map((item) => [
      item.wing,
      item.occupied,
      item.capacity,
      `${item.pct}%`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [88, 228, 222], textColor: [15, 61, 60] },
    styles: { fontSize: 10 },
  });

  // Complaint analytics
  addSectionTitle("Complaint Analytics", doc.lastAutoTable.finalY + 14);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 19,
    head: [["Status", "Count"]],
    body: complaintChartData.map((item) => [item.name, item.value]),
    theme: "grid",
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [["Title", "Student", "Status", "When"]],
    body: latestComplaints.map((item) => [
      item.title || "Complaint",
      item.student?.name || "Student",
      item.status || "Pending",
      timeAgo(item.createdAt),
    ]),
    theme: "striped",
    headStyles: { fillColor: [88, 228, 222], textColor: [15, 61, 60] },
    styles: { fontSize: 9 },
  });

  // add page if needed
  doc.addPage();

  // Request analytics
  addSectionTitle("Request Analytics", 20);

  autoTable(doc, {
    startY: 25,
    head: [["Module", "Total"]],
    body: requestChartData.map((item) => [item.name, item.value]),
    theme: "grid",
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [["Student", "Room", "Status", "When"]],
    body: latestRequests.map((item) => [
      item.student?.name || item.user?.name || "Student",
      item.room?.roomNumber || "No room",
      item.status || "Pending",
      timeAgo(item.createdAt),
    ]),
    theme: "striped",
    headStyles: { fillColor: [88, 228, 222], textColor: [15, 61, 60] },
    styles: { fontSize: 9 },
  });

  // Payment analytics
  addSectionTitle("Payment Analytics", doc.lastAutoTable.finalY + 14);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 19,
    head: [["Metric", "Value"]],
    body: [
      ["Total Payments", paymentMetrics.total],
      ["Paid", paymentMetrics.paid],
      ["Submitted", paymentMetrics.submitted],
      ["Overdue", paymentMetrics.overdue],
      ["Total Revenue", `LKR ${Number(paymentMetrics.totalRevenue || 0).toLocaleString()}`],
    ],
    theme: "grid",
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [["Month", "Revenue"]],
    body: paymentMonthlyData.map((item) => [
      item.month,
      `LKR ${Number(item.amount || 0).toLocaleString()}`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [88, 228, 222], textColor: [15, 61, 60] },
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [["Student", "Email", "Month", "Room", "Amount"]],
    body: overduePayments.slice(0, 10).map((item) => [
      item.student?.name || "Student",
      item.student?.email || "No email",
      monthLabel(item.month),
      item.room?.roomNumber || "N/A",
      `LKR ${Number(item.amount || 0).toLocaleString()}`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
  });

  // Notices / footer
  const footerY = doc.lastAutoTable.finalY + 12;
  addSectionTitle("Communication Summary", footerY);

  autoTable(doc, {
    startY: footerY + 5,
    head: [["Item", "Value"]],
    body: [
      ["Active Notices", notices.filter((n) => n.isActive).length],
      ["Recent Payments Listed", latestPayments.length],
      ["Recent Complaints Listed", latestComplaints.length],
      ["Recent Requests Listed", latestRequests.length],
    ],
    theme: "grid",
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 10 },
  });

  // page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Hostel Management Analytics Report  •  Page ${i} of ${pageCount}`,
      14,
      290
    );
  }

  doc.save(`Hostel_Analytics_Report_${now.toISOString().slice(0, 10)}.pdf`);
};

  const metrics = useMemo(() => {
    const totalStudents = students.length;
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => normalize(r.status) === "available").length;
    const fullRooms = rooms.filter((r) => normalize(r.status) === "full").length;
    const maintenanceRooms = rooms.filter((r) => normalize(r.status) === "maintenance").length;
    const pendingRequests = requests.filter((r) => normalize(r.status) === "pending").length;
    const openComplaints = complaints.filter((c) => {
      const s = normalize(c.status);
      return s === "pending" || s === "in progress";
    }).length;

    const totalCapacity = rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);
    const occupiedBeds = rooms.reduce(
      (sum, room) => sum + (Array.isArray(room.occupants) ? room.occupants.length : 0),
      0
    );
    const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

    return {
      totalStudents,
      totalRooms,
      availableRooms,
      fullRooms,
      maintenanceRooms,
      pendingRequests,
      openComplaints,
      occupancyRate,
      occupiedBeds,
      totalCapacity,
    };
  }, [students, rooms, requests, complaints]);

  const roomStatusData = useMemo(
    () => [
      { name: "Available", value: metrics.availableRooms },
      { name: "Full", value: metrics.fullRooms },
      { name: "Maintenance", value: metrics.maintenanceRooms },
    ],
    [metrics]
  );

  const complaintChartData = useMemo(
    () => [
      { name: "Pending", value: complaints.filter((c) => normalize(c.status) === "pending").length },
      { name: "In Progress", value: complaints.filter((c) => normalize(c.status) === "in progress").length },
      { name: "Resolved", value: complaints.filter((c) => normalize(c.status) === "resolved").length },
    ],
    [complaints]
  );

  const requestChartData = useMemo(
    () => [
      { name: "Room", value: requests.length },
      { name: "Leave", value: leaves.length },
      { name: "Visitor", value: visitors.length },
      { name: "Complaints", value: complaints.length },
    ],
    [requests, leaves, visitors, complaints]
  );

  const occupancyByWing = useMemo(() => {
    const wingMap = {};

    rooms.forEach((room) => {
      const wing = room.wing || "Unknown";
      const capacity = Number(room.capacity || 0);
      const occupied = Array.isArray(room.occupants) ? room.occupants.length : 0;

      if (!wingMap[wing]) wingMap[wing] = { capacity: 0, occupied: 0 };
      wingMap[wing].capacity += capacity;
      wingMap[wing].occupied += occupied;
    });

    return Object.entries(wingMap).map(([wing, data]) => ({
      wing,
      occupied: data.occupied,
      capacity: data.capacity,
      pct: data.capacity > 0 ? Math.round((data.occupied / data.capacity) * 100) : 0,
    }));
  }, [rooms]);

  const latestComplaints = useMemo(() => complaints.slice(0, 5), [complaints]);
  const latestRequests = useMemo(() => requests.slice(0, 5), [requests]);

  const paymentStatusData = useMemo(() => {
    if (paymentAnalytics) {
      return [
        { name: "Paid", value: paymentAnalytics.paid || 0 },
        { name: "Submitted", value: paymentAnalytics.submitted || 0 },
        { name: "Overdue", value: paymentAnalytics.overdue || 0 },
      ];
    }

    return [
      { name: "Paid", value: payments.filter((p) => normalize(p.status) === "paid").length },
      { name: "Submitted", value: payments.filter((p) => normalize(p.status) === "submitted").length },
      { name: "Overdue", value: payments.filter((p) => normalize(p.status) === "overdue").length },
    ];
  }, [paymentAnalytics, payments]);

  const paymentMonthlyData = useMemo(() => {
    if (paymentAnalytics?.monthlyData?.length) {
      return paymentAnalytics.monthlyData.map((item) => ({
        month: monthLabel(item.month),
        amount: item.amount,
      }));
    }

    const monthlyMap = {};
    payments.forEach((p) => {
      if (!p.month) return;
      if (!monthlyMap[p.month]) {
        monthlyMap[p.month] = { amount: 0 };
      }
      if (normalize(p.status) === "paid") {
        monthlyMap[p.month].amount += Number(p.amount || 0);
      }
    });

    return Object.entries(monthlyMap).map(([month, value]) => ({
      month: monthLabel(month),
      amount: value.amount,
    }));
  }, [paymentAnalytics, payments]);

  const paymentMetrics = useMemo(() => {
    const total = paymentAnalytics?.total ?? payments.length;
    const paid = paymentAnalytics?.paid ?? payments.filter((p) => normalize(p.status) === "paid").length;
    const submitted =
      paymentAnalytics?.submitted ??
      payments.filter((p) => normalize(p.status) === "submitted").length;
    const overdue =
      paymentAnalytics?.overdue ??
      payments.filter((p) => normalize(p.status) === "overdue").length;
    const totalRevenue =
      paymentAnalytics?.totalRevenue ??
      payments
        .filter((p) => normalize(p.status) === "paid")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return { total, paid, submitted, overdue, totalRevenue };
  }, [paymentAnalytics, payments]);

  const latestPayments = useMemo(() => payments.slice(0, 5), [payments]);

  return (
    <Layout role="admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .aa-root {
          font-family: 'DM Sans', sans-serif;
          background: #f6f8fb;
          min-height: 100vh;
          padding: 28px;
          color: #111827;
        }

        .aa-shell { display: grid; gap: 20px; }

        .aa-hero {
          background: linear-gradient(135deg, #e8fbf8, #eef6ff);
          border: 1px solid #dfeef0;
          border-radius: 26px;
          padding: 26px;
          box-shadow: 0 10px 28px rgba(17,24,39,.04);
        }

        .aa-breadcrumb {
          display: flex;
          gap: 6px;
          align-items: center;
          font-size: .76rem;
          color: #8a94a6;
          margin-bottom: 10px;
        }

        .aa-breadcrumb span {
          color: #00b8ae;
          font-weight: 700;
        }

        .aa-hero-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .aa-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -.03em;
          margin-bottom: 8px;
        }

        .aa-sub {
          font-size: .95rem;
          color: #667085;
          line-height: 1.7;
          max-width: 760px;
        }

        .aa-refresh {
          border: none;
          background: #111827;
          color: #fff;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: .84rem;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
        }

        .aa-top {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .aa-stat {
          background: #fff;
          border: 1px solid #e8edf4;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 10px 26px rgba(17,24,39,.04);
        }

        .aa-stat-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .aa-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #eefaf8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
        }

        .aa-stat-chip {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: .68rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .chip-blue { background: #eff6ff; color: #1d4ed8; }
        .chip-green { background: #ecfdf5; color: #047857; }
        .chip-orange { background: #fff7ed; color: #c2410c; }
        .chip-red { background: #fef2f2; color: #b91c1c; }

        .aa-stat-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 6px;
        }

        .aa-stat-label {
          color: #6b7280;
          font-size: .86rem;
          line-height: 1.5;
        }

        .aa-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 18px;
          align-items: start;
        }

        .aa-card {
          background: #fff;
          border: 1px solid #e8edf4;
          border-radius: 22px;
          box-shadow: 0 10px 26px rgba(17,24,39,.04);
          padding: 20px;
        }

        .aa-card-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .aa-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.02rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .aa-card-sub {
          font-size: .83rem;
          color: #6b7280;
        }

        .aa-bars {
          display: grid;
          gap: 14px;
        }

        .aa-bar-row {
          display: grid;
          gap: 7px;
        }

        .aa-bar-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          font-size: .84rem;
        }

        .aa-bar-name {
          font-weight: 700;
          color: #374151;
        }

        .aa-bar-val {
          color: #6b7280;
          font-weight: 700;
        }

        .aa-track {
          height: 12px;
          background: #eef2f7;
          border-radius: 999px;
          overflow: hidden;
        }

        .aa-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #58e4de, #93c5fd);
        }

        .aa-list {
          display: grid;
          gap: 12px;
        }

        .aa-item {
          border: 1px solid #edf1f7;
          border-radius: 18px;
          padding: 14px;
          background: #fff;
        }

        .aa-item-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .aa-item-title {
          font-weight: 800;
          font-size: .92rem;
          color: #111827;
          margin-bottom: 4px;
        }

        .aa-item-sub {
          font-size: .79rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .aa-pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: .68rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .pill-pending { background: #fff7ed; color: #c2410c; }
        .pill-progress { background: #eff6ff; color: #1d4ed8; }
        .pill-resolved { background: #ecfdf5; color: #047857; }
        .pill-approved { background: #ecfdf5; color: #047857; }
        .pill-rejected { background: #fef2f2; color: #b91c1c; }

        .aa-empty {
          color: #6b7280;
          font-size: .87rem;
          padding: 10px 0;
        }

        .aa-payment-top {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1100px) {
          .aa-top,
          .aa-payment-top { grid-template-columns: repeat(2, 1fr); }
          .aa-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 720px) {
          .aa-root { padding: 16px; }
          .aa-top,
          .aa-payment-top { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="aa-root">
        <div ref={reportRef}>
          <div className="aa-shell">
            <div className="aa-hero">
              <div className="aa-breadcrumb">
                Dashboard › Admin › <span>Analytics</span>
              </div>

              <div className="aa-hero-top">
                <div>
                  <div className="aa-title">Operations Analytics</div>
                  <div className="aa-sub">
                    Track room utilization, request pressure, complaint flow, payment health, and overall hostel performance from one dashboard.
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      fontSize: ".82rem",
                      color: "#6b7280",
                      lineHeight: 1.6,
                    }}
                  >
                    Report Generated: {new Date().toLocaleString()}
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      background: "#ffffff",
                      border: "1px solid #e8edf4",
                      borderRadius: 18,
                      padding: 16,
                      boxShadow: "0 10px 24px rgba(17,24,39,.04)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: "1rem",
                        marginBottom: 8,
                      }}
                    >
                      Executive Summary
                    </div>

                    <div style={{ fontSize: ".86rem", color: "#6b7280", lineHeight: 1.7 }}>
                      This report summarizes hostel operations including occupancy, complaints,
                      room requests, payment performance, overdue alerts, and active notices.
                      Generated directly from the live admin analytics dashboard.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="aa-refresh" onClick={fetchAnalytics}>
                    Refresh Analytics
                  </button>

                  <button
                    className="aa-refresh"
                    onClick={handleDownloadReport}
                    style={{ background: "#58e4de", color: "#0f3d3c" }}
                  >
                    Download Report
                  </button>
                </div>
              </div>
            </div>

            <div className="aa-top">
              <div className="aa-stat">
                <div className="aa-stat-top">
                  <div className="aa-stat-icon">👥</div>
                  <div className="aa-stat-chip chip-blue">Students</div>
                </div>
                <div className="aa-stat-value">{loading ? "—" : metrics.totalStudents}</div>
                <div className="aa-stat-label">Total student accounts in the system</div>
              </div>

              <div className="aa-stat">
                <div className="aa-stat-top">
                  <div className="aa-stat-icon">🛏️</div>
                  <div className="aa-stat-chip chip-green">Occupancy</div>
                </div>
                <div className="aa-stat-value">{loading ? "—" : `${metrics.occupancyRate}%`}</div>
                <div className="aa-stat-label">
                  {loading ? "—" : `${metrics.occupiedBeds}/${metrics.totalCapacity} beds occupied`}
                </div>
              </div>

              <div className="aa-stat">
                <div className="aa-stat-top">
                  <div className="aa-stat-icon">📝</div>
                  <div className="aa-stat-chip chip-orange">Pending</div>
                </div>
                <div className="aa-stat-value">{loading ? "—" : metrics.pendingRequests}</div>
                <div className="aa-stat-label">Pending room requests to review</div>
              </div>

              <div className="aa-stat">
                <div className="aa-stat-top">
                  <div className="aa-stat-icon">⚠️</div>
                  <div className="aa-stat-chip chip-red">Issues</div>
                </div>
                <div className="aa-stat-value">{loading ? "—" : metrics.openComplaints}</div>
                <div className="aa-stat-label">Open complaints needing admin action</div>
              </div>
            </div>

            <div className="aa-card">
              <div className="aa-card-head">
                <div>
                  <div className="aa-card-title">Payment Analytics</div>
                  <div className="aa-card-sub">Revenue, payment status, and overdue monitoring</div>
                </div>
              </div>

              <div className="aa-payment-top">
                <div className="aa-stat">
                  <div className="aa-stat-top">
                    <div className="aa-stat-icon">💳</div>
                    <div className="aa-stat-chip chip-blue">Payments</div>
                  </div>
                  <div className="aa-stat-value">{loading ? "—" : paymentMetrics.total}</div>
                  <div className="aa-stat-label">Total payment records</div>
                </div>

                <div className="aa-stat">
                  <div className="aa-stat-top">
                    <div className="aa-stat-icon">✅</div>
                    <div className="aa-stat-chip chip-green">Paid</div>
                  </div>
                  <div className="aa-stat-value">{loading ? "—" : paymentMetrics.paid}</div>
                  <div className="aa-stat-label">Approved and completed payments</div>
                </div>

                <div className="aa-stat">
                  <div className="aa-stat-top">
                    <div className="aa-stat-icon">📤</div>
                    <div className="aa-stat-chip chip-orange">Submitted</div>
                  </div>
                  <div className="aa-stat-value">{loading ? "—" : paymentMetrics.submitted}</div>
                  <div className="aa-stat-label">Receipts awaiting admin review</div>
                </div>

                <div className="aa-stat">
                  <div className="aa-stat-top">
                    <div className="aa-stat-icon">⏰</div>
                    <div className="aa-stat-chip chip-red">Overdue</div>
                  </div>
                  <div className="aa-stat-value">{loading ? "—" : paymentMetrics.overdue}</div>
                  <div className="aa-stat-label">Payments past due date</div>
                </div>
              </div>

              <div style={{ height: 18 }} />

              <div className="aa-item">
                <div className="aa-item-title">
                  Total Collected Revenue: LKR {Number(paymentMetrics.totalRevenue || 0).toLocaleString()}
                </div>
                <div className="aa-item-sub">
                  Sum of all payments currently marked as Paid.
                </div>
              </div>
            </div>

            <div className="aa-grid">
              <div style={{ display: "grid", gap: 18 }}>
                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Room Status Chart</div>
                      <div className="aa-card-sub">Distribution of available, full, and maintenance rooms</div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={roomStatusData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={95}
                          label
                        >
                          {roomStatusData.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Complaint Status Chart</div>
                      <div className="aa-card-sub">See how complaints are moving through resolution</div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={complaintChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#58e4de" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Occupancy by Wing</div>
                      <div className="aa-card-sub">Current filled capacity by wing</div>
                    </div>
                  </div>

                  <div className="aa-bars">
                    {loading ? (
                      <div className="aa-empty">Loading occupancy...</div>
                    ) : occupancyByWing.length === 0 ? (
                      <div className="aa-empty">No wing data available.</div>
                    ) : (
                      occupancyByWing.map((item) => (
                        <div className="aa-bar-row" key={item.wing}>
                          <div className="aa-bar-top">
                            <div className="aa-bar-name">{item.wing}</div>
                            <div className="aa-bar-val">
                              {item.occupied}/{item.capacity} ({item.pct}%)
                            </div>
                          </div>
                          <div className="aa-track">
                            <div className="aa-fill" style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Monthly Revenue Trend</div>
                      <div className="aa-card-sub">Paid revenue collected by month</div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={paymentMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Module Load Chart</div>
                      <div className="aa-card-sub">Operational demand across modules</div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={requestChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Payment Status Chart</div>
                      <div className="aa-card-sub">Paid, submitted, and overdue payment distribution</div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={paymentStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Overdue Payment Alerts</div>
                      <div className="aa-card-sub">Students who need immediate follow-up</div>
                    </div>
                  </div>

                  <div className="aa-list">
                    {loading ? (
                      <div className="aa-empty">Loading overdue payments...</div>
                    ) : overduePayments.length === 0 ? (
                      <div className="aa-empty">No overdue payments found.</div>
                    ) : (
                      overduePayments.slice(0, 6).map((item) => (
                        <div className="aa-item" key={item._id}>
                          <div className="aa-item-top">
                            <div>
                              <div className="aa-item-title">{item.student?.name || "Student"}</div>
                              <div className="aa-item-sub">
                                {item.student?.email || "No email"} · {monthLabel(item.month)}
                              </div>
                            </div>
                            <span className="aa-pill pill-pending">Overdue</span>
                          </div>
                          <div className="aa-item-sub">
                            Room {item.room?.roomNumber || "N/A"} · LKR {Number(item.amount || 0).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Recent Complaints</div>
                      <div className="aa-card-sub">Latest issue reporting activity</div>
                    </div>
                  </div>

                  <div className="aa-list">
                    {loading ? (
                      <div className="aa-empty">Loading complaints...</div>
                    ) : latestComplaints.length === 0 ? (
                      <div className="aa-empty">No complaints found.</div>
                    ) : (
                      latestComplaints.map((item) => (
                        <div className="aa-item" key={item._id}>
                          <div className="aa-item-top">
                            <div>
                              <div className="aa-item-title">{item.title || "Complaint"}</div>
                              <div className="aa-item-sub">
                                {item.student?.name || "Student"} • {timeAgo(item.createdAt)}
                              </div>
                            </div>
                            <span className={`aa-pill ${statusPill(item.status)}`}>
                              {item.status || "Pending"}
                            </span>
                          </div>
                          <div className="aa-item-sub">
                            {item.room?.roomNumber ? `Room ${item.room.roomNumber}` : "No room linked"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Recent Room Requests</div>
                      <div className="aa-card-sub">Latest student allocation activity</div>
                    </div>
                  </div>

                  <div className="aa-list">
                    {loading ? (
                      <div className="aa-empty">Loading requests...</div>
                    ) : latestRequests.length === 0 ? (
                      <div className="aa-empty">No room requests found.</div>
                    ) : (
                      latestRequests.map((item) => (
                        <div className="aa-item" key={item._id}>
                          <div className="aa-item-top">
                            <div>
                              <div className="aa-item-title">
                                {item.student?.name || item.user?.name || "Student"}
                              </div>
                              <div className="aa-item-sub">
                                {item.room?.roomNumber ? `Room ${item.room.roomNumber}` : "No room"} • {timeAgo(item.createdAt)}
                              </div>
                            </div>
                            <span className={`aa-pill ${statusPill(item.status)}`}>
                              {item.status || "Pending"}
                            </span>
                          </div>
                          <div className="aa-item-sub">
                            {item.student?.email || item.user?.email || "No email"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Recent Payments</div>
                      <div className="aa-card-sub">Latest rent updates and submissions</div>
                    </div>
                  </div>

                  <div className="aa-list">
                    {loading ? (
                      <div className="aa-empty">Loading payments...</div>
                    ) : latestPayments.length === 0 ? (
                      <div className="aa-empty">No payments found.</div>
                    ) : (
                      latestPayments.map((item) => (
                        <div className="aa-item" key={item._id}>
                          <div className="aa-item-top">
                            <div>
                              <div className="aa-item-title">{item.student?.name || "Student"}</div>
                              <div className="aa-item-sub">
                                {monthLabel(item.month)} · LKR {Number(item.amount || 0).toLocaleString()}
                              </div>
                            </div>
                            <span className={`aa-pill ${statusPill(item.status)}`}>
                              {item.status || "Pending"}
                            </span>
                          </div>
                          <div className="aa-item-sub">
                            {item.room?.roomNumber ? `Room ${item.room.roomNumber}` : "No room linked"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="aa-card">
                  <div className="aa-card-head">
                    <div>
                      <div className="aa-card-title">Active Notices</div>
                      <div className="aa-card-sub">Currently visible admin announcements</div>
                    </div>
                  </div>

                  <div className="aa-item">
                    <div className="aa-item-title">
                      {loading ? "—" : notices.filter((n) => n.isActive).length} active notices
                    </div>
                    <div className="aa-item-sub">
                      Use this view to monitor hostel communication load and active announcements.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminAnalytics;