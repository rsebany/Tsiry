import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

/** Backward-compatible card wrapper for legacy views (title + description props). */
export default function LegacyCard({ title, description, children, className }) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
