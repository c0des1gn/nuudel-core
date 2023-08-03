import React, {FC, createContext, useContext, useMemo} from 'react';
import {useSortable, defaultAnimateLayoutChanges} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Item, {ItemProps} from './Item';
import styles from './styles.module.scss';
import type {CSSProperties} from 'react';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';

interface Context {
  attributes: Record<string, any>;
  listeners?: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
  onRemove?(id: string | number);
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

function animateLayoutChanges(args) {
  const {isSorting, wasSorting} = args;
  return isSorting || wasSorting ? defaultAnimateLayoutChanges(args) : true;
}

export const SortableItem: FC<ItemProps> = props => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({animateLayoutChanges, id: props.item?.uri || props.id});

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
      onRemove: props.onRemove,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <Item
        className={styles.sortableItem}
        ref={setNodeRef}
        style={style}
        withOpacity={isDragging}
        {...props}
        //{...attributes}
        //{...listeners}
      />
    </SortableItemContext.Provider>
  );
};

interface IRemoveProps {
  id: string | number;
}

export function RemoveItem<IRemoveProp>(prop: IRemoveProps) {
  const {onRemove = undefined} = useContext(SortableItemContext);
  return (
    <button
      className={styles.removeItem}
      type="button"
      onClick={e => {
        if (onRemove) {
          onRemove!(prop.id);
        }
        //e.preventDefault();
      }}>
      <svg viewBox="0 0 22 22" width="8">
        <path d="M2.99998 -0.000206962C2.7441 -0.000206962 2.48794 0.0972617 2.29294 0.292762L0.292945 2.29276C-0.0980552 2.68376 -0.0980552 3.31682 0.292945 3.70682L7.58591 10.9998L0.292945 18.2928C-0.0980552 18.6838 -0.0980552 19.3168 0.292945 19.7068L2.29294 21.7068C2.68394 22.0978 3.31701 22.0978 3.70701 21.7068L11 14.4139L18.2929 21.7068C18.6829 22.0978 19.317 22.0978 19.707 21.7068L21.707 19.7068C22.098 19.3158 22.098 18.6828 21.707 18.2928L14.414 10.9998L21.707 3.70682C22.098 3.31682 22.098 2.68276 21.707 2.29276L19.707 0.292762C19.316 -0.0982383 18.6829 -0.0982383 18.2929 0.292762L11 7.58573L3.70701 0.292762C3.51151 0.0972617 3.25585 -0.000206962 2.99998 -0.000206962Z"></path>
      </svg>
    </button>
  );
}

export function DragHandle() {
  const {attributes, listeners, ref} = useContext(SortableItemContext);
  return (
    <button
      className={styles.dragHandle}
      type="button"
      {...attributes}
      {...listeners}
      //onClick={e => { listeners?.onClick!(); e.preventDefault(); }}
      ref={ref}>
      <svg viewBox="0 0 20 20" width="12">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  );
}
