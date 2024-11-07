import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControl, FormControlLabel, FormLabel, Link, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDataService from '../services/UserDataService';
import { FacebookIcon, GoogleIcon, SitemarkIcon } from './CustomIcons';
import ForgotPassword from './ForgotPassword';
import AppTheme from './shared-theme/AppTheme';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function Login({ setToken }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    setLoading(true);

    try {
      if (failedAttempts >= 5) {
        const currentTime = new Date().getTime();
        const timeSinceLastAttempt = currentTime - lastAttemptTime;
        const waitTime = Math.pow(2, failedAttempts - 5) * 1000; // Progressive delay
        if (timeSinceLastAttempt < waitTime) {
          setEmailError(true);
          setEmailErrorMessage(`Please wait ${Math.ceil((waitTime - timeSinceLastAttempt) / 1000)} seconds before trying again.`);
          setLoading(false);
          return;
        }
      }

      const response = await UserDataService.login({ email, password });
      const user = response.data;
      if (user) {
        login(user);
        setToken(user.accessToken);
        navigate(`/users/${user.id}`);
        setFailedAttempts(0);
      } else {
        setFailedAttempts(prevAttempts => prevAttempts + 1);
        setLastAttemptTime(new Date().getTime());
        setEmailError(true);
        setEmailErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setFailedAttempts(prevAttempts => prevAttempts + 1);
      setLastAttemptTime(new Date().getTime());
      setEmailError(true);
      setEmailErrorMessage('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <StyledCard variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Forgot your password?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign in"}
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don't have an account?{' '}
              <span>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{ alignSelf: 'center' }}
                >
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
          </Box>
        </StyledCard>
      </SignInContainer>
    </AppTheme>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;