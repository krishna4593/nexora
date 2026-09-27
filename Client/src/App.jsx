import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import Join from './pages/Join';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CollegeSetup from './pages/onboarding/CollegeSetup';
import CollegeLayout from './layouts/CollegeLayout';
import Dashboard from './pages/college/Dashboard';
import NoticesPage from './pages/college/NoticesPage';
import DepartmentsPage from './pages/college/DepartmentsPage';
import FacultyPage from './pages/college/FacultyPage';
import CoursesPage from './pages/college/CoursesPage';
import StudentsPage from './pages/college/StudentsPage';
import EnrollmentsPage from './pages/college/EnrollmentsPage';
import AttendancePage from './pages/college/AttendancePage';
import AttendanceSessionPage from './pages/college/AttendanceSessionPage';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Non-Auth Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/join" element={<Join />} />

            {/* Public Auth Routes (Only accessible if NOT logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes (Only accessible if logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Navigate to="/setup/college" replace />} />
              <Route path="/setup/college" element={<CollegeSetup />} />
              
              <Route path="/college" element={<CollegeLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="faculty" element={<FacultyPage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="enrollments" element={<EnrollmentsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="attendance/sessions/:id" element={<AttendanceSessionPage />} />
                <Route path="notices" element={<NoticesPage />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
