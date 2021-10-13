import React, { useState, useEffect, useRef } from 'react';
import style from './App.module.css';
import Pad from './components/Pad';
import getSamplesArray from './utils/getSamplesArray';
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { BsRecordFill } from 'react-icons/bs';
import { AiFillSave } from 'react-icons/ai';
import { AiFillFolderOpen } from 'react-icons/ai';

const App = () => {
  const [samples, setSamples] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedData, setRecordedData] = useState([]);
  const [playingRecording, setPlayingRecording] = useState(false);

  const interval = useRef(null);

  //Initialize samples state with array of audio objects containing actual samples.
  useEffect(() => {
    setSamples(getSamplesArray());
  }, []);

  //Invoked when user clicks a pad. Toggles between playing/non playing state for specific pad.
  const togglePlaying = index => {
    const tmp = [...samples];
    tmp[index].playing = !tmp[index].playing;
    if (!tmp[index.playing]) {
      tmp[index].audioObject.pause();
      tmp[index].audioObject.currentTime = 0;
    }
    //If there aren't any activa pads, stop the master play state.
    if (!tmp.filter(sample => sample.playing).length) masterStop();
    setSamples(tmp);
  };

  //decativate all pads
  const deactivatePads = () => {
    const tmp = [...samples];
    tmp.forEach(sample => (sample.playing = false));
    setSamples(tmp);
  };

  //Plays all active pads.
  const playAllActiveSamples = () => {
    samples.forEach(sample => {
      if (sample.playing) {
        sample.audioObject.play();
      }
    });
  };

  //Resets the play positions & pauses the samples.
  const resetAllSamples = () => {
    const tmp = [...samples];
    tmp.forEach(sample => {
      if (sample.playing) {
        sample.audioObject.pause();
        sample.audioObject.currentTime = 0;
      }
    });
    setSamples(tmp);
  };

  //Master stop - changes play state and clears loop interval.
  const masterStop = () => {
    setPlaying(false);
    resetAllSamples();
    clearInterval(interval.current);
  };

  //Master play - creates loop interval starts the play state.
  const masterPlay = () => {
    setPlaying(true);
    playAllActiveSamples();
    interval.current = setInterval(() => {
      resetAllSamples();
      playAllActiveSamples();
    }, 8000);
  };

  //Saves active pads to localStorage.
  const save = () => {
    const activeIndexes = [];
    samples.forEach((sample, index) => {
      if (sample.playing) activeIndexes.push(index);
    });
    localStorage.setItem('data', JSON.stringify(activeIndexes));
  };

  //Loads active pads from localStorage.
  const load = () => {
    const savedIndexes = JSON.parse(localStorage.getItem('data'));
    const tmp = [...samples];
    for (let index of savedIndexes) {
      tmp[index].playing = true;
    }
    setSamples(tmp);
  };

  //Adds a record to the recording actions array. (adds the action type + delta from start of recording)
  const addRecord = data => {
    const time = new Date().getTime();
    const tmp = [
      ...recordedData,
      { ...data, time: time - recordedData[0].time },
    ];
    setRecordedData(tmp);
  };

  //Starts the recording by adding an initial element to the recording array with the start time.
  const startRecording = () => {
    deactivatePads();
    const tmp = [{ time: new Date().getTime() }];
    setRecordedData(tmp);
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  //Plays the recording.
  const playRecording = () => {
    deactivatePads();
    setPlayingRecording(true);
    for (let i = 1; i < recordedData.length; i++) {
      switch (recordedData[i].type) {
        case 'masterPlay':
          setTimeout(() => {
            masterPlay();
            if (i === recordedData.length - 1) setPlayingRecording(false);
          }, recordedData[i].time);
          break;
        case 'masterStop':
          setTimeout(() => {
            masterStop();
            if (i === recordedData.length - 1) setPlayingRecording(false);
          }, recordedData[i].time);
          break;
        //Default means that the action is necessarily a pad toggle.
        default:
          setTimeout(() => {
            togglePlaying(recordedData[i].index);
            if (i === recordedData.length - 1) setPlayingRecording(false);
          }, recordedData[i].time);
          break;
      }
    }
  };

  return (
    <>
      <div className={style.looperContainer}>
        <div className={style.dashboard}>
          <div className={style.dashboardGroup}>
            <p className={style.label}>Loop controls</p>
            <div className={style.buttonsContainer}>
              <button
                title="Play"
                onClick={() => {
                  masterPlay();
                  if (recording) addRecord({ type: 'masterPlay' });
                }}
                disabled={playing}
              >
                <FaPlay />
              </button>
              <button
                title="Stop"
                onClick={() => {
                  masterStop();
                  if (recording) addRecord({ type: 'masterStop' });
                }}
                disabled={!playing}
              >
                <FaStop />
              </button>
            </div>
          </div>
          <div className={style.dashboardGroup}>
            <p className={style.label}>Record/Play</p>

            <div className={style.buttonsContainer}>
              <button
                title="Record"
                onClick={() => {
                  if (!recording) startRecording();
                  else stopRecording();
                }}
              >
                {recording ? (
                  <FaStop color="red" />
                ) : (
                  <BsRecordFill color="red" />
                )}
              </button>
              <button
                disabled={
                  !(!recording && recordedData.length > 1) || playingRecording
                }
                title="Play recording"
                onClick={() => {
                  playRecording();
                }}
              >
                <FaPlay />
              </button>
            </div>
          </div>
          <div className={style.dashboardGroup}>
            <p className={style.label}>Save/load</p>
            <div className={style.buttonsContainer}>
              <button
                title="Save"
                onClick={() => {
                  save();
                }}
              >
                <AiFillSave />
              </button>
              <button
                title="Load"
                onClick={() => {
                  load();
                }}
              >
                <AiFillFolderOpen />
              </button>
            </div>
          </div>
        </div>
        <div className={style.padsContainer}>
          {samples.map((sample, index) => (
            <Pad
              key={sample.name}
              index={index}
              togglePlaying={togglePlaying}
              name={sample.name}
              playing={sample.playing}
              addRecord={addRecord}
              recording={recording}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
