import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/client';

import { Role, User } from 'types';
import { isSuperAdmin } from 'helpers/authHelpers';
import { UPDATE_ROLES_MUTATION } from 'apollo/mutations';
import { QUERY_USERS } from 'apollo/queries';
import Loader from 'react-loader-spinner';

interface Props {
  user: User
  admin: User
}

const DeleteBtn = styled.button`
  background: red;
  color: white;

  &:hover {
    background: orange;
  }
`;

interface UpdateRoleArgs {
  id: string;
  newRoles: Role[];
}

const AdminRow: React.FC<Props> = ({ user, admin }: Props) => {
  const { roles } = user;
  const initialState = () => ({
    CLIENT: roles.includes('CLIENT'),
    ITEMEDITOR: roles.includes('ITEMEDITOR'),
    ADMIN: roles.includes('ADMIN'),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [roleState, setRoleState] = useState(initialState);
  const [updateRoles, { error, loading }] = useMutation<{updateRoles: User}, UpdateRoleArgs>(UPDATE_ROLES_MUTATION);

  useEffect(() => {
    if (error) {
      alert(`${error?.graphQLErrors[0]?.message}`);
    }
  }, [error]);

  const createdAtDate = new Date(+user.created_at);
  const formattedDate = createdAtDate.toLocaleString();

  const handleUpdateRoles = async ( id: string ) => {
    try {
      const newRolesArr: Role[] = [];
      Object.entries(roleState).forEach(([k, v]) => v ? newRolesArr.push(k as Role) : null);

      if (user.roles.length === newRolesArr.length) {
        const checkRoles = user.roles.map((role) =>
          role === 'CLIENT' ? true : newRolesArr.includes(role)
        );

        if (!checkRoles.includes(false)) {
          return;
        }
      }

      const response = await updateRoles(
          {
            variables: { id, newRoles: newRolesArr },
            refetchQueries: [{query: QUERY_USERS}]
          }
      );
      if (response.data?.updateRoles) {
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <tr key={user.id}>
        {/* Name */}
        <td>{user.username}</td>

        {/* Email */}
        <td>{user.email}</td>

        {/* CreatedAt */}
        <td>{formattedDate}</td>

        {/* Manage Roles Section */}
        {/* client role */}

        {isSuperAdmin(admin) && (
          <>
            <td
              style={{
                background: !isEditing ? 'white' : undefined,
                cursor: isEditing ? 'pointer' : undefined,
              }}
              className='td_role'
            >
              {roleState.CLIENT && (
                <FontAwesomeIcon
                  icon={['fas', 'check-circle']}
                  className='true'
                  size='lg'
                  style={{ color: 'black', cursor: 'not-allowed' }}
                />
              )}
            </td>

            {/* item editor role */}
            <td
              onClick={isEditing ? () => setRoleState({...roleState, ITEMEDITOR: !roleState.ITEMEDITOR}) : undefined}
              style={{
                background: !isEditing ? 'white' : undefined,
                cursor: isEditing ? 'pointer' : undefined,
              }}
              className='td_role'
            >
              {roleState.ITEMEDITOR ? (
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            className='true'
            size='lg'
            style={{ color: !isEditing ? 'black' : undefined }}
          />
        ) : (
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            className='false'
            size='lg'
            style={{ color: !isEditing ? 'lightgray' : undefined }}
          />
        )}
            </td>

            {/* admin role */}
            <td
              onClick={isEditing ? () => setRoleState({...roleState, ADMIN: !roleState.ADMIN}) : undefined}
              style={{
                background: !isEditing ? 'white' : undefined,
                cursor: isEditing ? 'pointer' : undefined,
              }}
              className='td_role'
            >
              <>
                {roleState.ADMIN ? (
            <FontAwesomeIcon
              icon={['fas', 'check-circle']}
              className='true'
              size='lg'
              style={{ color: !isEditing ? 'black' : undefined }}
            />
          ) : (
            <FontAwesomeIcon
              icon={['fas', 'times-circle']}
              className='false'
              size='lg'
              style={{ color: !isEditing ? 'lightgray' : undefined }}
            />
          )}
              </>
            </td>

            {/* super admin role */}
            <td>
              {isSuperAdmin(user) && (
                <FontAwesomeIcon
                  style={{ cursor: 'not-allowed' }}
                  icon={['fas', 'check-circle']}
                  size='lg'
                />
              )}
            </td>

            {/* action */}
            {!isEditing ? (
            <td>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </td>
          ) : loading ? <td><Loader type='Oval' color='teal' height={30} /></td> : (
            <td>
              <p className='role_action'>
                <button>
                  <FontAwesomeIcon
                    icon={['fas', 'times']}
                    color='red'
                    onClick={() => {
                      setRoleState(initialState);
                      setIsEditing(false);
                    }}
                    size='lg'
                  />
                </button>
                <button>
                  {
                      loading ? <Loader /> :
                      <FontAwesomeIcon
                        icon={['fas', 'check']}
                        color='teal'
                        size='lg'
                        onClick={() => handleUpdateRoles(user.id)}
                      />
                  }
                </button>
              </p>
            </td>
          )}

            <td>
              <DeleteBtn
                style={{ cursor: isEditing ? 'not-allowed' : undefined }}
                disabled={isEditing}
              >
                <FontAwesomeIcon icon={['fas', 'trash-alt']} size='lg' />
              </DeleteBtn>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

export default React.memo(AdminRow);
