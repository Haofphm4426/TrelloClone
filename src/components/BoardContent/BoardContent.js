import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import './BoardContent.scss';

import Column from 'components/Column/Column';
import { mapOrder } from 'utilities/sorts';

import { initData } from 'actions/initData';

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFormDB = initData.boards.find((board) => board.id === 'board-1');
    if (boardFormDB) {
      setBoard(boardFormDB);

      //sort column
      mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id');
      setColumns(boardFormDB.columns);
    }
  }, []);

  if (isEmpty(board)) {
    return <div className="not-found">Board Not Found</div>;
  }

  return (
    <div className="board-content">
      {columns.map((column, idx) => (
        <Column key={idx} column={column} />
      ))}
    </div>
  );
}

export default BoardContent;
