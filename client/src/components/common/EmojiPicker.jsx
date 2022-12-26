import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';

const EmojiPicker = (props) => {
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [isShowPicker, setIsShowPicker] = useState(false);

  const selectEmoji = (e) => {
    const sym = e.unified.split('-');
    const codesArray = [];

    sym.forEach((element) => codesArray.push('0x' + element));

    const emoji = String.fromCodePoint(...codesArray);

    setIsShowPicker(false);
    props.onChange(emoji);
  };

  const showPicker = () => setIsShowPicker(!isShowPicker);

  useEffect(() => {
    setSelectedEmoji(props.icon);
  }, [props.icon]);

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography variant="h3" fontWeight="700" sx={{ cursor: 'pointer' }} onClick={showPicker}>
        {selectedEmoji}
      </Typography>
      <Box
        sx={{
          display: isShowPicker ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          zIndex: '9999',
        }}>
        <Picker theme="dark" onSelect={selectEmoji} showPreview={false} />
      </Box>
    </Box>
  );
};

export default EmojiPicker;
