import React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

import Card from 'components/Card/Card';
import { mapOrder } from 'utilities/sorts';
import './Column.scss';

function Column({ column, onCardDrop }) {
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    return (
        <div className="column">
            <header className="column-drag-handle">{column.title}</header>
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
        </div>
    );
}

export default Column;
