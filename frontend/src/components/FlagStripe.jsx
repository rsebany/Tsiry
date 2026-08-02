// ============ OWNER: Jess (fondation / identité visuelle) ============
// Bande reprenant le drapeau malgache : bande blanche verticale + rouge/grenat.
export default function FlagStripe({ className }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background:
          'linear-gradient(90deg, #ffffff 0%, #ffffff 25%, transparent 25%), linear-gradient(180deg, #FC3D32 0%, #FC3D32 50%, #007E3A 50%, #007E3A 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%, 75% 100%',
        backgroundPosition: '0 0, 100% 0',
      }}
    />
  );
}
