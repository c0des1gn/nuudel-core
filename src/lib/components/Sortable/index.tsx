import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
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
import type { DropAnimation, Active, UniqueIdentifier } from '@dnd-kit/core';
import { SortableItem } from './SortableItem';
import { arraysEqual } from '../../common/helper';

interface BaseItem {
  id: UniqueIdentifier | string;
}

interface IProps<T extends BaseItem> {
  id?: string;
  disabled?: boolean;
  items: T[];
  onChange?(items: T[]): void;
  onRemove?(Id: string | number): void;
  gridGap?: number;
  maxCol?: number;
  itemProp?: string;
  width?: number;
  height?: number;
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
  onRemove,
  children,
  width,
  height,
  itemProp = 'uri',
  ...props
}) => {
  const [items, setItems] = useState<any[]>(props.items || []);
  const [active, setActive] = useState<Active | null>(null);

  useEffect(() => {
    if (
      !(props.items?.length === 0 && items?.length === 0) &&
      !arraysEqual(props.items, items)
    ) {
      setItems(props.items || []);
    }
  }, [props.items]);

  const activeItem = useMemo(
    () => items.find((item) => item[itemProp] === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    //useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActive(event.active);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over?.id) {
      setItems((items) => {
        const activeIndex = items.findIndex(
          (it = {}) => it[itemProp] === active.id
        );
        const overIndex = items.findIndex(
          (it = {}) => it[itemProp] === over.id
        );
        let arr = arrayMove(items, activeIndex, overIndex) || [];
        onChange!(arr);
        return arr;
      });
    }
    if (active != null) {
      setActive(null);
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    if (active != null) {
      setActive(null);
    }
  }, []);

  const renderItem = (item: any, total?: number) => (
    <SortableItem
      id={item[itemProp]}
      key={item[itemProp]}
      item={item}
      width={width}
      height={height}
      total={total}
      onRemove={onRemove}
    />
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={measuringConfig}
    >
      <SortableContext
        id={props.id}
        items={items.filter(Boolean)}
        strategy={rectSortingStrategy}
        disabled={props.disabled}
      >
        <Grid columns={items.length + 1} gridGap={props.gridGap}>
          {items?.filter(Boolean).map((item, index, arr) => (
            <li key={item[itemProp] || index}>
              {renderItem(item, arr.length)}
            </li>
          ))}
          {children}
        </Grid>
      </SortableContext>
      <DragOverlay
        adjustScale
        //style={{transformOrigin: '0 0 '}}
        dropAnimation={dropAnimationConfig}
      >
        {!activeItem ? null : renderItem(activeItem, items.length)}
      </DragOverlay>
    </DndContext>
  );
};

export default Sortable;
