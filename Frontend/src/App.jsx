import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Rooms from "./pages/student/Rooms.jsx";
import Requests from "./pages/student/Requests.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import AdminDashboard from "./pages/admin/Admindashboard.jsx";
import AddRoom from "./pages/admin/AddRoom.jsx";
import ManageRooms from "./pages/admin/ManageRooms.jsx";
import ManageRequests from "./pages/admin/ManageRequests.jsx";
import Students from "./pages/admin/Students.jsx";
import Complaints from "./pages/student/Complaints.jsx";
import ManageComplaints from "./pages/admin/ManageComplaints.jsx";
import Leave from "./pages/student/Leave.jsx";
import ManageLeave from "./pages/admin/ManageLeave.jsx";



// Components

import Footer from "./components/Footer.jsx";
import Layout from "./components/Layout.jsx";

function App() {

  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/rooms" element={<Rooms />} />
        <Route path="/admin/add-room" element={<AddRoom />} />
        <Route path="/admin/rooms" element={<ManageRooms />} />
    
        <Route path="/admin/requests" element={<ManageRequests />} />
       <Route path="/admin/students" element={<Students />} />


        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/admin/complaints" element={<ManageComplaints />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/admin/leaves" element={<ManageLeave />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;