import React, { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords dont match");
        }
        try {
            const response = await signup(formData);
            if (response.data.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="keep-auth-logo">
                    <span>F</span>undoo
                </div>
                <h1>Create Account</h1>
                <p>to continue to Fundoo</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        required
                    />

                    <div className="auth-footer">
                        <Link to="/login">Sign in instead</Link>
                        <button type="submit" className="auth-btn">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
