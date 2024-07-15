import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { createActor as createUserActor } from '../../../declarations/sipnPlay-ICP-backend';
import {ids} from '../../../../AdminDevelopmentConfig'
import Home from '../Pages/Home';

const AuthContext = createContext();

export const useAuthClient = () => {
    const [authClient, setAuthClient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [actors, setActors] = useState(null);
    
    const clientInfo = async (client) => {
        const isAuthenticated = await client.isAuthenticated();
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        console.log(principal)

        setAuthClient(client);
        setIdentity(identity);
        setIsAuthenticated(isAuthenticated);
        let userActor = null;
        setPrincipal(principal);

        if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
            userActor = createUserActor(ids.userCan, { agentOptions: { identity: identity } });
        //    console.log(await userActor?.greet("tushar"));
            setActors({
                userActor:userActor,
            })
        }
        return userActor;
    }

    useEffect(() => {
        (async () => {
            const authClient = await AuthClient.create();
            clientInfo(authClient);
        })();
    }, []);

    const login = async (val) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                    resolve(clientInfo(authClient));
                } else {
                    if(val==="ii"){
                    await authClient.login({
                        identityProvider: process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app/"
                            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                        // identityProvider:"https://identity.ic0.app/",
                        onError: (error) => reject((error)),
                        onSuccess: () => resolve(clientInfo(authClient)),
                    });
                }else{
                    await authClient.login({
                        identityProvider: process.env.DFX_NETWORK === "ic"
                            ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
                            :`https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
                        onError: (error) => reject((error)),
                        onSuccess: () => resolve(clientInfo(authClient)),
                    });
                }
            }
                
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        await authClient?.logout();
    }

    return {
        login, logout, authClient, isAuthenticated, identity, principal, ids, actors
    };
}

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    if (!auth.isAuthenticated || !auth.actors) {
        return (
            <AuthContext.Provider value={auth}>
                <Home/>
            </AuthContext.Provider>
        )
    }
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);