import PostCard from '../../components/Cards/PostCard';
import { useGetResourceParentById } from '../../hooks/features/api/use-get-resource-parent-by-id';

import '../../assets/styling/content.css';
import '../../assets/styling/ViewPost.css';

export default function ParentCard({ post }) {
  const { data: parent, isLoading } = useGetResourceParentById('posts', post.parent);

  if(isLoading || !parent) {
    return <></>;
  }

  return (
    <div className='parent-container article-container'>
      <PostCard post={ parent } />
    </div>
  )
}