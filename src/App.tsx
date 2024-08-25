import { useState, useEffect } from 'react'
import './App.css'
import AlarmSound from "./assets/AlarmSound.mp3";

function App() {
    
    const [breakLength,setBreakLength] = useState(5);
    const [sessionLength,setSessionLength] = useState(25);
    const [sessionRunning,setSessionRunning] = useState(true);
    const [seconds,setSeconds] = useState(25*60);
    const [isActive,setIsActive] = useState(false);

    const resetTimer=()=>{
        setBreakLength(5);
        setSessionLength(25);
        setSessionRunning(true);
        setSeconds(25*60);
        setIsActive(false);
        const audio = document.getElementById("beep");
        audio.pause();
        audio.currentTime = 0;
    }

    const playAudio=()=>{
        const audioElement = document.getElementById("beep");
        audioElement.play();
    }

    useEffect(() => {
        let intervalId: any;

        if (isActive) {
            intervalId = setInterval(() => {
                if (seconds==0){
                    if (sessionRunning){
                        playAudio();
                        setSeconds((breakLength*60));
                    }
                    else{
                        setSeconds((sessionLength*60));
                    }
                    setSessionRunning(!sessionRunning);
                    return;
                }
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000); 
        } else if (!isActive && seconds !== sessionLength*60 ) {
            clearInterval(intervalId); // Stop the timer if paused
        }

        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, [isActive, seconds]);
    
    const incrementSession = () =>{
        if (sessionLength==60){
            return;
        }
        if (sessionRunning){
            setSeconds((sessionLength+1)*60);
        }
        setSessionLength(sessionLength+1);
    }

    const incrementBreak = () =>{
        if (breakLength==60){
            return;
        }
        if (!sessionRunning){
            setSeconds((breakLength+1)*60);
        }
        setBreakLength(breakLength+1);
    }

    const decrementSession = () =>{
        if (sessionLength==1){
            return;
        }
        if (sessionRunning){
            setSeconds((sessionLength-1)*60);
        }
        setSessionLength(sessionLength-1);
    }

    const decrementBreak = () =>{
        if (breakLength==1){
            return;
        }
        if (!sessionRunning){
            setSeconds((breakLength-1)*60);
        }
        setBreakLength(breakLength-1);
    }

    const formatTime = () =>{
        const mins = Math.floor(seconds/60);
        const secs = seconds%60;
        const time =  (mins<10?"0":"")+mins.toString() + ":" + (secs<10?"0":"") +secs.toString();
        return time;
    }

    return (
    <>
      <div className="main-container">
        <h1>Pomodoro Timer</h1>
        <div className="timer-container">
            <div className="break">
                <h3 id="break-label">Break Length</h3>
                <p id="break-length">{breakLength}</p>
                <button id="break-decrement" onClick={decrementBreak}>-</button>
                <button id="break-increment" onClick = {incrementBreak}>+</button>
            </div>
            <div className="session">
                <h3 id="session-label">Session Length</h3>
                <p id="session-length">{sessionLength}</p>
                <button id="session-decrement" onClick={decrementSession}>-</button>
                <button id="session-increment" onClick={incrementSession}>+</button>
            </div>
            <div className="timer">
                <h2 id="timer-label">{sessionRunning?"Session Running":"Take a break"}</h2>
                <p id="time-left">{formatTime()}</p>
                <button id="start_stop" onClick={()=>{setIsActive(!isActive)}}>Pause</button>
                <button id="reset" onClick={resetTimer}>Reset</button>
                <audio id="beep" src={AlarmSound}></audio>
            </div>
        </div>
      </div>
    </>
    )
}

export default App
