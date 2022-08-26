import './square.css'
  
function Square(props) {
  const classNames = ["square"]
  if (props.active) { classNames.push("active") } 

  return (
    <button className={classNames.join(" ")} {...props}>
    </button>
  );
}

export default Square;
