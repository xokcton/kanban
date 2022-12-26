import { useEffect, useRef, useState } from 'react';
import {
  Backdrop,
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import Moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';

import taskApi from 'api/taskApi';
import { toastOptions } from 'utils/toastOptions';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import 'css/custom-editor.css';
import 'react-toastify/dist/ReactToastify.css';

const modalStyles = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%',
};
const initialState = {
  title: '',
  content: '',
};
const modalTimeout = 500;
const timeout = 500;
let timer;
let isModalClosed = false;

const TaskModal = (props) => {
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [modalData, setModalData] = useState(initialState);
  const editorWrapperRef = useRef();

  const setField = (fieldName, fieldData) => {
    setModalData((prevState) => ({ ...prevState, [fieldName]: fieldData }));
  };

  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task);
      setTask(undefined);
    } catch (error) {
      toast.error(error.statusText, toastOptions);
    }
  };

  const updateTitle = (e) => {
    clearTimeout(timer);

    const newTitle = e.target.value;

    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle });
      } catch (error) {
        toast.error(error.statusText, toastOptions);
      }
    }, timeout);

    task.title = newTitle;
    setField('title', newTitle);
    props.onUpdate(task);
  };

  const updateContent = (event, editor) => {
    clearTimeout(timer);

    const data = editor.getData();

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data });
        } catch (error) {
          toast.error(error.statusText, toastOptions);
        }
      }, timeout);

      task.content = data;
      setField('content', data);
      props.onUpdate(task);
    }
  };

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current;
        box.querySelector('.ck-editor__editable_inline').style.height =
          box.offsetHeight - 50 + 'px';
      }
    }, timeout);
  };

  useEffect(() => {
    setTask(props.task);
    setField('title', props.task !== undefined ? props.task.title : '');
    setField('content', props.task !== undefined ? props.task.content : '');

    if (props.task !== undefined) {
      isModalClosed = false;

      updateEditorHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.task]);

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: modalTimeout }}>
      <Fade in={task !== undefined}>
        <Box sx={modalStyles}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <IconButton onClick={deleteTask}>
              <DeleteOutlinedIcon variant="outlined" color="error" />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '2rem 5rem 5rem',
            }}>
            <TextField
              value={modalData.title}
              onChange={updateTitle}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px',
              }}
            />
            <Typography variant="body2" fontWeight="700">
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}>
              <CKEditor
                editor={ClassicEditor}
                data={modalData.content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
