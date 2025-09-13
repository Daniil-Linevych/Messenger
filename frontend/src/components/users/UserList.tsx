import { useAppSelector } from '../../hooks/store_hooks';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import type { User } from '../../types/user';
import UserItem from './UserItem';
import EmptyState from './EmptyState';

interface UsersListProps {
  searchQuery: string;
}

const UsersList = ({ searchQuery }:UsersListProps) => {
  const { users, loading, error } = useAppSelector((state) => state.users);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (users.length > 0) {
    return (
      <div className="space-y-4">
        {users.map((user:User) => (
          <UserItem key={user.id} user={user} />
        ))}
      </div>
    );
  }

  return <EmptyState searchQuery={searchQuery} />;
};

export default UsersList;