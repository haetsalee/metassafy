import React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { fetchAllStacks } from '../../../services/profile-service';
import styled from 'styled-components';
import API from '../../../utils/api';
import { getJsonLocalUserInfo } from '../../../utils/local-storage';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

// function getStyles(name, personName, theme) {
//   console.log(name, personName, theme);
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

const MultipleSelectChip = ({ setTechList, techList }) => {
  // const theme = useTheme();
  const user = getJsonLocalUserInfo()['user_id'] || 'annonymous';
  const [personName, setPersonName] = useState([]);
  const [names, setNames] = useState([]);
  const [isFirst, setIsFirst] = useState(1);

  useEffect(() => {
    const getStacks = async () => {
      const { data } = await fetchAllStacks();
      setNames(data);
    };
    getStacks();
    API.get(`/user/auth/techList/${user}`).then((res) => {
      setPersonName(res.data);
    });
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    setTechList(event.target.value);
  };

  function firstContect() {
    if (isFirst === 1) {
      setPersonName([]);
      setIsFirst(isFirst + 1);
    }
  }

  return (
    <div>
      <FormControl sx={{ marginTop: 2, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Stack</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onClick={firstContect}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected, index) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                // <Chip key={value} label={value.tech_name} />
                return (
                  <ImgStyle
                    src={value.tech_logo}
                    alt="tech logo"
                    key={value.tech_id}
                  />
                );
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name, index) => (
            <MenuItem
              key={name.tech_id}
              value={name}
              // style={getStyles(name, personName, theme)}
            >
              <ImgStyle src={name.tech_logo} alt="tech logo" />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelectChip;

const ImgStyle = styled.img`
  border-radius: 10px;
`;