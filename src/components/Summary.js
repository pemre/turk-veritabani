import './Summary.style.css';

export const Summary = ({ properties }) => {
  const {
    name,
    year,
    years,
    state,
  } = properties;

  return (
    <div className="summary">
      <div><b>{name}</b></div>
      <div className="line">{state}</div>
      {years
        ? <div className="line">[{years[0]} - {years[1]}]</div>
        : <div className="line">{year}</div>
      }
    </div>
  );
};
