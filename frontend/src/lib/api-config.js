export default function getApiHeaders() {
  const access = localStorage.getItem('access');
  let headers = {
    'Content-Type': 'application/json',
  };
    
  if(access) {
    headers['Authorization'] = `JWT ${access}`;
  }

  return headers;
}