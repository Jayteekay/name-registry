import { AbiItem } from "web3-utils";
export const CONTRACT_ADDRESS = "0xf1a0a207ade7db3f4b93f67099f88eccf6660c6a";
export const CONTRACT_ABI: AbiItem[] = [
  {
    inputs: [],
    name: "NAME_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "name", type: "bytes32" }],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegisteredNames",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "name", type: "bytes32" },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct NameRegistry.NameListItem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "names",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "name", type: "bytes32" },
      { internalType: "uint256", name: "numBlocks", type: "uint256" },
    ],
    name: "register",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "registry",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "name", type: "bytes32" },
      { internalType: "uint256", name: "numBlocks", type: "uint256" },
    ],
    name: "renew",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
