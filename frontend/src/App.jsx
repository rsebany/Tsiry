import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleRoute from '@/components/auth/RoleRoute';
import GuestRoute from '@/components/auth/GuestRoute';
import PatientLayout from '@/components/layout/PatientLayout';
import AgentLayout from '@/components/layout/AgentLayout';
import MedecinLayout from '@/components/layout/MedecinLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RootRedirect from '@/pages/RootRedirect';
import PatientDashboard from '@/features/patient/PatientDashboard';
import BookAppointmentPage from '@/features/patient/BookAppointmentPage';
import MyAppointmentsPage from '@/features/patient/MesRendezVousPage';
import TicketStatusPage from '@/features/patient/TicketStatusPage';
import AgentDashboard from '@/features/agent/AgentDashboard';
import QueueManagementPage from '@/features/agent/FileAttentePage';
import EmergencyDeclarePage from '@/features/agent/UrgenceDeclarePage';
import MedecinDashboard from '@/features/medecin/MedecinDashboard';
import ConsultationCallPage from '@/features/medecin/ConsultationPage';
import HistoriquePatientPage from '@/features/medecin/HistoriquePatientPage';
import KiosqueView from '@/features/kiosque/KiosqueView';
import MoniteurView from '@/features/moniteur/MoniteurView';
import CarteHopitauxView from '@/features/carte/CarteHopitauxView';
import AdminDashboard from '@/features/admin/AdminDashboard';
import UserManagement from '@/features/admin/UserManagement';
import HospitalManagement from '@/features/admin/HospitalManagement';
import ActivityLog from '@/features/admin/ActivityLog';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          {/* Public device routes */}
          <Route path="/kiosque" element={<KiosqueView />} />
          <Route path="/moniteur" element={<MoniteurView />} />
          <Route path="/moniteur/tv" element={<MoniteurView tvMode />} />
          <Route path="/carte" element={<CarteHopitauxView />} />

          {/* Patient portal */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute roles={['PATIENT']} />}>
              <Route path="/patient" element={<PatientLayout />}>
                <Route index element={<PatientDashboard />} />
                <Route path="rendez-vous" element={<MyAppointmentsPage />} />
                <Route path="rendez-vous/nouveau" element={<BookAppointmentPage />} />
                <Route path="ticket" element={<TicketStatusPage />} />
                <Route path="ticket/:id" element={<TicketStatusPage />} />
              </Route>
            </Route>

            {/* Agent portal */}
            <Route element={<RoleRoute roles={['AGENT']} />}>
              <Route path="/agent" element={<AgentLayout />}>
                <Route index element={<AgentDashboard />} />
                <Route path="file-attente" element={<QueueManagementPage />} />
                <Route path="urgences" element={<EmergencyDeclarePage />} />
              </Route>
            </Route>

            {/* Médecin portal */}
            <Route element={<RoleRoute roles={['MEDECIN']} />}>
              <Route path="/medecin" element={<MedecinLayout />}>
                <Route index element={<MedecinDashboard />} />
                <Route path="consultation" element={<ConsultationCallPage />} />
                <Route path="historique" element={<HistoriquePatientPage />} />
              </Route>
            </Route>

            {/* Admin portal */}
            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="hospitals" element={<HospitalManagement />} />
                <Route path="logs" element={<ActivityLog />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
