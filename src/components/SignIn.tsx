import React, { useContext } from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Loader from 'react-loader-spinner';

import Modal from 'components/modal/Modal';
import { AuthContext } from 'context/AuthContextProvider';
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledSwitchAction,
  Divider,
  StyledError
} from './SignUp';
import { SigninArgs, User } from 'types';
import { SIGNIN_MUTATION } from 'apollo/mutations';
import { isAdmin } from 'helpers/authHelpers';

interface Props {}

const SignIn: React.FC<Props> = () => {
  const { handleAuthAction, setAuthUser } = useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm<SigninArgs>();
  const [signin, { loading, error }]= useMutation<{signin: User | null}, SigninArgs>(SIGNIN_MUTATION);
  const router = useRouter();

  const submitSignin = handleSubmit(async ({ email, password }) => {
    try {
      const res = await signin({ variables: { email, password } });
      if (res?.data) {
        const { signin } = res.data;
        if (signin) {
          handleAuthAction('close');
          setAuthUser(signin);
          
          isAdmin(signin) ? router.push('/admin') : router.push('/dashboard');
        }
      }
    } catch (error) {
      setAuthUser(null);
    }
  });

  return (
    <Modal>
      <FormContainer>
        <Header>
          <h2>Sign In</h2>
        </Header>

        <Divider />

        <StyledForm onSubmit={submitSignin}>
          <p className='email_section_label'>or sign in with an email</p>
          <InputContainer>
            <label>Email</label>

            <Input
              type='text'
              name='email'
              id='email'
              placeholder='Your email'
              autoComplete='new-password'
              ref={register({
                required: 'Email field is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email format'
                }
              })}
            />
            <ErrorMessage errors={errors} name='email'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <label>Password</label>

            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Your password'
              ref={register({
                required: 'Password field is required'
              })}
            />
            <ErrorMessage errors={errors} name='password'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{cursor: loading ? 'not-allowed' : 'pointer'}}
          >
            { loading ?
              <Loader type='Oval' color='white' height={30} />
              : 'Sign In'
            }
          </Button>
          <StyledError>
            {error && (error.graphQLErrors[0]?.message ?
              error.graphQLErrors[0]?.message : 'Unexpected error'
            )}
          </StyledError>
        </StyledForm>
        <StyledSwitchAction>
          <p>
            Dont have an account yet?{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('signup')}
            >
              sign up
            </span>{' '}
            instead.
          </p>
          <p>
            Forgot password? click{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('request')}
            >
              here.
            </span>
          </p>
        </StyledSwitchAction>
      </FormContainer>
    </Modal>
  );
};

export default SignIn;
