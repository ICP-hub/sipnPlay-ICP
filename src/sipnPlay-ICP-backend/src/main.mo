import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
import Types "./Types";
import ICRC "./ICRC";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Region "mo:base/Region";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import List "mo:base/List";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";
import Int64 "mo:base/Int64";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Utils "./Utils";

actor {
	// public type Index = Nat64;

	var userDataRecord = TrieMap.TrieMap<Principal, Types.Index>(Principal.equal, Principal.hash);
	private stable var stableUsers : [(Principal, Types.Index)] = [];
	stable var userDatarecord_state = {
		bytes = Region.new();
		var bytes_count : Nat64 = 0;
		elems = Region.new();
		var elems_count : Nat64 = 0;
	};

	var blackjackBetRecord = TrieMap.TrieMap<Principal, Types.Index>(Principal.equal, Principal.hash);
	private stable var stableblackjackBet : [(Principal, Types.Index)] = [];
	stable var blackjackBet_state = {
		bytes = Region.new();
		var bytes_count : Nat64 = 0;
		elems = Region.new();
		var elems_count : Nat64 = 0;
	};

	var messageDataRecord = TrieMap.TrieMap<Text, Types.Index>(Text.equal, Text.hash);
	private stable var stableMessages : [(Text, Types.Index)] = [];
	stable var messageDataRecord_state = {
		bytes = Region.new();
		var bytes_count : Nat64 = 0;
		elems = Region.new();
		var elems_count : Nat64 = 0;
	};

	var waitlistDataRecord = TrieMap.TrieMap<Text, Types.Index>(Text.equal, Text.hash);
	private stable var stableWaitlist : [(Text, Types.Index)] = [];
	stable var waitlistDataRecord_state = {
		bytes = Region.new();
		var bytes_count : Nat64 = 0;
		elems = Region.new();
		var elems_count : Nat64 = 0;
	};

	// Preupgrade function to store the data in stable memory
	system func preupgrade() {
		stableMessages := Iter.toArray(messageDataRecord.entries());
		stableWaitlist := Iter.toArray(waitlistDataRecord.entries());
		stableUsers := Iter.toArray(userDataRecord.entries());
		stableblackjackBet := Iter.toArray(blackjackBetRecord.entries());
	};

	system func postupgrade() {
		messageDataRecord := TrieMap.fromEntries(stableMessages.vals(), Text.equal, Text.hash);
		waitlistDataRecord := TrieMap.fromEntries(stableWaitlist.vals(), Text.equal, Text.hash);
		userDataRecord := TrieMap.fromEntries(stableUsers.vals(), Principal.equal, Principal.hash);
		blackjackBetRecord := TrieMap.fromEntries(stableblackjackBet.vals(), Principal.equal, Principal.hash);
	};

	let approvedPrincipals: [Text] = [
		"aaaaa-ziaaa-aaaai-aaafq-cai", 
		"bbbbb-ziaaa-aaaai-aaafq-cai"
		]; 

    public func isApproved(caller: Principal): async Bool {
        hasPrivilege(caller, approvedPrincipals);
    };

    private func hasPrivilege(caller: Principal, privileges: [Text]): Bool {
        func toPrincipal(entry: Text) : Principal {
            Principal.fromText(entry);
        };

        let principals: [Principal] = Array.map(privileges, toPrincipal);

        func filterApproved(approved: Principal): Bool {
            approved == caller
        };

        let approved: ?Principal = Array.find(principals, filterApproved);

        switch (approved) {
            case (null) {
                return false;
            };
            case (?approved) {
                return true;
            }
        }
    };

	//Functions********************************

	// *****************************Stable Functions*****************************

	func regionEnsureSizeBytes(r : Region, new_byte_count : Nat64) {
		let pages = Region.size(r);
		if (new_byte_count > pages << 16) {
			let new_pages = ((new_byte_count + ((1 << 16) - 1)) / (1 << 16)) - pages;
			assert Region.grow(r, new_pages) == pages;
		};
	};

	let elem_size = 16 : Nat64;

	func stable_get(index : Types.Index, state : Types.state) : async Blob {
		assert index < state.elems_count;
		let pos = Region.loadNat64(state.elems, index * elem_size);
		let size = Region.loadNat64(state.elems, index * elem_size + 8);
		let elem = { pos; size };
		Region.loadBlob(state.bytes, elem.pos, Nat64.toNat(elem.size));
	};

	func stable_add(blob : Blob, state : Types.state) : async Types.Index {
		let elem_i = state.elems_count;
		state.elems_count += 1;

		let elem_pos = state.bytes_count;
		state.bytes_count += Nat64.fromNat(blob.size());

		regionEnsureSizeBytes(state.bytes, state.bytes_count);
		Region.storeBlob(state.bytes, elem_pos, blob);

		regionEnsureSizeBytes(state.elems, state.elems_count * elem_size);
		Region.storeNat64(state.elems, elem_i * elem_size + 0, elem_pos);
		Region.storeNat64(state.elems, elem_i * elem_size + 8, Nat64.fromNat(blob.size()));
		elem_i;
	};

	func update_stable(index : Types.Index, blob : Blob, state : Types.state) : async Types.Index {
		assert index < state.elems_count;
		let pos = Region.loadNat64(state.elems, index * elem_size);
		let size = Region.loadNat64(state.elems, index * elem_size + 8);
		let elem = { pos; size };
		Region.storeBlob(state.bytes, elem.pos, blob);
		Region.storeNat64(state.elems, index * elem_size + 8, Nat64.fromNat(blob.size()));
		index;
	};

	let CustomLedger = "ent7t-2yaaa-aaaap-qhtcq-cai";
	let payment_address = Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai");

	public shared ({ caller }) func getUser() : async Result.Result<Types.UserData, Text> {
		switch (userDataRecord.get(caller)) {
			case (null) {
				return #err("New user");
			};
			case (?index) {
				let user_blob = await stable_get(index, userDatarecord_state);
				let user_data : ?Types.UserData = from_candid (user_blob);

				switch (user_data) {
					case null {
						throw (Error.reject("Blob not found not the specific index"));
					};
					case (?user) {
						return #ok(user);
					};
				};
			};
		};
	};

	public shared query ({ caller }) func whoAmI2() : async Text {
		return Principal.toText(caller);
	};

	public shared ({ caller }) func createUser(email : Text) : async Text {
		switch (userDataRecord.get(caller)) {
			case (null) {
				let newUser : Types.UserData = {
					id = caller;
					email = email;
				};

				let user_blob = to_candid (newUser);
				let index = await stable_add(user_blob, userDatarecord_state);
				userDataRecord.put(caller, index);
				return "User created!";
			};
			case (?user) {
				return "User already exists";
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

	public shared ({ caller }) func get_balance() : async Nat {
		let ledger = actor (CustomLedger) : ICRC.Token;
		let balance = await ledger.icrc1_balance_of({
			owner = caller;
			subaccount = null;
		});
		return balance;
	};

	public shared ({ caller }) func deductMoney(amount : Nat) : async Result.Result<Text, Text> {
		switch (userDataRecord.get(caller)) {
			case (null) {
				return #err("User not found");
			};
			case (?user) {
				let response : ICRC.Result_2 = await icrc2_transferFrom(CustomLedger, caller, payment_address, amount);
				switch (response) {
					case (#Ok(value)) {
						let transfer : Nat = amount;
						let amount_blob = to_candid (transfer);
						let index = await stable_add(amount_blob, blackjackBet_state);
						blackjackBetRecord.put(caller, index);
						return #ok("Points deducted successfully" # Nat.toText(value));
					};
					case (#Err(e)) {
						throw Error.reject(debug_show (e));
					};
				};

			};
		};
	};

	public shared ({ caller }) func addMoneyToDefault(amount : Nat) : async Result.Result<Text, Text> {
		switch (userDataRecord.get(caller)) {
			case (null) {
				return #err("User not found");
			};
			case (?user) {
				let response : ICRC.Result_2 = await icrc2_transferFrom(CustomLedger, caller, payment_address, amount);
				switch (response) {
					case (#Ok(value)) {
						return #ok("Points added to default successfully" # Nat.toText(value));
					};
					case (#Err(e)) {
						throw Error.reject(debug_show (e));
					};
				};

			};
		};
	};

	public shared ({ caller }) func withdrawMoneyFromDefault(amount : Nat) : async Result.Result<Text, Text> {
		switch (userDataRecord.get(caller)) {
			case (null) {
				return #err("User not a principal");
			};
			case (?user) {
				let ledger = actor (CustomLedger) : ICRC.Token;
				let response : ICRC.Result = await ledger.icrc1_transfer({
					to = {
						owner = caller;
						subaccount = null;
					};
					fee : ?Nat = null;
					memo : ?Blob = null;
					from_subaccount : ?Blob = null;
					created_at_time : ?Nat64 = null;
					amount = amount;
				});
				switch (response) {
					case (#Ok(value)) {

						return #ok("Points Added successfully" # Nat.toText(value));
					};
					case (#Err(e)) {
						throw Error.reject(debug_show (e));
					};
				};
			};
		};
	};

	public shared ({ caller }) func gameLost() : async Result.Result<Text, Text> {
		switch (userDataRecord.get(caller)) {
			case (null) {
				return #err("User not found");
			};
			case (?user) {
				switch (blackjackBetRecord.get(caller)) {
					case (null) {
						return #err("User not found in the bet record");
					};
					case (?betIndex) {
						let zeroReset : Int = 0;
						let zero_blob = to_candid (zeroReset);
						ignore update_stable(betIndex, zero_blob, blackjackBet_state);
						return #ok("Bet Record updated successfully");
					};
				};
			};
		};
	};

	public shared ({ caller }) func addMoney(amount : Nat) : async Result.Result<Text, Text> {
		switch (userDataRecord.get(caller)) {
			case (null) {
				return #err("User not found");
			};
			case (?user) {
				switch (blackjackBetRecord.get(caller)) {
					case (null) {
						return #err("User not found in the bet record");
					};
					case (?betIndex) {
						let bet_blob = await stable_get(betIndex, blackjackBet_state);
						let betAmount : ?Nat = from_candid (bet_blob);
						switch (betAmount) {
							case null {
								throw (Error.reject("Non object found in the stable memory"));
							};
							case (?b) {
								if (Float.fromInt64(Int64.fromNat64(Nat64.fromNat(amount))) > (2.5 * Float.fromInt64(Int64.fromNat64(Nat64.fromNat(b))))) {
									return #err("fraud");
								} else {
									let ledger = actor (CustomLedger) : ICRC.Token;
									let response : ICRC.Result = await ledger.icrc1_transfer({
										to = {
											owner = caller;
											subaccount = null;
										};
										fee : ?Nat = null;
										memo : ?Blob = null;
										from_subaccount : ?Blob = null;
										created_at_time : ?Nat64 = null;
										amount = amount;
									});
									switch (response) {
										case (#Ok(value)) {
											let zeroReset : Int = 0;
											let zero_blob = to_candid (zeroReset);
											ignore update_stable(betIndex, zero_blob, blackjackBet_state);
											return #ok("Points Added successfully" # Nat.toText(value));
										};
										case (#Err(e)) {
											throw Error.reject(debug_show (e));
										};
									};
								};
							};

						};
					};

				};
			};
		};
	};

	public shared func sendMessage(name : Text, email : Text, message : Text) : async Result.Result<Text, Text> {
		if (Text.size(name) == 0 or Text.size(email) == 0 or Text.size(message) == 0) {
			return #err("All fields must be filled");
		};

		let newMessage : Types.MessageData = {
			date = Time.now();
			name = name;
			email = email;
			message = message;
		};
		let message_blob = to_candid (newMessage);
		let index = await stable_add(message_blob, messageDataRecord_state);

		messageDataRecord.put(email, index);
		return #ok("Message sent successfully!");
	};

	public shared func getMessages(chunkSize : Nat, PageNo : Nat) : async Result.Result<{ data : [Types.MessageData]; current_page : Nat; total_pages : Nat }, Text> {
		let index_pages = Utils.paginate<(Text, Types.Index)>(Iter.toArray(messageDataRecord.entries()), chunkSize);

		if (index_pages.size() < PageNo) {
			return #err("Page not found");
		};

		if (index_pages.size() == 0) {
			return #err("No messages found");
		};

		var pages_data = index_pages[PageNo];
		var message_list = List.nil<Types.MessageData>();

		for ((k, v) in pages_data.vals()) {
			let message_blob = await stable_get(v, messageDataRecord_state);
			let user : ?Types.MessageData = from_candid (message_blob);

			switch (user) {
				case null {
					return #err("No blob found in stable memory for the caller");
				};
				case (?val) {
					message_list := List.push(val, message_list);
				};
			};
		};

		return #ok({
			data = List.toArray(message_list);
			current_page = PageNo + 1;
			total_pages = index_pages.size();
		});
	};

	public shared func joinWaitlist(name : Text, email : Text, icpAddress : Text) : async Result.Result<Text, Text> {
		if (Text.size(name) == 0 or Text.size(email) == 0) {
			return #err("Name and email must be filled");
		};

		let newWaitlistEntry : Types.WaitlistData = {
			date = Time.now();
			name = name;
			email = email;
			icpAddress = icpAddress;
		};

		let waitlist_blob = to_candid (newWaitlistEntry);
		let index = await stable_add(waitlist_blob, waitlistDataRecord_state);

		waitlistDataRecord.put(email, index);
		return #ok("Joined the waitlist successfully!");
	};

	public shared func getWaitlist(chunkSize : Nat, PageNo : Nat) : async Result.Result<{ data : [Types.WaitlistData]; current_page : Nat; total_pages : Nat }, Text> {
		let index_pages = Utils.paginate<(Text, Types.Index)>(Iter.toArray(waitlistDataRecord.entries()), chunkSize);

		if (index_pages.size() < PageNo) {
			return #err("Page not found");
		};

		if (index_pages.size() == 0) {
			return #err("No members found");
		};

		var pages_data = index_pages[PageNo];
		var waitlist_list = List.nil<Types.WaitlistData>();

		for ((k, v) in pages_data.vals()) {
			let waitlist_blob = await stable_get(v, waitlistDataRecord_state);
			let user : ?Types.WaitlistData = from_candid (waitlist_blob);

			switch (user) {
				case null {
					return #err("No blob found in stable memory for the caller");
				};
				case (?val) {
					waitlist_list := List.push(val, waitlist_list);
				};
			};
		};

		return #ok({
			data = List.toArray(waitlist_list);
			current_page = PageNo + 1;
			total_pages = index_pages.size();
		});
	};

};
