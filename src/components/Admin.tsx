import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import Loader from 'react-loader-spinner';

import AdminRow from './AdminRow';
import { QUERY_USERS } from 'apollo/queries';
import { User } from 'types';
import { isSuperAdmin } from 'helpers/authHelpers';

const Div = styled.div`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;

  /* thead {
    border: 1px solid ${(props) => props.theme.colors.lightGrey};
  } */

  th {
    border: 1px solid ${(props) => props.theme.colors.lightGrey};
    margin: 0;
    font-weight: 800;
  }

  td {
    border: 1px solid ${(props) => props.theme.colors.lightGrey};
    margin: 0;
    padding: 0.5rem;
    font-weight: 400;
    text-align: center;

    .true {
      color: ${(props) => props.theme.colors.teal};
    }

    .false {
      color: red;
    }

    .role_action {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: space-around;
      border: none;

      button {
        margin: 0;
        padding: 0.3rem;
      }
    }
  }

  .td_role {
    background: ${(props) => props.theme.colors.lighterGrey};
  }
`;

interface Props { admin: User }

const Admin: React.FC<Props> = ({ admin }: Props) => {
  const { data, error, loading } = useQuery<{users: User[] | null}>(QUERY_USERS, {fetchPolicy: 'network-only'});


  return loading ? <Loader type='Oval' color='teal' height={30} width={30} />
  : error ? <p>Sorry users could not be fetched</p> : (
    <Div>
      <h3>Roles Management</h3>
      <Table>
        <thead>
          <tr>
            {/* Header */}
            <th rowSpan={2} style={{ width: '25%' }}>
              Name
            </th>
            <th rowSpan={2} style={{ width: '20%' }}>
              Email
            </th>
            <th rowSpan={2} style={{ width: '15%' }}>
              Created At
            </th>
            {
              isSuperAdmin(admin) && (
                <>
                  <th colSpan={4} style={{ width: '25%' }}>
                  Role
                  </th>
                  <th rowSpan={2} style={{ width: '10%' }}>
                  Edit Roles
                  </th>
                </>
              )
            }
          </tr>
          {/* Edit Roles Sub Headers */}
          {
            isSuperAdmin(admin) && (
              <tr>
                <th>Client</th>
                <th>Editor</th>
                <th>Admin</th>
                <th>Super</th>
              </tr>
            )
          }
        </thead>

        <tbody>
          {data?.users?.filter((user) => user.id !== admin.id).map((user) => (
            <AdminRow user={user} key={user.id} admin={admin}/>
          ))}
        </tbody>
      </Table>
    </Div>
  );
};

export default Admin;
