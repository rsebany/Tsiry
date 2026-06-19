import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleRoute from '@/components/auth/RoleRoute';
import GuestRoute from '@/components/auth/GuestRoute';
import PatientLayout from '@/components/layout/PatientLayout';
import AgentLayout from '@/components/layout/AgentLayout';
import MedecinLayout from '@/components/layout/MedecinLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RootRedirect from '@/pages/RootRedirect';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import BookAppointmentPage from '@/pages/patient/BookAppointmentPage';
import MyAppointmentsPage from '@/pages/patient/MyAppointmentsPage';
import TicketStatusPage from '@/pages/patient/TicketStatusPage';
import AgentDashboard from '@/pages/agent/AgentDashboard';
import QueueManagementPage from '@/pages/agent/QueueManagementPage';
import EmergencyDeclarePage from '@/pages/agent/EmergencyDeclarePage';
import MedecinDashboard from '@/pages/medecin/MedecinDashboard';
import ConsultationCallPage from '@/pages/medecin/ConsultationCallPage';
import KiosqueView from '@/views/kiosk/KiosqueView';
import MoniteurView from '@/views/queue/MoniteurView';
import CarteHopitauxView from '@/views/carte/CarteHopitauxView';

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
                <Route path="appel" element={<ConsultationCallPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
