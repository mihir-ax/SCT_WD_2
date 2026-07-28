import { useMemo } from "react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { useStopwatch } from "../hooks/useStopwatch";
import { formatTime } from "../utils/formatTime";
import { cn } from "../utils/cn";

export const Stopwatch = () => {
  const { time, isRunning, laps, start, pause, reset, lap } = useStopwatch();

  const { fastestLapId, slowestLapId } = useMemo(() => {
    if (laps.length < 2) return { fastestLapId: null, slowestLapId: null };

    let min = laps[0];
    let max = laps[0];

    laps.forEach((l) => {
      if (l.duration < min.duration) min = l;
      if (l.duration > max.duration) max = l;
    });

    return { fastestLapId: min.id, slowestLapId: max.id };
  }, [laps]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        <h1 className="text-slate-400 font-semibold tracking-widest uppercase text-sm mb-12">
          Stopwatch
        </h1>

        <div className="mb-12 font-mono tabular-nums font-light text-6xl sm:text-7xl tracking-tight text-white">
          {formatTime(time)}
        </div>

        <div className="flex items-center justify-between w-full max-w-[280px] mb-10">
          <button
            onClick={isRunning ? lap : reset}
            disabled={!isRunning && time === 0}
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center transition-all duration-200 border-2",
              isRunning
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                : time > 0
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed",
            )}
            aria-label={isRunning ? "Lap" : "Reset"}
          >
            {isRunning ? (
              <Flag className="h-6 w-6" />
            ) : (
              <RotateCcw className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={isRunning ? pause : start}
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center transition-all duration-200 border-2 shadow-lg",
              isRunning
                ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20",
            )}
            aria-label={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? (
              <Pause className="h-8 w-8 fill-current" />
            ) : (
              <Play className="h-8 w-8 fill-current ml-1" />
            )}
          </button>
        </div>

        <div className="w-full flex-1 min-h-[250px] max-h-[350px] overflow-y-auto border-t border-slate-800 pt-4 px-2">
          {laps.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 text-sm">
              No laps recorded
            </div>
          ) : (
            <ul className="space-y-3">
              {laps.map((lapItem) => {
                const isFastest = lapItem.id === fastestLapId;
                const isSlowest = lapItem.id === slowestLapId;

                return (
                  <li
                    key={lapItem.id}
                    className={cn(
                      "flex justify-between items-center py-2 px-3 rounded-lg text-sm font-mono tabular-nums",
                      isFastest ? "text-emerald-400 bg-emerald-400/5" : "",
                      isSlowest ? "text-red-400 bg-red-400/5" : "",
                      !isFastest && !isSlowest ? "text-slate-300" : "",
                    )}
                  >
                    <span className="w-16">
                      Lap {String(lapItem.number).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-center font-medium">
                      {formatTime(lapItem.duration)}
                    </span>
                    <span className="w-24 text-right text-slate-500">
                      {formatTime(lapItem.totalTime)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
