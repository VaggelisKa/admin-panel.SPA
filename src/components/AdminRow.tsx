import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { User } from 'types';
import { isSuperAdmin } from 'helpers/authHelpers';

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

const AdminRow: React.FC<Props> = ({ user, admin }: Props) => {
  const { roles } = user;
  const initialState = () => ({
    CLIENT: roles.includes('CLIENT'),
    ITEMEDITOR: roles.includes('ITEMEDITOR'),
    ADMIN: roles.includes('ADMIN'),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [roleState, setRoleState] = useState(initialState);

  const createdAtDate = new Date(+user.created_at);
  const formattedDate = createdAtDate.toLocaleString();

  return (
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
          ) : (
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
                  <FontAwesomeIcon icon={['fas', 'check']} color='teal' size='lg' />
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
  );
};

export default AdminRow;
