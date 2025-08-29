import { useState } from 'react';

import CreatePostModal from '../Modals/CreatePostModal';
import { useUpdateResource } from '../../hooks/features/api/use-update-resource';
import BaseCard from './BaseCard';

import '../../assets/styling/PostCard.css';

export default function PostCard({ data, type='posts', label='Post' }) {
  const [showUpdate, setShowUpdate] = useState(false);
  const form = useUpdateResource({
      content: data.content
    },
    type,
    data.id
  );

  return (
    <>
      <CreatePostModal show={ showUpdate } setShow={ setShowUpdate } form={ form } parent={ data.parent } />
      <BaseCard data={ data } type={ type } onUpdate={ () => setShowUpdate(true) } label={ label } />
    </>
  );
}