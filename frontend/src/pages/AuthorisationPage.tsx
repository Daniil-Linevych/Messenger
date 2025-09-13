import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/store_hooks";
import { login, register, clearError } from "../store/slices/auth";
import type { AuthData } from "../types/auth";
import ErrorMessage from "../components/common/ErrorMessage";

interface AuthProps {
    action: 'IN' | 'UP'
}

const AuthorisationPage = ({action}:AuthProps) => {
    const [formData, setFormData] = useState<AuthData>({username:"", password:""})
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state)=>state.auth)
    const isLogin = action === 'IN'

    useEffect(() => {
        dispatch(clearError());
    }, [action, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [formData.username, formData.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.username.trim()) {
            return;
        }
        
        if (!formData.password.trim()) {
            return;
        }
        
        try {
            if (isLogin) {
                await dispatch(login(formData)).unwrap();
            } else {
                await dispatch(register(formData)).unwrap();
            }
            navigate("/");
        } catch (err) {
            console.log('Auth error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Sign {action === 'IN' ? 'In' : 'Up'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input 
                            id="username"
                            name="username" 
                            value={formData.username} 
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your password"
                            required
                        />
                        {!isLogin && (
                            <p className="text-xs text-gray-500 mt-1">
                                Password must be at least 6 characters long
                            </p>
                        )}
                    </div>
                    
                    {error && (
                        <ErrorMessage message={error}/>
                    )}

                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isLogin ? "Signing in..." : "Signing up..."}
                            </span>
                        ) : (
                            isLogin ? "Sign In" : "Sign Up"
                        )}
                    </button>
                    
                    <div className="text-center text-gray-600 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <Link to={`/${isLogin ? 'register' : 'login'}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthorisationPage;