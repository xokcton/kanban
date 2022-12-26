import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import 'react-toastify/dist/ReactToastify.css';

import boardApi from 'api/boardApi';
import { EmojiPicker, Kanban } from 'components/common';
import { getBoardsState, setBoards } from 'redux/features/boardSlice';
import { getFavouritesState, setFavourites } from 'redux/features/favouriteSlice';
import { toastOptions } from 'utils/toastOptions';

const initialState = {
  title: '',
  description: '',
  sections: [],
  isFavourite: false,
  icon: '',
};
const timeout = 500;
let timer;

const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(getBoardsState);
  const favouriteList = useSelector(getFavouritesState);
  const { boardId } = useParams();
  const [data, setData] = useState(initialState);

  const setField = (fieldName, fieldData) => {
    setData((prevState) => ({ ...prevState, [fieldName]: fieldData }));
  };

  const onIconChange = async (emoji) => {
    const temp = [...boards];
    const index = temp.findIndex((elem) => elem.id === boardId);
    temp[index] = { ...temp[index], icon: emoji };
    setField('icon', emoji);

    if (data.isFavourite) {
      const tempFavourite = [...favouriteList];
      const indexFavourite = tempFavourite.findIndex((elem) => elem.id === boardId);

      tempFavourite[indexFavourite] = { ...tempFavourite[indexFavourite], icon: emoji };
      dispatch(setFavourites(tempFavourite));
    }

    try {
      dispatch(setBoards(temp));
      await boardApi.update(boardId, { icon: emoji });
    } catch (error) {
      toast.error(error.statusText, toastOptions);
    }
  };

  const updateTitle = (e) => {
    const newTitle = e.target.value;
    const temp = [...boards];
    const index = temp.findIndex((elem) => elem.id === boardId);

    clearTimeout(timer);
    setField('title', newTitle);

    temp[index] = { ...temp[index], title: newTitle };

    if (data.isFavourite) {
      const tempFavourite = [...favouriteList];
      const indexFavourite = tempFavourite.findIndex((elem) => elem.id === boardId);

      tempFavourite[indexFavourite] = { ...tempFavourite[indexFavourite], title: newTitle };
      dispatch(setFavourites(tempFavourite));
    }

    timer = setTimeout(async () => {
      try {
        dispatch(setBoards(temp));
        await boardApi.update(boardId, { title: newTitle });
      } catch (error) {
        toast.error(error.statusText, toastOptions);
      }
    }, timeout);
  };

  const updateDescription = (e) => {
    const newDescription = e.target.value;

    clearTimeout(timer);
    setField('description', newDescription);

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (error) {
        toast.error(error.statusText, toastOptions);
      }
    }, timeout);
  };

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !data.isFavourite });

      let newFavourite = [...favouriteList];
      if (data.isFavourite) {
        newFavourite = newFavourite.filter((elem) => elem.id !== boardId);
      } else {
        newFavourite.unshift(board);
      }

      dispatch(setFavourites(newFavourite));
      setField('isFavourite', !data.isFavourite);
    } catch (error) {
      toast.error(error.statusText, toastOptions);
    }
  };

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId);

      if (data.isFavourite) {
        const newFavouriteList = favouriteList.filter((elem) => elem.id !== boardId);
        dispatch(setFavourites(newFavouriteList));
      }

      const newList = boards.filter((elem) => elem.id !== boardId);

      if (newList.length === 0) navigate('/boards');
      else navigate(`/boards/${newList[0].id}`);

      dispatch(setBoards(newList));
    } catch (error) {
      toast.error(error.statusText, toastOptions);
    }
  };

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId);
        setField('title', res.title);
        setField('description', res.description);
        setField('sections', res.sections);
        setField('isFavourite', res.favourite);
        setField('icon', res.icon);
      } catch (error) {
        toast.error(error.statusText, toastOptions);
      }
    };
    getBoard();
  }, [boardId]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <IconButton variant="outlined" onClick={addFavourite}>
          {data.isFavourite ? <StarOutlinedIcon color="warning" /> : <StarBorderOutlinedIcon />}
        </IconButton>
        <IconButton variant="outlined" color="error" onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          <EmojiPicker icon={data.icon} onChange={onIconChange} />
          <TextField
            value={data.title}
            onChange={updateTitle}
            placeholder="Untitled"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' },
            }}
          />
          <TextField
            value={data.description}
            onChange={updateDescription}
            placeholder="Add a description"
            variant="outlined"
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' },
            }}
          />
        </Box>
        <Box>
          <Kanban data={data.sections} boardId={boardId} />
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default Board;
