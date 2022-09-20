import Card from 'components/Card/Card';
import { mapOrder } from 'utilities/sorts';
import './Column.scss';

function Column({ column }) {
  const cards = mapOrder(column.cards, column.cardOrder, 'id');
  return (
    <div className="column">
      <header>{column.title}</header>
      <ul className="card-list">
        {cards.map((card, idx) => (
          <Card key={idx} card={card} />
        ))}
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;
