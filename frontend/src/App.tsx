import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/store_hooks'
import { useEffect } from 'react'
import { get_current_user } from './store/slices/auth'
import LoadingSpinner from './components/common/LoadingSpinner'
import AuthorisationPage from './pages/AuthorisationPage'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import ChatsPage from './pages/ChatsPage'
import UsersPage from './pages/UsersPage'

function App() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);


  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      
      if (token && !user && !isAuthenticated) {
        try {
          await dispatch(get_current_user()).unwrap();
        } catch (error) {
          // Якщо токен недійсний, він вже видалений в authSlice
          console.error('Failed to get current user:', error);
        }
      }
    };

    initializeAuth();
  }, []); 

  if (loading && !user && localStorage.getItem("access_token")) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Router>
      <Header/>
      <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<AuthorisationPage action='IN'/>}/>
          <Route path='/register' element={<AuthorisationPage action='UP'/>}/>
          <Route path='/chats' element={<ChatsPage/>}/>
          <Route path='/users' element={<UsersPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
