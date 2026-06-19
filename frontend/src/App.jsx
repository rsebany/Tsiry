import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomeView from './views/HomeView.jsx';
import BookAppointmentView from './views/BookAppointmentView.jsx';
import MesRendezVousView from './views/MesRendezVousView.jsx';
import TicketQueueView from './views/TicketQueueView.jsx';
import TicketStatusView from './views/TicketStatusView.jsx';
import KiosqueView from './views/KiosqueView.jsx';
import MoniteurView from './views/MoniteurView.jsx';
import UrgenceDeclareView from './views/UrgenceDeclareView.jsx';
import CarteHopitauxView from './views/CarteHopitauxView.jsx';
import MedecinAppelView from './views/MedecinAppelView.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/kiosque" element={<KiosqueView />} />
        <Route path="/moniteur" element={<MoniteurView />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/prendre-rendez-vous" element={<BookAppointmentView />} />
                <Route path="/mes-rendez-vous" element={<MesRendezVousView />} />
                <Route path="/file-attente" element={<TicketQueueView />} />
                <Route path="/urgences/declare" element={<UrgenceDeclareView />} />
                <Route path="/medecin/appel" element={<MedecinAppelView />} />
                <Route path="/carte" element={<CarteHopitauxView />} />
                <Route path="/ticket/:id/statut" element={<TicketStatusView />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
