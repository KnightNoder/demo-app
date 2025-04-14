import React from 'react';
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Card from '../Card/Card';
import { GridItem, CardActionHandler } from '../../../types';
import { WidgetOption } from '../../../config/widgets';

interface DesktopViewProps {
  gridItems: GridItem[];
  widgetOptions: WidgetOption[];
  onAction: CardActionHandler;
  patientId: string | null;
  isAnyModalOpen: boolean;
  insuranceWritePermission: boolean;
  gridTemplateColumns: string;
  isStrictAuditor?: boolean; // Optional prop for strict auditor
}

/**
 * Desktop view with grid layout for dashboard cards
 */
const DesktopView: React.FC<DesktopViewProps> = ({
  gridItems,
  widgetOptions,
  onAction,
  patientId,
  isAnyModalOpen,
  insuranceWritePermission,
  gridTemplateColumns,
  isStrictAuditor, // Destructure the prop here
}) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[18px] max-w-full"
      style={{ gridTemplateColumns }}
    >
      <SortableContext items={gridItems} strategy={rectSortingStrategy}>
        {gridItems.map((item) => {
          const widget = widgetOptions.find((w) => w.key === item.id);
          if (!widget) return null;

          return (
            <Card
              key={widget.key}
              id={widget.key}
              title={widget.key}
              footer={true}
              category={widget.key}
              order={item.order}
              initialPosition={{ x: 0, y: 0 }}
              icon={widget.icon}
              onAction={onAction}
              patientId={patientId}
              iconBgColor={widget?.iconBgColor}
              hasWritePermission={
                widget.key === "Insurance"
                  ? insuranceWritePermission
                  : widget.hasWritePermission
              }
              isStrictAuditor={isStrictAuditor} // Now this is defined
            >
              {widget.component && (
                <widget.component
                  patientId={patientId}
                  isAnyModalOpen={isAnyModalOpen}
                />
              )}
            </Card>
          );
        })}
      </SortableContext>
    </div>
  );
};

export default DesktopView;