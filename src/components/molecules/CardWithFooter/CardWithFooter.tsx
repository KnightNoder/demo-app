import { ReactNode } from "react";
import Card from "../../organisms/Card/Card";

export const CardWithFooter: React.FC<{ title: string; children: ReactNode, initialPosition: { x: number; y: number } }> = ({ title, children, initialPosition }) => (
  <Card title={title} initialPosition={initialPosition}>
    {children}
  </Card>
);