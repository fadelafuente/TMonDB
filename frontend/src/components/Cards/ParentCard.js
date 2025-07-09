import PostCard from '../../components/Cards/PostCard';
import { useGetResourceById } from '../../hooks/api/use-get-resource-by-id';

import '../../assets/styling/content.css';
import '../../assets/styling/ViewPost.css';

export default function ParentCard({ post }) {
  const { data: parent, isLoading } = useGetResourceById('posts', post.parent);

  if(isLoading || !parent) {
    return <></>;
  }

  return (
    <div className='parent-container article-container'>
      <PostCard post={ parent } />
    </div>
  )
}