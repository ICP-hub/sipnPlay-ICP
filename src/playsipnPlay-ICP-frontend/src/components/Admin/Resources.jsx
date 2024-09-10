import React, { useEffect, useState } from 'react'
import { useAuth } from "../../utils/useAuthClient";
import { transferApprove } from "../../utils/transApprove";
import toast from 'react-hot-toast';
const Resources = () => {
    const [adminBalance, setAdminBalance] = useState(0);
    const [defaultBalance, setDefaultBalance] = useState(0);
    const [addAmntToBackend, setAddAmntToBackend] = useState(0);
    const [removeAmntFromBackend, setRemoveAmntFromBackend] = useState(0);
    const { backendActor, ledgerActor } = useAuth();

    const formatTokenMetaData = (arr) => {
        const resultObject = {};
        arr.forEach((item) => {
            const key = item[0];
            const value = item[1][Object.keys(item[1])[0]];
            resultObject[key] = value;
        });
        return resultObject;
    };

    const WithdrawMoney = async (e) => {
        e.preventDefault();
        let metaData = null;
        const metadataResponse = await ledgerActor.icrc1_metadata();
        metaData = formatTokenMetaData(metadataResponse);
        const amnt = parseInt(
            Number(removeAmntFromBackend) * Math.pow(10, parseInt(metaData?.["icrc1:decimals"]))
        );
        const response = await backendActor.withdrawMoneyFromDefault(parseInt(amnt));
        if (response.ok) {
            setRemoveAmntFromBackend(0);
            fetchAdminBalance();
            fetchDefaultBalance();
            toast.success("Tokens Withdrawn");
        }
    };

    const addMoney = async (e) => {
        e.preventDefault();
        const res = await transferApprove(
            backendActor,
            ledgerActor,
            addAmntToBackend
        );
        if (res.err) {
            toast.error("Payment Failed");
        } else {
            setAddAmntToBackend(0);
            fetchAdminBalance();
            fetchDefaultBalance();
            toast.success(`balance updated`);
        }
    };

    const fetchAdminBalance = async () => {
        try {
            const response = await backendActor.get_balance();
            if (response) {
                let metaData = null;
                await ledgerActor.icrc1_metadata().then((res) => {
                    metaData = formatTokenMetaData(res);
                })
                    .catch((err) => {
                        console.log(err);
                    });
                let amnt = parseFloat(Number(response) * Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"])));
                setAdminBalance(amnt);
            }
        } catch (error) {
            console.error("Error fetching admin balance:", error);
        }
    };


    const fetchDefaultBalance = async () => {
        try {
            const response = await backendActor.get_backend_balance();
            if (response) {
                let metaData = null;
                await ledgerActor.icrc1_metadata().then((res) => {
                    metaData = formatTokenMetaData(res);
                })
                    .catch((err) => {
                        console.log(err);
                    });
                let amnt = parseFloat(Number(response) * Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"])));
                setDefaultBalance(amnt);
            }
        } catch (error) {
            console.error("Error fetching default balance:", error);
        }
    };
    useEffect(() => {
        fetchAdminBalance();
        fetchDefaultBalance();
    }, []);

    return (
        <>
            <div className="flex justify-around items-center gap-8">
                <div>
                    <form onSubmit={WithdrawMoney}>
                        <input
                            type="number"
                            placeholder="Enter amount to add"
                            value={removeAmntFromBackend === 0 ? '' : removeAmntFromBackend}
                            onChange={(e) =>
                                setRemoveAmntFromBackend(Number(e.target.value))
                            }
                            className="rounded-lg px-3 text-black  h-11 focus:outline-none focus:ring-2 focus:ring-[#ee3ec9]"
                        />
                        <button className="bg-[#EE3EC9] rounded-lg px-4 py-2 ml-3 min-w-24">
                            Withdraw money from Default
                        </button>
                    </form>
                </div>
                <div>
                    <form onSubmit={addMoney}>
                        <input
                            type="number"
                            placeholder="Enter amount to withdraw"
                            value={addAmntToBackend === 0 ? '' : addAmntToBackend}
                            onChange={(e) =>
                                setAddAmntToBackend(Number(e.target.value))
                            }
                            className="rounded-lg px-3 text-black  h-11 focus:outline-none focus:ring-2 focus:ring-[#ee3ec9]"
                        />
                        <button className="bg-[#EE3EC9] rounded-lg px-4 py-2 ml-3 min-w-24">
                            Add Money to Default
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex justify-around h-24 w-full mt-16 gap-16">
                <div className="flex gap-4">
                    <h4 className="font-semibold text-[#ee3ec9]">
                        Admin's Balance:
                    </h4>
                    <span>{Number(adminBalance)}</span>
                </div>
                <div className="flex gap-4">
                    <h4 className="font-semibold text-[#ee3ec9]">
                        Default Balance:
                    </h4>
                    <span>{Number(defaultBalance)}</span>
                </div>
            </div>
        </>
    )
}

export default Resources