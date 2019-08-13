import Cookies from 'js-cookie';
import { GraphQLClient } from 'graphql-request';

const graphql = async (gql, variables) => {
  try {
    // await new Promise(r => setTimeout(r, 1000));
    return await new GraphQLClient(
      '/graphql',
      {
        headers: { authorization: Cookies.get('auth-token') || '' }
      }).request(gql, variables);
  } catch (err) {
    if (err.response && err.response.errors) {
      throw new Error(err.response.errors[0].message);
    } else {
      throw err;
    }
  }
}

export const signout = () => Cookies.remove('auth-token');

export const signup = ({ email, firstName, lastName, password, role }) =>
  graphql(`
    mutation ($data: SignUpData!) {
      SignUp(data: $data) {
        token
        me {
          id
          email
          firstName
          lastName
          role
        }
      }
    }
  `, { data: { email, firstName, lastName, password, role } })
    .then(({ SignUp }) => SignUp);

export const signin = ({ email, password }) =>
  graphql(`
    mutation ($data: SignInData!) {
      SignIn(data: $data) {
        token
        me {
          id
          email
          firstName
          lastName
          role
        }
      }
    }
  `, { data: { email, password } })
    .then(({ SignIn }) => SignIn);
