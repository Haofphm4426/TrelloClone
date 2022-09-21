import { React, useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
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

    const onColumnDrop = (dropResult) => {
        console.log(dropResult);
    };

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={(index) => {
                    columns[index];
                }}
                dragHandleSelector=".column-drag-handle" //class for tag which is used for drag
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview',
                }}
            >
                {columns.map((column, idx) => (
                    <Draggable key={idx}>
                        <Column column={column} />
                    </Draggable>
                ))}
            </Container>
        </div>
    );
}

export default BoardContent;
