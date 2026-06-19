import Card from '../../components/ui/Card.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import { BookingSuccessBanner } from '../../components/appointments/AppointmentCard.jsx';
import BookAppointmentFormFields from './components/BookAppointmentFormFields.jsx';
import useBookAppointmentForm from './fetch/useBookAppointmentForm.js';

export default function BookAppointmentView() {
  const hook = useBookAppointmentForm();
  const { success, error, initError, handleSubmit, ...fields } = hook;

  return (
    <Card
      title="Prendre rendez-vous"
      description="Sélectionnez une spécialité, un médecin et un créneau horaire."
    >
      {initError && <StatusMessage variant="error" message={initError} />}
      {success && <BookingSuccessBanner rdv={success} />}
      {error && <StatusMessage variant="error" message={error} />}
      <BookAppointmentFormFields {...fields} handleSubmit={handleSubmit} />
    </Card>
  );
}
