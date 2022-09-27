import React, { useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form } from 'react-bootstrap';

import Card from 'components/Card/Card';
import ConfirmModal from 'components/Common/ConfirmModal';
import { mapOrder } from 'utilities/sorts';
import { MODAL_ACTION_CONFIRM } from 'utilities/constants';
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable';
import './Column.scss';

function Column({ column, onCardDrop, onUpdateColumn }) {
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    const [showModal, setShowModal] = useState(false);
    const toggleShowModal = () => {
        setShowModal(!showModal);
    };

    const [columnTitle, setColumnTitle] = useState(column.title);

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true,
            };

            onUpdateColumn(newColumn);
        }
        toggleShowModal();
    };

    const handleColumnTitleBlur = () => {
        const newColumn = {
            ...column,
            title: columnTitle,
        };

        onUpdateColumn(newColumn);
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
                            <Dropdown.Item href="#/action-1">Add card...</Dropdown.Item>
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
                    onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
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
            </div>
            <footer>
                <div className="footer-action">
                    <i className="fa fa-plus icon" />
                    Add another column
                </div>
            </footer>
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
