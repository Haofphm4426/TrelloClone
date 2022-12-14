import React, { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { cloneDeep } from 'lodash';

import './Column.scss';

import Card from 'components/Card/Card';
import ConfirmModal from 'components/Common/ConfirmModal';
import { mapOrder } from 'utilities/sorts';
import { MODAL_ACTION_CONFIRM } from 'utilities/constants';
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable';
import { createNewCard, updateColumn } from 'actions/ApiCall';

function Column({ column, onCardDrop, onUpdateColumnState }) {
    const cards = mapOrder(column.cards, column.cardOrder, '_id');

    const [showModal, setShowModal] = useState(false);
    const toggleShowModal = () => {
        setShowModal(!showModal);
    };

    const [columnTitle, setColumnTitle] = useState(column.title);

    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const toggleOpenNewCardForm = () => {
        setOpenNewCardForm(!openNewCardForm);
    };

    const newCardTextAreaRef = useRef(null);

    const [newCardTitle, setNewCardTitle] = useState('');

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    useEffect(() => {
        if (newCardTextAreaRef && newCardTextAreaRef.current) {
            newCardTextAreaRef.current.focus();
            newCardTextAreaRef.current.select();
        }
    }, [openNewCardForm]);

    // Remove Column
    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true,
            };
            updateColumn(newColumn._id, newColumn).then((updatedColumn) => {
                onUpdateColumnState(updatedColumn);
            });
        }
        toggleShowModal();
    };

    //Update Column Title
    const handleColumnTitleBlur = () => {
        if (columnTitle !== column.title) {
            const newColumn = {
                ...column,
                title: columnTitle,
            };
            //Call API
            updateColumn(newColumn._id, newColumn).then((updatedColumn) => {
                updatedColumn.cards = newColumn.cards;
                onUpdateColumnState(updatedColumn);
            });
        }
    };

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextAreaRef.current.focus();
            return;
        }

        const newCardToAdd = {
            boardId: column.boardId,
            columnId: column._id,
            title: newCardTitle.trim(),
        };

        createNewCard(newCardToAdd).then((card) => {
            let newColumn = cloneDeep(column);
            newColumn.cards.push(card);
            newColumn.cardOrder.push(card._id);

            onUpdateColumnState(newColumn);
            setNewCardTitle('');
            toggleOpenNewCardForm();
        });
    };

    return (
        <div className="column">
            <header className="column-drag-handle">
                <div className="column-title">
                    <Form.Control
                        size="sm"
                        type="text"
                        className="trello-content-editable"
                        value={columnTitle}
                        onChange={(e) => setColumnTitle(e.target.value)}
                        onBlur={handleColumnTitleBlur}
                        onKeyDown={saveContentAfterPressEnter}
                        spellCheck="false"
                        onClick={selectAllInlineText}
                        onMouseDown={(e) => e.preventDefault()}
                    />
                </div>
                <div className="column-dropdown-actions">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn"></Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1" onClick={toggleOpenNewCardForm}>
                                Add card...
                            </Dropdown.Item>
                            <Dropdown.Item onClick={toggleShowModal} href="#/action-2">
                                Remove column...
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Move all cards in this columns...</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Archive all cards in this columns...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className="card-list">
                <Container
                    groupName="col"
                    orientation="vertical"
                    onDrop={(dropResult) => onCardDrop(column._id, dropResult)}
                    getChildPayload={(index) => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview',
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, idx) => (
                        <Draggable key={idx}>
                            <Card card={card} />
                        </Draggable>
                    ))}
                </Container>
                {openNewCardForm && (
                    <div className="add-new-card-area">
                        <Form.Control
                            size="sm"
                            as="textarea"
                            rows="3"
                            placeholder="Enter card title"
                            className="textarea-enter-new-card"
                            ref={newCardTextAreaRef}
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addNewCard()}
                        />
                        <div className="d-flex mb-2">
                            <Button variant="success" size="sm" onClick={addNewCard}>
                                Add card
                            </Button>
                            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
                                <i className="fa fa-trash icon"></i>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {!openNewCardForm && (
                <footer>
                    <div className="footer-action" onClick={toggleOpenNewCardForm}>
                        <i className="fa fa-plus icon" />
                        Add another card
                    </div>
                </footer>
            )}

            <ConfirmModal
                show={showModal}
                onAction={onConfirmModalAction}
                title="Remove Column"
                content={`Are you sure you want to remove <strong>${column.title}</strong>. <br />All related cards will also be removed!`}
            />
        </div>
    );
}

export default Column;
