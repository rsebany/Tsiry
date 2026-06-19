import { useEffect, useState } from 'react';
import { getPatientsPresent } from '../../../services/ticketService.js';

export default function usePatientsPresentFetch() {
  const [patientsPresent, setPatientsPresent] = useState([]);

  useEffect(() => {
    getPatientsPresent()
      .then((response) => {
        if (response.success && response.data) {
          setPatientsPresent(response.data);
        }
      })
      .catch(() => {});
  }, []);

  return { patientsPresent };
}
