import { React, useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from 'lodash';

import './BoardContent.scss';

import Column from 'components/Column/Column';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

import { initData } from 'actions/initData';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const boardFormDB = initData.boards.find((board) => board.id === 'board-1');
        if (boardFormDB) {
            setBoard(boardFormDB);

            setColumns(boardFormDB.columns);
            //sort column
            boardFormDB.columns = mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id');
        }
    }, []);

    if (isEmpty(board)) {
        return <div className="not-found">Board Not Found</div>;
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map((c) => c.id);
        newBoard.columns - newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    };

    const onCardDrop = (id, dropResult) => {
        //Vòng lặp sẽ lặp qua tất cả các cột
        if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
            let newColumns = [...columns];

            let curColumns = newColumns.find((c) => c.id === id);
            curColumns.cards = applyDrag(curColumns.cards, dropResult);
            curColumns.cardOrder = curColumns.cards.map((i) => i.id);
            setColumns(newColumns);
        }
    };

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={(index) => columns[index]}
                dragHandleSelector=".column-drag-handle" //class for tag which is used for drag
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview',
                }}
            >
                {columns.map((column, idx) => (
                    <Draggable key={idx}>
                        <Column column={column} onCardDrop={onCardDrop} />
                    </Draggable>
                ))}
            </Container>
            <div className="add-new-column">
                <i className="fa fa-plus icon" />
                Add another column
            </div>
        </div>
    );
}

export default BoardContent;
