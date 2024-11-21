import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import {
  createActor,
} from "../../../declarations/sipnplay_icp_backend/index";


const AuthContext = createContext();

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // set to 30 minutes
      disableDefaultIdleCallback: true, // disable the default reload behavior
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptionsii: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
  },
  loginOptionsnfid: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
        : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
};

// Custom hook to manage authentication with Internet Identity
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountIdString, setAccountIdString] = useState("");
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    AuthClient.create(options.createOptions).then((client) => {
      setAuthClient(client);
    });
  }, []);
  useEffect(() => {
    if (authClient) {
      updateClient(authClient);
    }
  }, [authClient]);

  const login = async (provider) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          updateClient(authClient);
          resolve(authClient);
        } else {
          const opt = getLoginOptions(provider);
          authClient.login({
            ...opt,
            onError: (error) => reject(error),
            onSuccess: () => {
              updateClient(authClient);
              resolve(authClient);
            },
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        reject(error);
      }
    });
  };

  const getLoginOptions = (provider) => {
    switch (provider) {
      case "ii":
        return options.loginOptionsii;
      case "nfid":
        return options.loginOptionsnfid;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setBackendActor(null);
      setAccountId(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // Update client state after authentication
  const updateClient = async (client) => {
    try {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      const identity = client.getIdentity();
      setIdentity(identity);
      const principal1 = identity.getPrincipal();
      setPrincipal(principal1.toString());
      console.log(principal);
      const agent = new HttpAgent({ identity });

      const backendActor = createActor(
        process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND,
        { agent }
      );

      setBackendActor(backendActor);
    } catch (error) {
      console.error("Authentication update error:", error);
    }
  };

  const reloadLogin = async () => {
    try {
      if (
        authClient.isAuthenticated() &&
        !(await authClient.getIdentity().getPrincipal().isAnonymous())
      ) {
        updateClient(authClient);
      }
    } catch (error) {
      console.error("Reload login error:", error);
    }
  };
  return {
    isAuthenticated,
    login,
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    backendActor,
    accountId,
    reloadLogin,
    accountIdString,
  };
};
// Authentication provider component
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  if (!auth.authClient || !auth.backendActor) {
    return null; // Or render a loading indicator
  }
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
// Hook to access authentication context
export const useAuth = () => useContext(AuthContext);
