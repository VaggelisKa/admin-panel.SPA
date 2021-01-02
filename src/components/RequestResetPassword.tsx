import React from 'react';
import { useMutation } from '@apollo/client';
import { useForm, ErrorMessage } from 'react-hook-form';
import Loader from 'react-loader-spinner';

import Modal from './modal/Modal';
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledError,
  StyledInform
} from './SignUp';
import { REQUEST_TO_RESET_PASSWORD_MUTATION } from 'apollo/mutations';

interface Props {}

type RequestToResetPasswordArgs = { email: string }

const RequestResetPassword: React.FC<Props> = () => {
  const [requestToResetPassword, { error, loading, data }] = useMutation<{requestToResetPassword: {
    message: string}}, RequestToResetPasswordArgs>(REQUEST_TO_RESET_PASSWORD_MUTATION);
  const { register, handleSubmit, errors } = useForm<{email: string}>();

  const submitForm = handleSubmit(async ({ email }) => {
    await requestToResetPassword({variables: {email}});
  });

  return (
    <Modal>
      <FormContainer>
        <Header>
          <h4>Enter your email below to reset password.</h4>
        </Header>
        <StyledForm onSubmit={submitForm}>
          <InputContainer>
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
          <Button
            disabled={loading}
            style={{cursor: loading ? 'not-allowed' : 'pointer'}}
          >
            { loading ?
              <Loader type='Oval' color='white' height={30} />
              : 'Request Reset'
            }
          </Button>

          {error && (
            <StyledError>
              {error.graphQLErrors[0]?.message || 'Unexpected error'}
            </StyledError>
          )}
        </StyledForm>
        {data && (
          <StyledInform>
            <p>{data.requestToResetPassword.message}</p>
          </StyledInform>
        )}
      </FormContainer>
    </Modal>
  );
};

export default RequestResetPassword;
