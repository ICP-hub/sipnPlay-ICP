import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
module{
    public type UserData = {
        id : Principal;
        name: Text;
        email: Text;
        phoneNo: Nat;
        points:Nat;
    };
    public type UserCreationInput={
        name: Text;
        email: Text;
        phoneNo: Nat;
    }
}