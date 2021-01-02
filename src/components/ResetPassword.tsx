import React, { useContext } from 'react';
import Modal from 'components/modal/Modal';
import { useRouter } from 'next/router';
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from 'apollo/mutations';
import Loader from 'react-loader-spinner';

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
import { AuthContext } from 'context/AuthContextProvider';

interface ResetPasswordArgs {
  newPassword: string;
  token: string;
}

type Props = Pick<ResetPasswordArgs, 'token'>

const ResetPassword: React.FC<Props> = ({ token }: Props) => {
  const { register, handleSubmit, errors } = useForm<{newPassword: string}>();
  const [resetPassword, { data, loading }] = useMutation<{resetPassword: {message: string}}, ResetPasswordArgs>(RESET_PASSWORD_MUTATION);
  const { handleAuthAction } = useContext(AuthContext);
  const router = useRouter();

  const submitForm = handleSubmit(async ({ newPassword }) => {
    const res = await resetPassword({variables: {newPassword, token}});
    if (res.data?.resetPassword?.message) {
      router.replace('/');
    }
  });

  return (
    <Modal>
      <FormContainer>
        <Header>
          <h4>Enter your new password below.</h4>
        </Header>
        <StyledForm onSubmit={submitForm}>
          <InputContainer>
            <Input
              type='password'
              name='newPassword'
              id='password'
              placeholder='Your new password'
              ref={register({
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 digits'
                },
                maxLength: {
                  value: 30,
                  message: 'Password cannot exceed 30 digits'
                }
              })}
            />
            <ErrorMessage errors={errors} name='newPassword'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{cursor: loading ? 'not-allowed' : 'pointer'}}
          >
            { loading ?
              <Loader type='Oval' color='white' height={30} />
              : 'Reset'
            }
          </Button>
          {data && (
            <StyledInform>
              <p>
                {data.resetPassword?.message}
                <span
                  onClick={() => handleAuthAction('signin')}
                  style={{cursor: 'pointer', color: 'red'}}
                > Sign-in</span>
              </p>
            </StyledInform>
          )}
        </StyledForm>
      </FormContainer>
    </Modal>
  );
};

export default ResetPassword;
