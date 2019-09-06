import Cookies from 'js-cookie';
import { GraphQLClient } from 'graphql-request';

const graphql = async (gql, variables) => {
  try {
    await new Promise(r => setTimeout(r, 500));
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

export const signup = ({ email, first_name, last_name, password, role }) =>
  graphql(`
    mutation ($data: SignUpData!) {
      SignUp(data: $data) {
        token
        me {
          ... on Candidate {
            user {
              id
              email
              first_name
              last_name
            }
          }
          ... on Employer {
            user {
              id
              email
              first_name
              last_name
            }
            job {
              id
              company {
                id
              }
            }
          }
        }
      }
    }
  `, { data: { email, first_name, last_name, password, role } })
    .then(({ SignUp }) => SignUp);

export const signin = ({ email, password }) =>
  graphql(`
    mutation ($data: SignInData!) {
      SignIn(data: $data) {
        token
        me {
          ... on Candidate {
            user {
              id
              email
              first_name
              last_name
            }
            profile {
              location
            }
          }
          ... on Employer {
            user {
              id
              email
              first_name
              last_name
            }
            job {
              id
              company {
                id
              }
            }
          }
        }
      }
    }
  `, { data: { email, password } })
    .then(({ SignIn }) => SignIn);

export const saveCandidateProfile = data =>
  graphql(`
    mutation ($data: CandidateProfileData!) {
      SaveCandidateProfile(data: $data) {
        success
      }
    }
  `, { data })
    .then(({ SaveCandidateProfile }) => SaveCandidateProfile);

export const saveCompanyProfile = ({ companyId, jobId, ...data }) =>
  graphql(`
    mutation ($data: CompanyProfileData!, $companyId: ID!, $jobId: ID!) {
      SaveCompanyProfile(companyId: $companyId, jobId: $jobId, data: $data) {
        success
      }
    }
  `, { companyId, jobId, data })
    .then(({ SaveCompanyProfile }) => SaveCompanyProfile);

export const getCandidateProfile = () =>
  graphql(`
    query {
      me {
        ... on Candidate {
          user {
            first_name
            last_name
          }
          profile {
            linkedin
            location
            us_citizen
            us_green_card
            us_work_visa
            us_student
            uk_eu_citizen
            special_citizen
            remote
            status {
              PersonalInfo
              Location
            }
          }
        }
      }
    }
  `)
  .then(({ me: { user, profile } }) => ({ ...user, ...profile }));

export const getCompanyProfile = () =>
  graphql(`
    query {
      me {
        ... on Employer {
          user {
            first_name
            last_name
          }
          job {
            id
            location
            remote
            description
            company {
              id
              name
              url
              logo 
              size
              about
            }
            status {
              Job
              Company
            }
          }
        }
      }
    }
  `)
  .then(({ me: { user, job: { id: job_id, company: { id: company_id, ...company }, ...job } } }) =>
    ({ ...user, company_id, job_id, ...company, ...job })
  );

export const getJob = ({ companyId }) =>
  graphql(`
    query ($companyId: ID!) {
      job (companyId: $companyId) {
        id
        applied
        company {
          name
          url
          logo 
          size
          about
        }
        location
        remote
        description
      }
    }
  `, { companyId })
  .then(({ job }) => job);

export const getJobs = ({ offset, size }) =>
  graphql(`
    query ($offset: Int!, $size: Int!) {
      jobs (offset: $offset, size: $size) {
        list {
          id
          applied
          company {
            name
            url
            logo 
            size
            about
          }
          location
          remote
          description
        }
        total
      }
    }
  `, { offset, size })
  .then(({ jobs }) => jobs);

export const apply = ({ jobId }) =>
  graphql(`
    mutation ($jobId: ID!) {
      Apply(jobId: $jobId) { 
        success
      }
    }  
  `, { jobId })
  .then(({ Apply }) => Apply);