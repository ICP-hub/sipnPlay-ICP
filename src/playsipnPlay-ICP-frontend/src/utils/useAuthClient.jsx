import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { createLedgerActor } from "../../../declarations/ledger/index";
import { idlFactory, createActor } from "../../../declarations/sipnPlay-ICP-backend/index";
import { idlFactory as ledgerIdlFactory } from "../../../declarations/ledger/index";

const AuthContext = createContext();


export const useAuthClient = () => {
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

  const ledgerCanId = "cjpyu-kqaaa-aaaap-qhyfq-cai";

  const login = async (provider) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (authClient.isAuthenticated() && !(await authClient.getIdentity().getPrincipal().isAnonymous())) {
          updateClient(authClient);
          resolve(authClient);
        } else {
          if (provider === "ii") {
            authClient.login({
              identityProvider: process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#authorize"
                : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
              onError: (error) => reject(error),
              onSuccess: () => {
                updateClient(authClient);
                resolve(authClient);

                const backendActor = createActor(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND, { agentOptions: { identity, verifyQuerySignatures: false } });
                const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
                setLedgerActor(ledgerActor1)
                setBackendActor(backendActor);
              },
            });
          }
          if (provider === "nfid") {
            authClient.login({
              identityProvider:
                process.env.DFX_NETWORK === "ic"
                  ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
                  : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
              onError: (error) => reject(error),
              onSuccess: () => {
                updateClient(authClient);
                resolve(authClient);

                const backendActor = createActor(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND, { agentOptions: { identity, verifyQuerySignatures: false } });
                const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
                setLedgerActor(ledgerActor1)
                setBackendActor(backendActor);
              },
            });
          }
          if (provider === "plug") {
            if (!window.ic?.plug) throw new Error("Plug extension not installed");

            const whitelist = [process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND, ledgerCanId];
            const host = process.env.DFX_NETWORK === "ic" ? "https://icp0.io" : "http://127.0.0.1:4943";
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
              setIsAuthenticated(true);
              const principal = await window.ic.plug.agent.getPrincipal();
              const identity = window.ic.plug.agent;
              setPrincipal(principal);
              setIdentity(identity);
            } else {
              throw new Error("Plug connection refused");
            }
          }

        }
      } catch (error) {
        console.error('Login error:', error);
        reject(error);
      }
    });

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