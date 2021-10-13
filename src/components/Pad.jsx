import React from 'react';
import style from './Pad.module.css';

const inactiveStyle = {
  border: '2px solid rgb(187, 187, 187)',
  boxShadow: '0 0 20px rgba(187, 187, 187, 0.281)',
  textShadow: '0 0 10px rgba(187, 187, 187, 0.281)',
  color: 'rgb(187, 187, 187)',
};
const activeStyle = {
  border: '2px solid rgb(0, 200, 0)',
  boxShadow: '0 0 40px rgba(0, 200, 0, 0.581)',
  textShadow: '0 0 20px rgba(0, 200, 0, 0.581)',
  color: 'rgb(0, 200, 0)',
};

const Pad = ({ name, togglePlaying, index, playing, addRecord, recording }) => {
  return (
    <div className={style.padContainer}>
      <div
        className={style.pad}
        onClick={() => {
          togglePlaying(index);
          if (recording) addRecord({ type: 'togglePlaying', index });
        }}
        style={playing ? activeStyle : inactiveStyle}
      >
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default Pad;
