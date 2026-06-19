import KiosquePanel from '../../components/kiosk/KiosquePanel.jsx';
import useKiosqueRegister from './fetch/useKiosqueRegister.js';

export default function KiosqueView() {
  const { idRdv, setIdRdv, loading, success, error, handleSubmit } = useKiosqueRegister();

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
