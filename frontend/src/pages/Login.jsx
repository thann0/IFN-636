import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../styles/Login.css';

import loginBackground from '../assets/login-background.png';
import planforgeLogo from '../assets/planforge-logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(form.email, form.password);

      navigate(
        user.role === 'seller'
          ? '/dashboard'
          : '/catalogue'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed.'
      );
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section
        className="login-visual"
        style={{
          backgroundImage: `url(${loginBackground})`
        }}
      />

      {/* RIGHT SIDE */}
      <section className="login-content">

        <div className="login-container">

          {/* BRAND */}
          <div className="brand-section">

            <img
              src={planforgeLogo}
              alt="PlanForge"
              className="brand-logo-image"
            />

            <div className="brand-copy">
              <h1>PlanForge</h1>

              <p>
                A digital marketplace for
                <strong>
                  project-management templates
                </strong>
              </p>
            </div>

          </div>

          {/* LOGIN FORM */}
          <div className="login-form-wrapper">

            <h2>Sign In</h2>

            {error && (
              <div className="login-error">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="form-group">

                <label htmlFor="email">
                  Email
                </label>

                <div className="input-wrapper">

                  <i className="ri-mail-line input-icon"></i>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter the email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <i className="ri-lock-2-line input-icon"></i>

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter the password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    <i
                      className={
                        showPassword
                          ? 'ri-eye-line'
                          : 'ri-eye-off-line'
                      }
                    />
                  </button>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="login-actions">

                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </Link>

                <button
                  type="submit"
                  className="login-button"
                >
                  Sign In
                </button>

              </div>

            </form>

            <p className="register-text">
              Don't have an account?{' '}
              <Link to="/register">
                Register
              </Link>
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}