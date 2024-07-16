import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
import UserTypes "./Types";

actor {
    var userDataRecord = TrieMap.TrieMap<Principal, UserTypes.UserData>(Principal.equal, Principal.hash);

    public shared query ({caller}) func getUser(): async Result.Result<UserTypes.UserData, Text> {
        switch (userDataRecord.get(caller)) {
            case (null) {
                return #err("New user");
            };
            case (?user) {
                return #ok(user);
            };
        };
    };

    public shared query ({caller}) func whoAmI2(): async Text {
        return Principal.toText(caller);
    };

    public shared ({caller}) func createUser(userData: UserTypes.UserCreationInput): async Text {
        switch (userDataRecord.get(caller)) {
            case (null) {
                let newUser: UserTypes.UserData = {
                    id = caller;
                    name = userData.name;
                    email = userData.email;
                    phoneNo= userData.phoneNo;
                    points = 1000;
                };
                userDataRecord.put(caller, newUser);
                return "User created!";
            };
            case (?user) {
                return "User already exists";
            };
        };
    };
    public shared ({caller}) func deductPoints(): async Result.Result<UserTypes.UserData, Text> {
        switch (userDataRecord.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?user) {
                if (user.points >= 200) {
                    let newUser: UserTypes.UserData = {
                        id = caller;
                        name = user.name;
                        email = user.email;
                        phoneNo= user.phoneNo;
                        points = user.points -200;
                    };
                    ignore userDataRecord.replace(caller, newUser);
                    return #ok(newUser);
                } else {
                    return #err("Not enough points to deduct");
                }
            };
        };
    };
}
