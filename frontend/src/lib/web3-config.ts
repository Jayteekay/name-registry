import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/constants";

export interface Name {
  name: string;
  expiresAt: number;
  status?: "pending" | "completed";
}

export const web3 = new Web3(Web3.givenProvider);
export const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export const getCurrentBlock = async () => {
  const response: number = await web3.eth.getBlockNumber();
  return response;
};

export const fetchNameFee = async () => {
  const response: string = await contract.methods.NAME_FEE().call();
  return +response;
};

export const fetchNames = async ({ from }: { from: string }) => {
  const response: Name[] = await contract.methods
    .getRegisteredNames()
    .call({ from });
  return response.map(({ name, expiresAt }) => ({
    name: web3.utils.hexToAscii(name),
    expiresAt,
    status: "complete",
  }));
};

export const registerName = async ({
  name,
  numberOfBlocks,
  fee,
  from,
}: {
  name: string;
  numberOfBlocks: number;
  fee: number;
  from: string;
}) => {
  const bytes32Name = web3.utils.asciiToHex(name);
  const response = await contract.methods
    .register(bytes32Name, numberOfBlocks)
    .send({ from, value: fee });

  return response;
};

export const renewName = async ({
  name,
  numberOfBlocks,
  fee,
  from,
}: {
  name: string;
  numberOfBlocks: number;
  fee: number;
  from: string;
}) => {
  const bytes32Name = web3.utils.asciiToHex(name);
  return contract.methods
    .renew(bytes32Name, numberOfBlocks)
    .send({ from, value: fee });
};

export const cancelRegistration = async ({
  name,
  from,
}: {
  name: string;
  from: string;
}) => {
  const bytes32Name = web3.utils.asciiToHex(name);
  return contract.methods.cancel(bytes32Name).call({ from, value: 0 });
};
