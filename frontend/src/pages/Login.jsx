import React, { useState } from 'react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            if (response.data.success) {
                loginUser(response.data.user, response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="keep-auth-logo">
                    <span>F</span>undoo
                </div>
                <h1>Sign in</h1>
                <p>Use your Fundoo Account</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="auth-footer">
                        <Link to="/signup">Create account</Link>
                        <button type="submit" className="auth-btn">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
