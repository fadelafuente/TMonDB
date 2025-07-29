import { BsArrowClockwise } from 'react-icons/bs';

import '../../assets/styling/Loader.css';

export default function SpinningLoader({ size = '2em' }) {
  return (
    <div className='spinning-loader-container'>
      <BsArrowClockwise className='spinning-loader' size={ size } />
    </div>
  );
}