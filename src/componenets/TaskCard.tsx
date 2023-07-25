import { Card, Space } from 'antd';
import { CSSProperties } from 'react';
import { DraggableProvided, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';

const grid = 8;
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

const TaskCard = ({
  provided,
  title,
  content,
  isDragging,
  style,
  ...rest
}: {
  provided: DraggableProvided;
  title: string;
  content: string;
  isDragging: boolean;
  style: DraggingStyle | NotDraggingStyle | undefined;
}) => (
  <Space
    ref={provided.innerRef}
    direction="vertical"
    size={16}
    style={getItemStyle(isDragging, style)}
    {...rest}
  >
    <Card title={title} style={{ width: 200 }}>
      <p>{content}</p>
    </Card>
  </Space>
);

export default TaskCard;
