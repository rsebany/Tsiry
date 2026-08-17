// ============ Tsiry DS — Bande tricolore institutionnelle ============
// Drapeau malgache : bande blanche à gauche, puis rouge (haut) et vert (bas).
export default function FlagStripe({ className }) {
  return (
    <div aria-hidden="true" className={`flex w-full ${className || 'h-1.5'}`}>
      <span className="h-full w-1/3 bg-white" />
      <div className="flex h-full w-2/3 flex-col">
        <span className="h-1/2 bg-red" />
        <span className="h-1/2 bg-primary" />
      </div>
    </div>
  );
}
