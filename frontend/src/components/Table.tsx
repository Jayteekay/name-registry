import { useQuery } from "@tanstack/react-query";
import { fetchNames } from "../lib/web3-config";
import RowActions from "./RowActions";
import useWeb3Setup from "../hooks/useWeb3Setup";

export default function () {
  const { account } = useWeb3Setup();
  const { isLoading, data } = useQuery({
    queryKey: ["names"],
    queryFn: () => (account ? fetchNames({ from: account }) : null),
  });

  if (isLoading && !data) return <div>Loading...</div>;
  return (
    <table>
      <thead>
        <th></th>
        <th>Name</th>
        <th>Expiry Block</th>
        <th>Status</th>
        <th>Actions</th>
      </thead>
      <tbody>
        {data?.map(({ name, expiresAt, status }, index) => (
          <tr key={name}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{expiresAt}</td>
            <td>{status}</td>
            <td>
              <RowActions name={name} status={status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
