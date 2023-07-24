import { CSSProperties, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  // DraggableLocation,
  DraggingStyle,
  NotDraggingStyle,
  DraggableLocation,
} from 'react-beautiful-dnd';

import './App.css';
import Title from 'antd/es/typography/Title';

const grid = 8;
interface Item {
  id: string;
  content: string;
}

const getItems = (count: number, id: string) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}-${id}`,
    content: `item ${k}-${id}`,
  }));

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) => {
  const res: CSSProperties | undefined = {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
  };
  return res;
};

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

function App() {
  const [items, setItems] = useState<Item[]>(getItems(10, 'droppable'));
  const [selected, setSelected] = useState<Item[]>(getItems(10, 'droppable2'));

  const id2List: {
    [key: string]: string;
  } = {
    droppable: 'items',
    droppable2: 'selected',
  };

  const getList = (id: string) => (id2List[id] === 'items' ? items : selected);

  const reorder = (list: Item[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const move = (
    source: Item[],
    destination: Item[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation,
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [x: string]: Item[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    console.log(source, destination);
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const newItems = reorder(getList(source.droppableId), source.index, destination.index);

      if (source.droppableId === 'droppable2') {
        setSelected(newItems);
      } else {
        setItems(newItems);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination,
      );

      setItems(result.droppable);
      setSelected(result.droppable2);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex' }}>
        <div>
          <Title>TODO</Title>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided2, snapshot) => (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided2.draggableProps.style)}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div style={{ marginLeft: '8px' }}>
          <Title>Finish</Title>
          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {selected.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
