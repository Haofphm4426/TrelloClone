import { React, useState, useEffect, useRef, useCallback } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';

import { isEmpty } from 'lodash';

import './BoardContent.scss';

import Column from 'components/Column/Column';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

import { initData } from 'actions/initData';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);

    const newColumnInputRef = useRef(null);

    const [newColumnTitle, setNewColumnTitle] = useState('');

    useEffect(() => {
        const boardFormDB = initData.boards.find((board) => board.id === 'board-1');
        if (boardFormDB) {
            setBoard(boardFormDB);

            setColumns(boardFormDB.columns);
            //sort column
            boardFormDB.columns = mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id');
        }
    }, []);

    useEffect(() => {
        console.log(newColumnInputRef);
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumnForm]);

    if (isEmpty(board)) {
        return <div className="not-found">Board Not Found</div>;
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map((c) => c.id);
        newBoard.columns = newColumns;

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

    const toggleOpenForm = () => {
        setOpenNewColumnForm(!openNewColumnForm);
    };

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }

        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2, 5), // random characters
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: [],
        };
        let newColumns = [...columns];
        newColumns.push(newColumnToAdd);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map((c) => c.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
        setNewColumnTitle('');
        toggleOpenForm();
    };

    const onUpdateColumn = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate.id;

        let newColumns = [...columns];
        const columnIdexToUpdate = newColumns.findIndex((i) => i.id === columnIdToUpdate);
        console.log(columnIdexToUpdate);

        if (newColumnToUpdate._destroy) {
            newColumns.splice(columnIdexToUpdate, 1);
        } else {
            newColumns.splice(columnIdexToUpdate, 1, newColumnToUpdate);
        }

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map((c) => c.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
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
                        <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
                    </Draggable>
                ))}
            </Container>

            <BootstrapContainer className="trello-container">
                {!openNewColumnForm && (
                    <Row>
                        <Col className="add-new-column" onClick={toggleOpenForm}>
                            <i className="fa fa-plus icon" />
                            Add another column
                        </Col>
                    </Row>
                )}

                {openNewColumnForm && (
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title"
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addNewColumn()}
                            />
                            <div className="d-flex">
                                <Button variant="success" size="sm" onClick={addNewColumn}>
                                    Add column
                                </Button>
                                <span className="cancel-new-column">
                                    <i className="fa fa-trash icon" onClick={toggleOpenForm}></i>
                                </span>
                            </div>
                        </Col>
                    </Row>
                )}
            </BootstrapContainer>
        </div>
    );
}

export default BoardContent;
