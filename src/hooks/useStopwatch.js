import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "sct_stopwatch_state";

export const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setLaps(parsed.laps || []);

        if (parsed.isRunning) {
          const now = Date.now();
          startTimeRef.current = parsed.startTime;
          accumulatedTimeRef.current = parsed.accumulatedTime;

          const currentTotalTime =
            accumulatedTimeRef.current + (now - startTimeRef.current);
          setTime(currentTotalTime);
          setIsRunning(true);

          intervalRef.current = setInterval(() => {
            setTime(
              accumulatedTimeRef.current + (Date.now() - startTimeRef.current),
            );
          }, 10);
        } else {
          accumulatedTimeRef.current = parsed.accumulatedTime;
          setTime(parsed.accumulatedTime);
          setIsRunning(false);
        }
      } catch (error) {
        console.error("Failed to restore stopwatch state", error);
      }
    }
  }, []);

  const saveState = useCallback((running, startT, accTime, currentLaps) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isRunning: running,
        startTime: startT,
        accumulatedTime: accTime,
        laps: currentLaps,
      }),
    );
  }, []);

  const start = () => {
    if (isRunning) return;

    const now = Date.now();
    startTimeRef.current = now;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTime(accumulatedTimeRef.current + (Date.now() - startTimeRef.current));
    }, 10);

    saveState(true, now, accumulatedTimeRef.current, laps);
  };

  const pause = () => {
    if (!isRunning) return;

    clearInterval(intervalRef.current);
    setIsRunning(false);

    const now = Date.now();
    accumulatedTimeRef.current += now - startTimeRef.current;
    setTime(accumulatedTimeRef.current);

    saveState(false, 0, accumulatedTimeRef.current, laps);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;

    saveState(false, 0, 0, []);
  };

  const lap = () => {
    if (!isRunning) return;

    const previousTotalTime = laps.length > 0 ? laps[0].totalTime : 0;
    const currentLapDuration = time - previousTotalTime;

    const newLap = {
      id: Date.now(),
      number: laps.length + 1,
      duration: currentLapDuration,
      totalTime: time,
    };

    const newLaps = [newLap, ...laps];
    setLaps(newLaps);

    saveState(true, startTimeRef.current, accumulatedTimeRef.current, newLaps);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { time, isRunning, laps, start, pause, reset, lap };
};
