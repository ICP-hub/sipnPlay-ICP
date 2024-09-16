import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createLedgerActor } from "../../../declarations/ledger/index";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";
import { idlFactory, createActor } from "../../../declarations/sipnPlay-ICP-backend/index";
import { idlFactory as ledgerIdlFactory } from "../../../declarations/ledger/index";
// Create a React context for authentication state
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
        : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
  }
};


// Custom hook to manage authentication with Internet Identity
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [ledgerActor, setLedgerActor] = useState(null);

  useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
    });
  }, []);

  useEffect(() => {
    if (authClient) {
      updateClient(authClient);
    }
  }, [authClient]);

  const whitelist = [process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND];

  const ledgerCanId = "cjpyu-kqaaa-aaaap-qhyfq-cai";

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

  const login = async (provider) => {
    if (process.env.DFX_NETWORK === "ic") {
      return new Promise(async (resolve, reject) => {
        try {
          if (await authClient.isAuthenticated() && !(await authClient.getIdentity().getPrincipal().isAnonymous())) {
            updateClient(authClient);
            resolve(authClient);
          } else {
            let userObject = {
              principal: "Not Connected.",
              agent: undefined,
              provider: "",
            };
            if (provider === "plug") {
              userObject = await PlugLogin();
              console.log("plug provider", userObject);
            } else if (provider === "stoic") {
              userObject = await StoicLogin();
            } else if (provider === "nfid") {
              userObject = await NFIDLogin();
            } else if (provider === "ii") {
              userObject = await IdentityLogin();
            }

            const identity = await userObject.agent._identity;
            const principal = Principal.fromText(userObject.principal);

            if (provider === "plug") {
              const host = process.env.DFX_NETWORK === "ic" ? userObject.agent._host : "http://127.0.0.1:4943";
              const isConnected = await window.ic.plug.requestConnect({ whitelist, host });
              if (isConnected) {
                const userActor = await window.ic.plug.createActor({
                  canisterId: process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND,
                  interfaceFactory: idlFactory
                });
                const EXTActor = await window.ic.plug.createActor({
                  canisterId: ledgerCanId,
                  interfaceFactory: ledgerIdlFactory
                })
                setBackendActor(userActor);
                setLedgerActor(EXTActor);
              } else {
                throw new Error("Plug connection refused");
              }
            }
            else {
              const agent = new HttpAgent({ identity });

              const backendActor = createActor(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND, { agentOptions: { identity, verifyQuerySignatures: false } });
              const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
              setLedgerActor(ledgerActor1)
              setBackendActor(backendActor);
            }

            console.log(principal.toString())
            setPrincipal(principal.toString())
            setIdentity(identity);
            setIsAuthenticated(true);

          }
        } catch (error) {
          console.error('Login error:', error);
          reject(error);
        }
      });
    }
    else {
      return new Promise(async (resolve, reject) => {
        try {
          if (authClient.isAuthenticated() && !(await authClient.getIdentity().getPrincipal().isAnonymous())) {
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
          console.error('Login error:', error);
          reject(error);
        }
      });
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

      const backendActor = createActor(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND, { agentOptions: { identity, verifyQuerySignatures: false } });
      const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
      setLedgerActor(ledgerActor1)
      setBackendActor(backendActor);

    } catch (error) {
      console.error("Authentication update error:", error);
    }
  };


  const reloadLogin = async () => {
    try {
      if (authClient.isAuthenticated() && !(await authClient.getIdentity().getPrincipal().isAnonymous())) {
        console.log("Called");
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
    ledgerActor,
    reloadLogin,
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