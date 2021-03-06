import graphqlClient from "../../../../apollo";
import gql from "graphql-tag";
import {ClientError} from 'front-module-commons';

class UserRegisterProvider {

    registerUser(username, password, name, email, phone) {
        return new Promise((resolve, reject) => {

            graphqlClient.mutate({
                mutation: gql`
                    mutation ($username: String!,$password: String!, $name:String!,
                        $email: String!, $phone: String )
                    {
                        registerUser(input: {username:$username ,password:$password, name:$name,email:$email, phone:$phone})
                        {
                            status
                            id
                            email
                        }
                    }`,
                variables: {
                    username: username,
                    password: password,
                    name: name,
                    email: email,
                    phone: phone,
                }
            }).then(data => {
                resolve(data)
            }).catch((apolloError) => {
                let clientError = new ClientError(apolloError)
                reject(clientError)
            })
        })
    }

    activation(id) {
        return new Promise((resolve, reject) => {
            graphqlClient.mutate({
                mutation: gql`
                    mutation activation($id:ID!){
                        activationUser(id:$id){
                            status
                            message
                        }
                    }
                `,
                variables: {
                    id: id
                }
            }).then(data => {
                resolve(data)
            }).catch((apolloError) => {
                let clientError = new ClientError(apolloError)
                reject(clientError)
            })
        })
    }
}

export default new UserRegisterProvider()
