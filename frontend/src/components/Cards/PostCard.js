import { useState } from 'react';

import CreatePostModal from '../Modals/CreatePostModal';
import { useUpdateResource } from '../../hooks/features/api/use-update-resource';
import BaseCard from './BaseCard';

import '../../assets/styling/PostCard.css';

export default function PostCard({ data }) {
  const [showUpdate, setShowUpdate] = useState(false);
  const form = useUpdateResource({
      content: data.content
    },
    'posts',
    data.id
  );

  return (
    <>
      <CreatePostModal show={ showUpdate } setShow={ setShowUpdate } form={ form } parent={ data.parent } />
      <BaseCard data={ data } type='posts' onUpdate={ () => setShowUpdate(true) } />
    </>
  );
}