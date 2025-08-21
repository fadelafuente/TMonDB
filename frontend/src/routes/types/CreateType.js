import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsArrowLeft, BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import { Navigate, useNavigate } from 'react-router-dom';

import TitleBar from '../../components/Bars/TitleBar';
import LoadingCard from '../../components/Cards/LoadingCard';
import TypesTable from '../../components/TablesAndCharts/TypesTable';
import { useGetUser } from '../../hooks/features/user/use-get-user';
import { useAuth } from '../../hooks/features/user/auth/use-auth';

import '../../assets/styling/content.css';
import '../../assets/styling/types.css';

export default function CreateType() {
  const { data: user, isLoading } = useGetUser();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const { data: isAuthenticated, isLoading: authLoading } = useAuth();

  function addType(t) {
    if(types.length >= 20 || !t)
      return;
    if(!types.includes(t))
      setTypes([...types, t]);
    setNewType('');
  }

  function deleteType(n) {
    const removed = [...types].filter((t) => t !== n);
    setTypes(removed);
  }

  if(isLoading || authLoading) {
    return (
      <div className='loading-container'>
        <LoadingCard />
      </div>
    );
  }

  if(!isAuthenticated) {
    return <Navigate to='/login' replace={ true } />;
  }

  return (
    <>
      <div className='navbar-container'>
        <TitleBar setQuery={ () => {} } user={ user } isAuthenticated={ isAuthenticated } />
      </div>
      <div className='content-container center-content'>
        <div id='content-center' className='content-center'>
          <Card>
            <Card.Header>
              <div className='row-gap-container'>
                <Button className='svg-btn svg-resize-btn center-content' onClick={ () => navigate(-1) }>
                  <BsArrowLeft/>
                </Button>
                <h4 className='types-h4'>
                  Create New Type(s)
                </h4>
              </div>
            </Card.Header>
            <Card.Body>
              <div className='type-list'>
                {
                  Array.from(types, type => (
                    <div className='type-row'>
                      <div className='type-name'>
                        {type}
                      </div>
                      <button className='svg-btn svg-resize-btn remove-btn' onClick={ () => deleteType(type) }>
                        <BsDashCircle />
                      </button>
                    </div>
                  ))
                }
                <div className='row-gap-container'>
                  <input className='type-input' onChange={ e => setNewType(e.target.value) } value={ newType } />
                  <button className='svg-btn svg-resize-btn' onClick={ () => addType(newType) }>
                    <BsPlusCircle/>
                  </button>
                </div>
              </div>
              <TypesTable types={ types } />
            </Card.Body>
            <Card.Footer className='align-right row-gap-container'>
              <Button 
                className='base-btn' 
                id='discard-post-btn'
                onClick={ () => navigate(-1) }
              >
                Cancel
              </Button>
              <Button className='base-btn' onClick={ e => {} }>
                Create
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  )
}