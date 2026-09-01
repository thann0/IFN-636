import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../styles/Register.css';

import registerBackground from '../assets/login-background.png';
import planforgeLogo from '../assets/planforge-logo.png';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      setSuccess('Account created! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed.'
      );
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <section
        className="register-visual"
        style={{
          backgroundImage: `url(${registerBackground})`
        }}
      />

      {/* RIGHT SIDE */}
      <section className="register-content">

        <div className="register-container">

          {/* BRAND */}
          <div className="register-brand-section">

            <img
              src={planforgeLogo}
              alt="PlanForge"
              className="register-logo"
            />

            <div className="register-brand-copy">
              <h1>PlanForge</h1>

              <p>
                A digital marketplace for
                <strong>
                  project-management templates
                </strong>
              </p>
            </div>

          </div>

          {/* FORM */}
          <div className="register-form-wrapper">

            <h2>Create New Account</h2>

            {error && (
              <div className="register-message register-error">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="register-message register-success">
                <i className="ri-checkbox-circle-line"></i>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="register-form-group">
                <label htmlFor="name">
                  Name
                </label>

                <div className="register-input-wrapper">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="register-form-group">
                <label htmlFor="email">
                  Email
                </label>

                <div className="register-input-wrapper">
                  <i className="ri-mail-line register-input-icon"></i>

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
              <div className="register-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="register-input-wrapper">
                  <i className="ri-lock-2-line register-input-icon"></i>

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter the password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
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

              {/* ROLE */}
              <div className="register-form-group">
                <label htmlFor="role">
                  Role
                </label>

                <div className="register-select-wrapper">
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="customer">
                      Customer
                    </option>

                    <option value="seller">
                      Seller
                    </option>
                  </select>

                  <i className="ri-arrow-down-s-line register-select-icon"></i>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="register-actions">

            <Link
              to="/login"
              className="register-login-link"
            >
              Already have an account?
            </Link>

            <button
              type="submit"
              className="register-button"
            >
              Register
            </button>

              </div>

            </form>

          </div>

        </div>

      </section>

    </div>
  );
}