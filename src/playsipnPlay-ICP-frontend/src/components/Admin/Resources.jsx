import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/useAuthClient";
import { transferApprove } from "../../utils/transApprove";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
const Resources = () => {
  const [adminBalance, setAdminBalance] = useState(0);
  const [defaultBalance, setDefaultBalance] = useState(0);
  const [addAmntToBackend, setAddAmntToBackend] = useState(0);
  const [removeAmntFromBackend, setRemoveAmntFromBackend] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
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
    setIsWithdrawing(true);
    try {
      const metadataResponse = await ledgerActor.icrc1_metadata();
      metaData = formatTokenMetaData(metadataResponse);
      const amnt = parseInt(
        Number(removeAmntFromBackend) *
        Math.pow(10, parseInt(metaData?.["icrc1:decimals"]))
      );
      const response = await backendActor.withdraw_money_from_default(
        parseInt(amnt)
      );
      if (response.Ok) {
        setRemoveAmntFromBackend(0);
        fetchAdminBalance();
        fetchDefaultBalance();
        toast.success("Tokens Withdrawn");
      }else{
        toast.error(response.Err);
        console.log(response.Err)
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const addMoney = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await transferApprove(
        backendActor,
        ledgerActor,
        addAmntToBackend,
        true
      );
      console.log("add money", res)

      if (res.Err) {
        console.log(res.Err);
      } else {
        setAddAmntToBackend(0);
        fetchAdminBalance();
        fetchDefaultBalance();
        toast.success(`balance updated`);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const fetchAdminBalance = async () => {
    setIsLoading(true);
    try {
      const response = await backendActor.get_caller_balance();
      if (response) {
        let metaData = null;
        await ledgerActor
          .icrc1_metadata()
          .then((res) => {
            metaData = formatTokenMetaData(res);
          })
          .catch((err) => {
            console.log(err);
          });
        let amnt = parseFloat(
          Number(response.Ok) *
          Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]))
        );
        setAdminBalance(amnt);
      }
    } catch (error) {
      console.error("Error fetching admin balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDefaultBalance = async () => {
    setIsLoading(true);
    try {
      const response = await backendActor.get_backend_balance();
      if (response) {
        let metaData = null;
        await ledgerActor
          .icrc1_metadata()
          .then((res) => {
            metaData = formatTokenMetaData(res);
          })
          .catch((err) => {
            console.log(err);
          });
        let amnt = parseFloat(
          Number(response.Ok) *
          Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]))
        );
        setDefaultBalance(amnt);
      }
    } catch (error) {
      console.error("Error fetching default balance:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAdminBalance();
    fetchDefaultBalance();
  }, []);

  return (
    <>
      {isLoading ? (
        <Oval
          visible={isLoading}
          height={50}
          width={50}
          ariaLabel="oval-loading"
          color="#ee3ec9"
          secondaryColor="#333"
          strokeWidth={2}
          strokeWidthSecondary={2}
          wrapperClass="flex justify-center items-center"
        />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-center lg:justify-around items-center gap-8 text-xs sm:text-sm md:text-md lg:text-lg">
            <div className="flex flex-col lg:flex-row justify-center lg:justify-around items-center gap-8">
              <form onSubmit={WithdrawMoney}>
                <input
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={
                    removeAmntFromBackend === 0 ? "" : removeAmntFromBackend
                  }
                  onChange={(e) =>
                    setRemoveAmntFromBackend(Number(e.target.value))
                  }
                  className="rounded-lg px-3 text-black h-11 focus:outline-none focus:ring-2 focus:ring-[#ee3ec9]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#EE3EC9] rounded-lg px-4 py-2 ml-3 min-w-24"
                >
                  {isWithdrawing ? <Oval
                    visible={isWithdrawing}
                    height={24}
                    width={24}
                    ariaLabel="oval-loading"
                    color="#ffffff"
                    secondaryColor="#333"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                    wrapperClass="flex justify-center items-center"
                  /> : "Withdraw money from Backend"}

                </button>
              </form>
            </div>
            <div className="flex flex-col lg:flex-row justify-center lg:justify-around items-center gap-8">
              <form onSubmit={addMoney}>
                <input
                  type="number"
                  placeholder="Enter amount to add"
                  value={addAmntToBackend === 0 ? "" : addAmntToBackend}
                  onChange={(e) => setAddAmntToBackend(Number(e.target.value))}
                  className="rounded-lg px-3 text-black h-11 focus:outline-none focus:ring-2 focus:ring-[#ee3ec9]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#EE3EC9] rounded-lg px-4 py-2 ml-3 min-w-24"
                >
                  {isAdding ? <Oval
                    visible={isAdding}
                    height={24}
                    width={24}
                    ariaLabel="oval-loading"
                    color="#ffffff"
                    secondaryColor="#333"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                    wrapperClass="flex justify-center items-center"
                  /> : "Add Money to Backend"}
                </button>
              </form>
            </div>
          </div>
          <div className="flex justify-around h-24 w-full mt-16 gap-16">
            <div className="flex gap-4">
              <h4 className="font-semibold text-[#ee3ec9]">Admin's Balance:</h4>
              <span>{Number(adminBalance)}</span>
            </div>
            <div className="flex gap-4">
              <h4 className="font-semibold text-[#ee3ec9]">Default Balance:</h4>
              <span>{Number(defaultBalance)}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Resources;
