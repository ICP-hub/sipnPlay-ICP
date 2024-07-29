import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
import UserTypes "./Types";
import ICRC "./ICRC";
import Nat "mo:base/Nat";

actor {
    var userDataRecord = TrieMap.TrieMap<Principal, UserTypes.UserData>(Principal.equal, Principal.hash);
    var messageDataRecord = TrieMap.TrieMap<Principal, UserTypes.MessageData>(Principal.equal, Principal.hash);
    var waitlistDataRecord = TrieMap.TrieMap<Principal, UserTypes.WaitlistData>(Principal.equal, Principal.hash);

    let icpLedger = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    let payment_address = Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai");

    public shared query ({ caller }) func getUser() : async Result.Result<UserTypes.UserData, Text> {
        switch (userDataRecord.get(caller)) {
            case (null) {
                return #err("New user");
            };
            case (?user) {
                return #ok(user);
            };
        };
    };

    public shared query ({ caller }) func whoAmI2() : async Text {
        return Principal.toText(caller);
    };

    public shared ({ caller }) func createUser(userData : UserTypes.UserCreationInput) : async Text {
        switch (userDataRecord.get(caller)) {
            case (null) {
                let newUser : UserTypes.UserData = {
                    id = caller;
                    name = userData.name;
                    email = userData.email;
                    phoneNo = userData.phoneNo;
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

    public shared ({ caller }) func deductPoints() : async Result.Result<UserTypes.UserData, Text> {
        switch (userDataRecord.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?user) {
                if (user.points >= 200) {
                    let newUser : UserTypes.UserData = {
                        id = caller;
                        name = user.name;
                        email = user.email;
                        phoneNo = user.phoneNo;
                        points = user.points - 200;
                    };
                    ignore userDataRecord.replace(caller, newUser);
                    return #ok(newUser);
                } else {
                    return #err("Not enough points to deduct");
                };
            };
        };
    };

    func icrc2_transferFrom(ledgerId : Text, transferfrom : Principal, transferto : Principal, amount : Nat) : async ICRC.Result_2 {
        let ledger = actor (ledgerId) : ICRC.Token;
        await ledger.icrc2_transfer_from({
            spender_subaccount = null;
            from = { owner = transferfrom; subaccount = null };
            to = { owner = transferto; subaccount = null };
            amount;
            fee = null;
            memo = null;
            created_at_time = null;
        });
    };

    public shared ({ caller }) func place_order(amount : Nat) : async Result.Result<Text, Text> {
        switch (userDataRecord.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?user) {
                let response : ICRC.Result_2 = await icrc2_transferFrom(icpLedger, caller, payment_address, amount);
                switch (response) {
                    case (#Ok(value)) {
                        let newPoints = user.points + (amount * 100);
                        let updatedUser : UserTypes.UserData = {
                            id = user.id;
                            name = user.name;
                            email = user.email;
                            phoneNo = user.phoneNo;
                            points = newPoints;
                        };
                        userDataRecord.put(caller, updatedUser);
                        return #ok("Order placed successfully, points updated" # Nat.toText(value));
                    };
                    case (#Err(e)) {
                        return #err("Payment error ");
                    };
                };

            };
        };

    };

    public shared ({ caller }) func sendMessage(name : Text, email : Text, message : Text) : async Result.Result<Text, Text> {
        if (Text.size(name) == 0 or Text.size(email) == 0 or Text.size(message) == 0) {
            return #err("All fields must be filled");
        };
        
        let newMessage : UserTypes.MessageData = {
            name = name;
            email = email;
            message = message;
        };
        messageDataRecord.put(caller, newMessage);
        return #ok("Message sent successfully!");
    };

    public shared ({ caller }) func joinWaitlist(name : Text, email : Text, icpAddress : Text) : async Result.Result<Text, Text> {
        if (Text.size(name) == 0 or Text.size(email) == 0) {
            return #err("Name and email must be filled");
        };
        
        let newWaitlistEntry : UserTypes.WaitlistData = {
            name = name;
            email = email;
            icpAddress = icpAddress;
        };
        waitlistDataRecord.put(caller, newWaitlistEntry);
        return #ok("Joined the waitlist successfully!");
    };
};
