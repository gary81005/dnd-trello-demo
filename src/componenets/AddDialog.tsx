import { useImmer } from 'use-immer';
import { Input, Modal } from 'antd';

interface Info {
  title: string;
  content: string;
}

const AddDialog = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: (res: Info) => void;
  onCancel: () => void;
}) => {
  const [info, setInfo] = useImmer<Info>({
    title: '',
    content: '',
  });
  const handleConfirm = () => {
    onConfirm(info);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal title="Basic Modal" open={open} onOk={handleConfirm} onCancel={handleCancel}>
      <Input
        size="large"
        placeholder="Type title"
        value={info.title}
        onChange={(e) =>
          setInfo((draft) => {
            draft.title = e.target.value;
          })
        }
      />
      <br />
      <br />
      <Input
        size="large"
        placeholder="Type content"
        value={info.content}
        onChange={(e) =>
          setInfo((draft) => {
            draft.content = e.target.value;
          })
        }
      />
    </Modal>
  );
};

export default AddDialog;
