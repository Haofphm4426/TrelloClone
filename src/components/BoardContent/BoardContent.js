import { React, useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';

import { isEmpty, cloneDeep } from 'lodash';

import './BoardContent.scss';

import Column from 'components/Column/Column';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

import { fetchBoardDetails, createNewColumn, updateBoard, updateColumn, updateCard } from 'actions/ApiCall';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const toggleOpenForm = () => {
        setOpenNewColumnForm(!openNewColumnForm);
    };

    const newColumnInputRef = useRef(null);

    const [newColumnTitle, setNewColumnTitle] = useState('');

    useEffect(() => {
        const boardId = '633d24a3067d5615dcdeda8c';
        fetchBoardDetails(boardId).then((board) => {
            setBoard(board);
            setColumns(mapOrder(board.columns, board.columnOrder, '_id'));
        });
    }, []);

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumnForm]);

    if (isEmpty(board)) {
        return <div className="not-found">Board Not Found</div>;
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = cloneDeep(columns);
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = cloneDeep(board);
        newBoard.columnOrder = newColumns.map((c) => c._id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);

        updateBoard(newBoard._id, newBoard).catch(() => {
            setColumns(columns);
            setBoard(board);
        });
    };

    const onCardDrop = (id, dropResult) => {
        //Vòng lặp sẽ lặp qua tất cả các cột
        if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
            let newColumns = [...columns];

            let curColumns = newColumns.find((c) => c._id === id);
            curColumns.cards = applyDrag(curColumns.cards, dropResult);
            curColumns.cardOrder = curColumns.cards.map((i) => i._id);
            setColumns(newColumns);

            if (dropResult.removedIndex != null && dropResult.addedIndex != null) {
                //Call API to update cardOrder in current column
                updateColumn(curColumns._id, curColumns).catch(() => setColumns(columns));
            } else {
                //1. Call APi to update cardOrder in current column
                updateColumn(curColumns._id, curColumns).catch(() => setColumns(columns));

                if (dropResult.addedIndex != null) {
                    let curCard = cloneDeep(dropResult.payload);
                    curCard.columnId = curColumns._id;
                    //2. Call API to update columnId in current card
                    updateCard(curCard._id, curCard);
                }
            }
        }
    };

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }

        const newColumnToAdd = {
            boardId: board._id,
            title: newColumnTitle.trim(),
        };

        createNewColumn(newColumnToAdd).then((column) => {
            let newColumns = [...columns];
            newColumns.push(column);

            let newBoard = { ...board };
            newBoard.columnOrder = newColumns.map((c) => c._id);
            newBoard.columns = newColumns;

            setColumns(newColumns);
            setBoard(newBoard);
            setNewColumnTitle('');
            toggleOpenForm();
        });
    };

    const onUpdateColumnState = (newColumnToUpdate) => {
        //Get id from newColumn
        const columnIdToUpdate = newColumnToUpdate._id;

        //Find index
        let newColumns = [...columns];
        const columnIdexToUpdate = newColumns.findIndex((i) => {
            return i._id === columnIdToUpdate;
        });

        if (newColumnToUpdate._destroy) {
            newColumns.splice(columnIdexToUpdate, 1);
        } else {
            newColumns.splice(columnIdexToUpdate, 1, newColumnToUpdate);
        }

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map((column) => column._id);
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
                        <Column column={column} onCardDrop={onCardDrop} onUpdateColumnState={onUpdateColumnState} />
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
                                <span className="cancel-icon ">
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
