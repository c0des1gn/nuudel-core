import React, {FC, useState, useCallback, useMemo, useEffect} from 'react';
import type {ReactNode} from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
  KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import Grid from './Grid';
import type {DropAnimation, Active, UniqueIdentifier} from '@dnd-kit/core';

interface BaseItem {
  id: UniqueIdentifier | string;
}

interface IProps<T extends BaseItem> {
  disabled?: boolean;
  items: T[];
  onChange?(items: T[]): void;
  renderItem(item: T): ReactNode;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export const Sortable: FC<IProps<any>> = ({
  onChange,
  renderItem,
  children,
  ...props
}) => {
  const [items, setItems] = useState<any[]>(props.items || []);
  const [active, setActive] = useState<Active | null>(null);

  useEffect(() => {
    setItems(props.items || []);
  }, [props.items]);

  const activeItem = useMemo(
    () => items.find(item => item?.uri === active?.id),
    [active, items],
  );
  const sensors = useSensors(
    //useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActive(event.active);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;

    if (over && active.id !== over?.id) {
      setItems(items => {
        const activeIndex = items.findIndex(
          ({uri = undefined}) => uri === active.id,
        );
        const overIndex = items.findIndex(
          ({uri = undefined}) => uri === over.id,
        );
        let arr = arrayMove(items, activeIndex, overIndex) || [];
        onChange!(arr);
        return arr;
      });
    }

    setActive(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={measuringConfig}>
      <SortableContext
        items={items.filter(Boolean)}
        strategy={rectSortingStrategy}
        disabled={props.disabled}>
        <Grid columns={items.length + 1}>
          {items?.filter(Boolean).map((item, index) => (
            <li key={item?.uri || index}>{renderItem(item)}</li>
          ))}
          {children}
        </Grid>
      </SortableContext>
      <DragOverlay
        adjustScale
        //style={{transformOrigin: '0 0 '}}
        dropAnimation={dropAnimationConfig}>
        {!activeItem ? null : renderItem(activeItem)}
      </DragOverlay>
    </DndContext>
  );
};

export default Sortable;
