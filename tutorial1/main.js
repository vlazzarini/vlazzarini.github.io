import { Csound } from '@csound/browser';
import './style.css'
import csd from './code.csd?raw'

document.querySelector('#app').innerHTML = `
  <div>
    <button id='startButton'>Start</button>
  </div>
`

let csound = null;

const startCsound = async () => {
  if(csound) {
    return;
  }

  console.log("Starting Csound...");

  const stopCsound = async() => {
    await csound.stop();
    csound = null;
    document.querySelector('#startButton').addEventListener('click', startCsound);
    document.querySelector('#startButton').removeEventListener('click', stopCsound);
    document.querySelector('#startButton').addEventListener('click', startCsound);
    document.querySelector('#startButton').innerHTML = "start";
    console.log("click");
  }



  csound = await Csound();
  await csound.compileCsdText(csd);
  await csound.start();
  document.querySelector('#startButton').removeEventListener('click', startCsound);
  document.querySelector('#startButton').addEventListener('click', stopCsound);
  document.querySelector('#startButton').innerHTML = "stop";
}




document.querySelector('#startButton').addEventListener('click', startCsound);
