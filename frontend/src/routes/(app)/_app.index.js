import PostCard from '../../components/Cards/PostCard';
import InfiniteResourceScroll from '../../components/InfiniteScrolls/InfiniteResourceScroll';

export function Index() {
  return (
    <div className='article-container'>
      <InfiniteResourceScroll Card={ PostCard } />
    </div>
  );
}