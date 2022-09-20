import './Card.scss';

function Card({ card }) {
  return (
    <li className="card-item">
      {card.cover && <img src={card.cover} className="card-cover" alt="" />}

      <div className="title">{card.title}</div>
    </li>
  );
}

export default Card;
