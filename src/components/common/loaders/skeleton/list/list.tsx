import './styles.css';

interface SkeletonListProps {
  count?: number; // number of skeleton items
}

export function SkeletonList({ count = 5 }: SkeletonListProps) {
  return (
    <ul className='skeleton-list'>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className='skeleton-item'
        >
          <div className='skeleton-content'>
            <div className='skeleton-line short' />
            <div className='skeleton-line long' />
          </div>
        </li>
      ))}
    </ul>
  );
}
