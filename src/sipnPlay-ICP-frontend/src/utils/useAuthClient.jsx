import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createActor, sipnPlay_ICP_backend } from "../../../declarations/sipnPlay-ICP-backend/index";
import { createLedgerActor } from "../../../declarations/ledger/index";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";

// Create a React context for authentication state
const AuthContext = createContext();


// Custom hook to manage authentication with Internet Identity
export const useAuthClient = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountIdString, setAccountIdString] = useState("");
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

  const login = async (provider) => {
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
          if (process.env.DFX_NETWORK === "ic") {
            if (provider === "plug") {
              userObject.provider = "https://mainnet.plugwallet.ooo";
              userObject = await PlugLogin();
            } else if (provider === "stoic") {
              userObject.provider = "https://www.stoicwallet.com";
              userObject = await StoicLogin();
            } else if (provider === "nfid") {
              userObject.provider = "https://wallet.nfid.one";
              userObject = await NFIDLogin();
            } else if (provider === "ii") {
              userObject.provider = "https://identity.ic0.app/#authorize";
              userObject = await IdentityLogin();
            }
          } else if (process.env.DFX_NETWORK === "local") {
            if (provider === "plug") {
              userObject.provider = "http://localhost:8080";
              userObject = await PlugLogin();
            } else if (provider === "stoic") {
              userObject.provider = "http://localhost:8700";
              userObject = await StoicLogin();
            } else if (provider === "nfid") {
              userObject.provider = "http://localhost:8500";
              userObject = await NFIDLogin();
            } else if (provider === "ii") {
              userObject.provider = "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8000/#authorize";
              userObject = await IdentityLogin();
              console.log(userObject);

            }
          } else {

          }
          const identity = await userObject.agent._identity;
          console.log(identity)
          const principal = Principal.fromText(userObject.principal);
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

      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());
      console.log('principal', principal.toString());

      const agent = new HttpAgent({ identity });

      const backendActor = createActor(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND, { agentOptions: { identity, verifyQuerySignatures: false } });
      const ledgerActor1 = createLedgerActor("br5f7-7uaaa-aaaaa-qaaca-cai", { agent });
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