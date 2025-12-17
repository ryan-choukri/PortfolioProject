"use client"
import React, { useState, useEffect } from "react";

type Grid = number[][];

const Game2048 = () => {
    const templateGrid: Grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    const tileColors: Record<number, string> = { 0: "bg-zinc-400", 2: "bg-stone-200 text-zinc-800", 4: "bg-stone-300 text-zinc-800", 8: "bg-orange-300 text-white",
      16: "bg-orange-400 text-white", 32: "bg-orange-500 text-white", 64: "bg-orange-600 text-white", 128: "bg-yellow-400 text-white",
      256: "bg-yellow-500 text-white", 512: "bg-yellow-600 text-white", 1024: "bg-yellow-700 text-white", 2048: "bg-yellow-800 text-white",};

    const [grid, setGrid] = useState<Grid>(templateGrid);

    const [gameOver, setGameOver] = useState<boolean>(false);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const transpose = (grid: number[][]): number[][] => grid[0].map((_, i) => grid.map(row => row[i]));

    const mergeLine = (line: number[]): number[] => {
      const nonZero = line.filter(n => n !== 0);
      const merged: number[] = [];

      for (let i = 0; i < nonZero.length; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          merged.push(nonZero[i] * 2);
          i++; // on saute la suivante
        } else {
          merged.push(nonZero[i]);
        }
      }

      while (merged.length < 4) merged.push(0);
      return merged;
    };

    const NewMoveBox = (direction: string, grid: number[][]): number[][] => {
      switch (direction) {
        case "left":
          return grid.map(row => mergeLine(row));

        case "right":
          return grid.map(row =>
            mergeLine([...row].reverse()).reverse()
          );

        case "top": {
          const t = transpose(grid);
          const moved = t.map(row => mergeLine(row));
          return transpose(moved);
        }

        case "bottom": {
          const t = transpose(grid);
          const moved = t.map(row =>
            mergeLine([...row].reverse()).reverse()
          );
          return transpose(moved);
        }

        default:
          return grid;
      }
    };


    interface Position {
      x: number;
      y: number;
    }

    const arrayRandom = (CurrentGrid: Grid): Grid => {
      const firstNb: number = Math.floor(Math.random() * 16) + 1;
      let secondNb: number = Math.floor(Math.random() * 16) + 1;
      while (secondNb === firstNb || Math.abs(secondNb - firstNb) < 5) {
      secondNb = Math.floor(Math.random() * 16) + 1;
      }
      console.log(firstNb);
      console.log(secondNb);
      let incrre: number = 0;
      const generatedGrid: Grid = CurrentGrid.map((arr, index) => {
      console.log('index', incrre);
      incrre += 4;

      return arr.map((subArr, subId) => {
        //console.log(subId + 1 + incrre);
        if (subId + 1 + incrre - 4 === firstNb || subId + 1 + incrre - 4 === secondNb) {
        return 2;
        }
        return 0;
        console.log('subId', subId, 'index', index);
      });
      });
      console.log('generatedGrid', generatedGrid);
      return generatedGrid;
    };
    
    useEffect(() => {
      // Généré UNIQUEMENT côté client
      // eslint-disable-next-line react-hooks/set-state-in-effect
      // return myArray.sort((a: Position, b: Position) => a.pos - b.pos);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGrid(arrayRandom(grid));
    }, []);

    const addRandomTile = (grid: number[][]): number[][] => {
      const empty: [number, number][] = [];

      grid.forEach((row, r) =>
        row.forEach((cell, c) => {
          if (cell === 0) empty.push([r, c]);
        })
      );

      if (!empty.length) return grid;

      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      const value = Math.random() < 0.9 ? 2 : 4;

      const copy = grid.map(row => [...row]);
      copy[r][c] = value;
      return copy;
    };

    const setDirectionAndNewArray = (text: string) => {
      setGrid(prev => {
        const newGrid = NewMoveBox(text, prev);
        return addRandomTile(newGrid);
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirectionAndNewArray("top");
          break;
        case "ArrowDown":
          setDirectionAndNewArray("bottom");
          break;
        case "ArrowLeft":
          setDirectionAndNewArray("left");
          break;
        case "ArrowRight":
          setDirectionAndNewArray("right");
          break;
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      if (!touchStart) return;

      const touch = e.changedTouches[0];

      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      let dir = "none";

      if (absDx > absDy) {
        dir = dx > 0 ? "right" : "left";
      } else {
        dir = dy > 0 ? "bottom" : "top";
      }

      console.log("SWIPE MOBILE:", dir);

      setDirectionAndNewArray(dir);
      setTouchStart(null);
    };

    const checkGameOver = (grid: number[][]): boolean => {
      const size = grid.length;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // case vide → coup possible
          if (grid[r][c] === 0) return false;

          // merge à droite possible
          if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return false;

          // merge en bas possible
          if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return false;
        }
      }

      return true; // aucun coup possible
    };

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    
    if (checkGameOver(grid) && !gameOver) {
      setGameOver(true);
      console.log("GAME OVER");
    }
    
    const reset = () => {
      // créer une nouvelle grille avec deux tuiles aléatoires
      setGrid(arrayRandom(grid));
      setGameOver(false);
    };

    
    return (
      <div className="flex-1 flex  relative">

        {/* {gameOver && (
          <div>GAME OVER</div>
        )} */}
        <div
        
          className="grid grid-cols-4 gap-3 w-full h-full min-w-[250px] min-h-[250px] m-auto"
          style={{
            touchAction: "none" ,
            width: "min(calc(100vw), calc(100vh - 188px))",
            height: "min(calc(100vw), calc(100vh - 188px))",
            margin: "auto",
            padding: "10px",
          }}
        >
          {grid.map((row, r) =>
            row.map((value, c) => (
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                key={`${r}-${c}`}
                className={`flex items-center aspect-square min-w-[20px] min-h-[20px] justify-center rounded-lg font-bold text-2xl ${tileColors[value] ?? "bg-black text-white"}`}
              >
                {value !== 0 && value}
              </div>
            ))
          )}

        </div>
          {/* OVERLAY GAME OVER */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-auto">
                <div style={{ padding: "30px" }}
                  className="rounded-xl p-12 bg-black/50 flex flex-col items-center justify-center">
                <p className="text-white text-5xl font-extrabold mb-6 text-center">
                  GAME OVER
                </p>
                <button
                  style={{ padding: "6px 17px", margin: "18px" }}
                  onClick={reset}
                  className="m-4 px-6 py-3 rounded-lg bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition"
                >
                  Rejouer
                </button>
              </div>
            </div>
          )}
      </div>
     );
}

 export default Game2048;
