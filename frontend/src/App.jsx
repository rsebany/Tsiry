import Layout from './components/Layout.jsx';
import HomeView from './views/HomeView.jsx';
import TicketStatusView from './views/TicketStatusView.jsx';

export default function App() {
  return (
    <Layout>
      <HomeView />
      <TicketStatusView ticketId={1} />
    </Layout>
  );
}
