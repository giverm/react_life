import './square.css';

interface SquareProps {
  active: boolean;
  onClick: () => void;
}

function Square({ active, onClick }: SquareProps) {
  return (
    <button className={`square${active ? ' active' : ''}`} onClick={onClick} />
  );
}

export default Square;
