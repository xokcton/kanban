import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, ListItem, ListItemButton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { toast, ToastContainer } from 'react-toastify';

import { getFavouritesState, setFavourites } from 'redux/features/favouriteSlice';
import boardApi from 'api/boardApi';
import { toastOptions } from 'utils/toastOptions';

import 'react-toastify/dist/ReactToastify.css';

const FavouriteList = () => {
  const dispatch = useDispatch();
  const list = useSelector(getFavouritesState);
  const [activeIndex, setActiveIndex] = useState(0);
  const { boardId } = useParams();

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...list];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((elem) => elem.id === boardId);
    setActiveIndex(activeItem);
    dispatch(setFavourites(newList));

    try {
      await boardApi.updateFavouritePosition({ boards: newList });
    } catch (error) {
      toast.error(error.statusText, toastOptions);
    }
  };

  useEffect(() => {
    const getFavouriteBoards = async () => {
      try {
        const res = await boardApi.getFavourites();
        dispatch(setFavourites(res));
      } catch (error) {
        toast.error(error.statusText, toastOptions);
      }
    };
    getFavouriteBoards();
  }, [dispatch]);

  useEffect(() => {
    const index = list.findIndex((elem) => elem.id === boardId);
    setActiveIndex(index);
  }, [list, boardId]);

  return (
    <>
      <ListItem>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Typography variant="body2" fontWeight="700">
            Favourites
          </Typography>
        </Box>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <ListItemButton
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      selected={index === activeIndex}
                      component={Link}
                      to={`/boards/${item.id}`}
                      sx={{
                        pl: '20px',
                        cursor: snapshot.isDragging ? 'grab' : 'pointer!important',
                      }}>
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                        {item.icon} {item.title}
                      </Typography>
                    </ListItemButton>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <ToastContainer />
    </>
  );
};

export default FavouriteList;
