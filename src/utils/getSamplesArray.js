import drums1 from '../audio/drums1.mp3';
import drums2 from '../audio/drums2.mp3';
import drums3 from '../audio/drums3.mp3';
import drums4 from '../audio/drums4.mp3';
import bass from '../audio/bass.mp3';
import fx from '../audio/fx.mp3';
import tanggu from '../audio/tanggu.mp3';
import guitar from '../audio/guitar.mp3';
import synth from '../audio/synth.mp3';

export default function getSamplesArray() {
  const tmp = [];
  tmp.push({ audioObject: new Audio(drums1), name: 'Drums 1', state: false });
  tmp.push({ audioObject: new Audio(drums2), name: 'Drums 2', state: false });
  tmp.push({ audioObject: new Audio(drums3), name: 'Drums 3', state: false });
  tmp.push({ audioObject: new Audio(drums4), name: 'Drums 4', state: false });
  tmp.push({ audioObject: new Audio(bass), name: 'Bass', state: false });
  tmp.push({ audioObject: new Audio(fx), name: 'FX', state: false });
  tmp.push({ audioObject: new Audio(tanggu), name: 'Tanggu', state: false });
  tmp.push({ audioObject: new Audio(guitar), name: 'Guitar', playing: false });
  tmp.push({ audioObject: new Audio(synth), name: 'Synth', state: false });
  return tmp;
}
