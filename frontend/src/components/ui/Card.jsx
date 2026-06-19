export default function Card({ title, description, children, className = '', as: Tag = 'section' }) {
  return (
    <Tag className={`card ${className}`.trim()}>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {children}
    </Tag>
  );
}
