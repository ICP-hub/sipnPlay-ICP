import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Region "mo:base/Region";
import Time "mo:base/Time";
module {
    public type Index = Nat64;

    public type Elem = {
        pos : Nat64;
        size : Nat64;
    };

    public type state = {
        bytes : Region.Region;
        var bytes_count : Nat64;
        elems : Region.Region;
        var elems_count : Nat64;
    };

    public type UserData = {
        id : Principal;
        name : Text;
        email : Text;
        phoneNo : Nat;
        points : Nat;
    };
    public type UserCreationInput = {
        name : Text;
        email : Text;
        phoneNo : Nat;
    };

    public type MessageData = {
        date : Int;
        name : Text;
        email : Text;
        message : Text;
    };

    public type WaitlistData = {
        date: Int;
        name : Text;
        email : Text;
        icpAddress : Text;
    };

};
