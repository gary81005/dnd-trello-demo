import { ReactNode, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from 'react-beautiful-dnd';
import {
  UnorderedListOutlined,
  CheckCircleOutlined,
  CodeSandboxOutlined,
  VerifiedOutlined,
  FileDoneOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import './App.css';
import Title from 'antd/es/typography/Title';
import { Button, Tooltip } from 'antd';
import TaskCard from './componenets/TaskCard';
import AddDialog from './componenets/AddDialog';

const grid = 8;
interface Item {
  id: string;
  content: string;
}

const getItems = (count: number, id: string) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}-${id}`,
    content: `content ${k}-${id}`,
  }));

const iconStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
});
const getListStyle = (isDraggingOver: boolean) => ({
  margin: grid * 2,
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

const iconList: {
  [key: string]: ReactNode;
} = {
  backLog: <UnorderedListOutlined style={iconStyle()} />,
  ready: <CheckCircleOutlined style={iconStyle()} />,
  progress: <CodeSandboxOutlined style={iconStyle()} />,
  verify: <VerifiedOutlined style={iconStyle()} />,
  finish: <FileDoneOutlined style={iconStyle()} />,
};

function App() {
  const [backLogItems, setBackLogItems] = useState<Item[]>(getItems(10, 'backLog'));
  const [readyItems, setReadyItems] = useState<Item[]>([]);
  const [progressItems, setProgressItems] = useState<Item[]>([]);
  const [verifyItems, setVerifyItems] = useState<Item[]>([]);
  const [finishItems, setFinishItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  const id2List: {
    [key: string]: Item[];
  } = {
    backLog: backLogItems,
    ready: readyItems,
    progress: progressItems,
    verify: verifyItems,
    finish: finishItems,
  };

  const getList = (id: string) => id2List[id];

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

    handleSetItems(droppableSource.droppableId, sourceClone);
    handleSetItems(droppableDestination.droppableId, destClone);
  };

  const handleSetItems = (id: string, newItems: Item[]) => {
    switch (id) {
      case 'backLog':
        setBackLogItems(newItems);
        break;
      case 'ready':
        setReadyItems(newItems);
        break;
      case 'progress':
        setProgressItems(newItems);
        break;
      case 'verify':
        setVerifyItems(newItems);
        break;
      case 'finish':
        setFinishItems(newItems);
        break;
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    console.log(source, destination);
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const newItems = reorder(getList(source.droppableId), source.index, destination.index);

      handleSetItems(source.droppableId, newItems);
    } else {
      move(getList(source.droppableId), getList(destination.droppableId), source, destination);
    }
  };

  const renderList = (title: string, id: string, items: Item[]) => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {iconList[id]}
          <Title>{title}</Title>
        </div>
        {id === 'backLog' && (
          <Tooltip title="Add Card">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusSquareOutlined />}
              onClick={() => setOpen(true)}
            />
          </Tooltip>
        )}
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided2, snapshot) => (
                    <TaskCard
                      provided={provided2}
                      title={item.id}
                      content={item.content}
                      {...provided2.draggableProps}
                      {...provided2.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      style={provided2.draggableProps.style}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex' }}>
        {renderList('BackLog', 'backLog', backLogItems)}
        {renderList('Ready', 'ready', readyItems)}
        {renderList('Progress', 'progress', progressItems)}
        {renderList('Verify', 'verify', verifyItems)}
        {renderList('Finish', 'finish', finishItems)}
      </div>
      <AddDialog open={open} onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} />
    </DragDropContext>
  );
}

export default App;
