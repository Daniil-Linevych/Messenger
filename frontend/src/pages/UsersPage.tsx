import { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/store_hooks';
import { getUsersByUsername } from '../store/slices/users';
import SearchBar from '../components/users/SearchBar';
import UsersList from '../components/users/UserList';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(getUsersByUsername(searchQuery));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Users</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Search for users and start a conversation by greeting them
          </p>
        </div>

        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <UsersList 
          searchQuery={searchQuery} 
        />
      </div>
    </div>
  );
};

export default UsersPage;