import { BsArrowClockwise } from "react-icons/bs";

import '../../assets/styling/Loader.css';

export default function SpinningLoader() {
  return (
    <div className="spinning-loader-container">
    <BsArrowClockwise className="spinning-loader" />
    </div>
  );
}