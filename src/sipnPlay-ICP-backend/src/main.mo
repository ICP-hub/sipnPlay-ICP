import Principal "mo:base/Principal";

import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import UserTypes "./Types";

actor{
    var userDataRecord = TrieMap.TrieMap<Principal, UserTypes.UserData>(Principal.equal, Principal.hash);

    public shared ({caller}) func createUser(userData: UserTypes.UserCreationInput): async Text{

        switch(userDataRecord.get(caller)) {
            case(null) {
                let newUser:UserTypes.UserData={
                    id=caller;
                    name=userData.name;
                    email=userData.email;
                    points=1000;
                };
            userDataRecord.put(caller,newUser);

             return "User created!";
            };
            case(?user) {
                return "chala jaa bhosdike"
            };
        };

    };
    public query func add(name:Text): async Text{
        return name;
    }
}