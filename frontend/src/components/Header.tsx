import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/store_hooks';
import { MessagesSquare, Users} from "lucide-react";
import { logout } from '../store/slices/auth';
import { useCallback } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch, navigate]);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              MessenGer
            </Link>
          </div>

          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link
                to={'/chats'}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MessagesSquare className="h-5 w-5" />
                <p className='px-2 font-bold'>Chats</p>
              </Link>
              <Link
                to={'/users'}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Users className="h-5 w-5" />
                <p className='px-2 font-bold'>Users</p>
              </Link>
            </nav>
          )}

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-neutral-300">
                  Hello, {user?.username || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
                >
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;