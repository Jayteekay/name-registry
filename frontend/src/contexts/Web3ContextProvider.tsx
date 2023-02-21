import { createContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNameFee, getCurrentBlock, web3 } from "../lib/web3-config";

interface IWeb3Context {
  accounts: string[];
  nameFee?: number;
  currentBlock?: number;
  account: string | null;
  setAccount: (account: string) => void;
}

export const Web3Context = createContext<IWeb3Context>({
  accounts: [],
  account: null,
  setAccount: () => null,
});

export default function Web3ContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [account, setAccount] = useState<string | null>(null);

  const { data: nameFee } = useQuery({
    queryKey: ["name_fee"],
    queryFn: fetchNameFee,
  });
  const { data: currentBlock } = useQuery({
    queryKey: ["current_block"],
    queryFn: getCurrentBlock,
  });

  useEffect(() => {
    accounts?.length && setAccount(accounts[0]);
  }, [accounts]);

  useEffect(() => {
    web3.eth.requestAccounts().then((items) => {
      setAccounts(items);
    });
  }, []);

  return (
    <Web3Context.Provider
      value={{
        accounts,
        currentBlock,
        nameFee,
        account,
        setAccount,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
