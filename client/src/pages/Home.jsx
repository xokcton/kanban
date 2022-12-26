import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { toast, ToastContainer } from 'react-toastify';

import { setBoards } from 'redux/features/boardSlice';
import boardApi from 'api/boardApi';
import { toastOptions } from 'utils/toastOptions';

import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createBoard = async () => {
    try {
      setLoading(true);
      const res = await boardApi.create();
      dispatch(setBoards([res]));
      navigate(`/boards/${res.id}`);
    } catch (error) {
      toast.error(error.statusText, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <LoadingButton variant="outlined" color="success" onClick={createBoard} loading={loading}>
        Click here to create your first board
      </LoadingButton>
      <ToastContainer />
    </Box>
  );
};

export default Home;
