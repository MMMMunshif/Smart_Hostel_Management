import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp.jsx";

// Student Pages
import Rooms from "./pages/student/Rooms.jsx";
import Requests from "./pages/student/Requests.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import Suggested from "./pages/student/Suggested.jsx";
import Profile from "./pages/student/Profile.jsx";
import EditProfile from "./pages/student/EditProfile.jsx";
import Complaints from "./pages/student/Complaints.jsx";
import Leave from "./pages/student/Leave.jsx";
import Visitors from "./pages/student/Visitors.jsx";
import Notices from "./pages/student/Notices.jsx";
import RoommateRequests from "./pages/student/RoommateRequests.jsx";
import MyRoom from "./pages/student/MyRoom.jsx";
import RoomChangeRequests from "./pages/student/RoomChangeRequests.jsx";
import WardenSupport from "./pages/student/WardenSupport.jsx";
import Payments from "./pages/student/Payments.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/Admindashboard.jsx";
import AddRoom from "./pages/admin/AddRoom.jsx";
import ManageRooms from "./pages/admin/ManageRooms.jsx";
import ManageRequests from "./pages/admin/ManageRequests.jsx";
import Students from "./pages/admin/Students.jsx";
import ManageComplaints from "./pages/admin/ManageComplaints.jsx";
import ManageLeave from "./pages/admin/ManageLeave.jsx";
import ManageNotices from "./pages/admin/ManageNotices.jsx";
import ManageVisitors from "./pages/admin/ManageVisitors.jsx";
import RoommatePairs from "./pages/admin/RoommatePairs.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import ManageRoomChangeRequests from "./pages/admin/ManageRoomChangeRequests.jsx";
import WardenInbox from "./pages/admin/WardenInbox.jsx";
import ManagePayments from "./pages/admin/ManagePayments.jsx";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Components
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* STUDENT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="student">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute role="student">
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute role="student">
              <Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute role="student">
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute role="student">
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <ProtectedRoute role="student">
              <Leave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <ProtectedRoute role="student">
              <Visitors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matching"
          element={
            <ProtectedRoute role="student">
              <Suggested />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notices"
          element={
            <ProtectedRoute role="student">
              <Notices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roommate-requests"
          element={
            <ProtectedRoute role="student">
              <RoommateRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-room"
          element={
            <ProtectedRoute role="student">
              <MyRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-change-requests"
          element={
            <ProtectedRoute role="student">
              <RoomChangeRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warden-support"
          element={
            <ProtectedRoute role="student">
              <WardenSupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute role="student">
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-room"
          element={
            <ProtectedRoute role="admin">
              <AddRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute role="admin">
              <ManageRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute role="admin">
              <ManageRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="admin">
              <ManageComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute role="admin">
              <ManageLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/visitors"
          element={
            <ProtectedRoute role="admin">
              <ManageVisitors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute role="admin">
              <ManageNotices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/roommate-pairs"
          element={
            <ProtectedRoute role="admin">
              <RoommatePairs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/room-change-requests"
          element={
            <ProtectedRoute role="admin">
              <ManageRoomChangeRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/warden-inbox"
          element={
            <ProtectedRoute role="admin">
              <WardenInbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute role="admin">
              <ManagePayments />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;