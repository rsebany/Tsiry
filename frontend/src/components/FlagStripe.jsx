// ============ Tsiry DS — Bande tricolore institutionnelle ============
// 3 segments : vert puis blanc puis rouge (couleurs du drapeau).
export default function FlagStripe({ className }) {
  return (
    <div aria-hidden="true" className={`flex w-full ${className || 'h-1.5'}`}>
      <span className="h-full flex-[2] bg-primary" />
      <span className="h-full flex-[1] bg-white" />
      <span className="h-full flex-[2] bg-red" />
    </div>
  );
}