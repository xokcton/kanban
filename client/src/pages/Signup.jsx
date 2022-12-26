import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField } from '@mui/material';

import authApi from 'api/authApi';

const errorsInitialState = {
  usernameErrText: '',
  passwordErrText: '',
  confirmPasswordErrText: '',
};

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(errorsInitialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(errorsInitialState);

    const data = new FormData(e.target);
    const username = data.get('username').trim();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();

    let err = false;

    if (!username) {
      err = true;
      setErrors((prevState) => ({ ...prevState, usernameErrText: 'Please fill username field' }));
    }
    if (!password) {
      err = true;
      setErrors((prevState) => ({ ...prevState, passwordErrText: 'Please fill password field' }));
    }
    if (!confirmPassword) {
      err = true;
      setErrors((prevState) => ({
        ...prevState,
        confirmPasswordErrText: 'Please fill confirm password field',
      }));
    }
    if (password !== confirmPassword) {
      err = true;
      setErrors((prevState) => ({
        ...prevState,
        confirmPasswordErrText: 'Confirm Password do not match',
      }));
    }

    if (err) return;

    try {
      setLoading(true);
      const res = await authApi.signup({
        username,
        password,
        confirmPassword,
      });

      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (error) {
      const errs = error.data.errors;
      errs.forEach((element) => {
        if (element.param === 'username')
          setErrors((prevState) => ({
            ...prevState,
            usernameErrText: element.msg,
          }));
        if (element.param === 'password')
          setErrors((prevState) => ({
            ...prevState,
            passwordErrText: element.msg,
          }));
        if (element.param === 'confirmPassword')
          setErrors((prevState) => ({
            ...prevState,
            confirmPasswordErrText: element.msg,
          }));
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          disabled={loading}
          error={errors.usernameErrText !== ''}
          helperText={errors.usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          disabled={loading}
          error={errors.passwordErrText !== ''}
          helperText={errors.passwordErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          disabled={loading}
          error={errors.confirmPasswordErrText !== ''}
          helperText={errors.confirmPasswordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}>
          Signup
        </LoadingButton>
      </Box>
      <Button component={Link} to="/login" sx={{ textTransform: 'none' }}>
        Already have an account? Login
      </Button>
    </>
  );
};

export default Signup;
