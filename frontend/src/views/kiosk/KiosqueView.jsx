import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import KiosquePanel from '../../components/kiosk/KiosquePanel.jsx';
import useKiosqueRegister from './fetch/useKiosqueRegister.js';

export default function KiosqueView() {
  const { idRdv, setIdRdv, loading, success, error, handleSubmit } = useKiosqueRegister();

  // Hooks React Router pour lire l'état de navigation et les paramètres d'URL
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. On cherche l'ID dans le 'state' de navigation OU dans les paramètres d'URL (?id_rdv=...)
    const prefilledId = location.state?.idRdv || searchParams.get('id_rdv');

    // 2. Si un ID est trouvé, on pré-remplit le champ du formulaire
    if (prefilledId) {
      setIdRdv(prefilledId.toString());
    }
  }, [location.state, searchParams, setIdRdv]);

  return (
    <div className="kiosque">
      <KiosquePanel
        idRdv={idRdv}
        loading={loading}
        error={error}
        success={success}
        onIdChange={setIdRdv}
        onSubmit={handleSubmit}
      />
    </div>
  );
}