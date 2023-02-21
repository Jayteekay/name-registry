import useWeb3Setup from "./hooks/useWeb3Setup";
import RegistrationForm from "./components/RegistrationForm";
import { ChangeEvent } from "react";
import Table from "./components/Table";

export default function App() {
  const { accounts, currentBlock, nameFee, account, setAccount } =
    useWeb3Setup();

  return (
    <main>
      <h2>Name Registration</h2>
      {accounts && (
        <>
          <label htmlFor="select-account">Select Account:</label>
          <select
            value={account || ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setAccount(e.target.value)
            }
          >
            {accounts.map((account) => (
              <option key={account.toString()}>{account.toString()}</option>
            ))}
          </select>
        </>
      )}
      {account ? (
        <div className="container">
          <div className="user_names">
            <h4>Register a new name</h4>
            <RegistrationForm />
          </div>
          <div className="contract_data">
            <h4>Fee Per Block: {!!nameFee && `${nameFee} wei`} </h4>
            <h4>Current Block: {currentBlock}</h4>
            <Table />
          </div>
        </div>
      ) : (
        <p>Select an account to continue</p>
      )}
    </main>
  );
}
