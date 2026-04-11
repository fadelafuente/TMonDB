import { useState } from 'react';

export function useMiddleViewPort() {
  const [aboveMid, setAboveMid] = useState(true);

  function handleMiddleHeight(e) {
    e.preventDefault();
    const middlehalf = window.innerHeight / 2;
    setAboveMid(e.clientY > middlehalf);
  }

  return [aboveMid, handleMiddleHeight];
}