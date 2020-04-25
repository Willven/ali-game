import React, { useState } from "react";
import "./App.css";
import { makeStyles, Typography } from "@material-ui/core";
import _ from 'lodash';

const GRID_SIZE = 9;

const useStyles = makeStyles({
  red: {
    background: "red",
    width: 40,
    height: 40,
    display: "inline-block",
    margin: 2,
    padding: 0,
  },
  black: {
    background: "black",
    width: 40,
    height: 40,
    display: "inline-block",
    margin: 2,
    padding: 0,
  },
  container: {
    height: `calc(${GRID_SIZE} * 44px)`,
    width: `calc(${GRID_SIZE} * 44px)`,
    display: 'inline-flex',
    flexDirection: 'column'
    // transform: 'rotate(180deg)',
  },
  row: {
    display: 'flex',
  },
  count: {
    paddingLeft: 26,
  }
});

const capValue = (num: number, max: number) => {
  if (num < 0) {
    return 0;
  }
  if (num > max) {
    return max;
  }
  return num;
};


const updateState = (grid: number[][]): number[][] => {
  const ignoredRows: number[] = [];
  grid.forEach((row, rindex) => {
    if (row.every(c => c === 1) || row.every(c => c === 0)) {
      // remove
      ignoredRows.push(rindex);
    }
  });
  return grid
    .map((row, index) => ignoredRows.includes(index) ? [] : row)
    .filter(a => a.length > 0);
}

function updateGrid(grid: number[][], r: number, c:number) {
  console.log('row,col', r, c);
  const newGrid = [...grid];
  const gridSquares = _.uniqWith(
    [[r, c], [r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]
      .map(([ri, ci]) => [capValue(ri, grid.length - 1), capValue(ci, GRID_SIZE - 1)]),
    _.isEqual
  );

  gridSquares.forEach(([ri, ci]) => {
    if (newGrid[ri][ci] === 1) {
      newGrid[ri][ci] = 0;
    } else {
      newGrid[ri][ci] = 1;
    }
  })
  return newGrid;
}

function App() {
  const classes = useStyles();
  
  const initialState = [...new Array(GRID_SIZE)].map(() =>
  [...new Array(GRID_SIZE)].map(() => Math.round(Math.random()))
  );
  
  const [count, setCount] = useState(0);
  const [grid, setGrid] = useState(initialState);
  const [won, setWon] = useState(false);

  return (
    <div>
    <div className={classes.container}>
      {!won && grid.map((row: number[], rindex: number) => {
        return (
          <div className={classes.row}>
            {row.map((cell: number, cindex: number) => {
              return (
                <div
                  onClick={() => {
                    const newGrid = updateState(updateGrid(grid, rindex, cindex));
                    if (newGrid.length > 0) {
                      setGrid(newGrid);
                    } else {
                      setWon(true);
                    }
                    setCount(count + 1);
                  }}
                  key={cindex}
                  className={cell === 1 ? classes.red : classes.black}
                />);
              })}
          </div>
        );
      })}
      {won && <Typography variant="h3">You've won!</Typography>}
    </div>
      <Typography className={classes.count} variant="h5">{`You have used ${count} moves.`}</Typography>
    </div>
  );
}

export default App;
