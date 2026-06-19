import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomeView from './views/HomeView.jsx';
import BookAppointmentView from './views/BookAppointmentView.jsx';
import MesRendezVousView from './views/MesRendezVousView.jsx';
import TicketQueueView from './views/TicketQueueView.jsx';
import TicketStatusView from './views/TicketStatusView.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/prendre-rendez-vous" element={<BookAppointmentView />} />
          <Route path="/mes-rendez-vous" element={<MesRendezVousView />} />
          <Route path="/file-attente" element={<TicketQueueView />} />
          <Route path="/ticket/:id/statut" element={<TicketStatusView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
