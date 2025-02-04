import { ReactNode } from "react";
import Card from "../../organisms/Card/Card";

export const CardWithFooter: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <Card title={title}>
    {children}
  </Card>
);