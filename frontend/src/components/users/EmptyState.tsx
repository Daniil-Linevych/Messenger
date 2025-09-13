interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState = ({ searchQuery }:EmptyStateProps) => {
  if (searchQuery) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
        <p className="mt-2 text-gray-500 dark:text-neutral-400">
          Try searching with a different username or name
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Search for users</h3>
      <p className="mt-2 text-gray-500 dark:text-neutral-400">
        Enter a username or name in the search bar above to find users
      </p>
    </div>
  );
};

export default EmptyState;