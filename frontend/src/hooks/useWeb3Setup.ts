import { useContext } from "react";
import { Web3Context } from "../contexts/Web3ContextProvider";

export default function useWeb3Setup() {
  const context = useContext(Web3Context);
  return context;
}
