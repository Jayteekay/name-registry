import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import RenewForm from "./RenewForm";
import { cancelRegistration, Name } from "../lib/web3-config";
import useWeb3Setup from "../hooks/useWeb3Setup";

export default function RowActions({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  const [showRenewForm, setShowRenewForm] = useState(false);

  const { account } = useWeb3Setup();

  const queryClient = useQueryClient();
  const { mutate: cancel } = useMutation(cancelRegistration, {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["names"] });
      const previousValues = queryClient.getQueryData(["names"]);
      queryClient.setQueryData(["names"], (old) =>
        ((old as Name[]) || []).filter((name) => name.name !== newData.name)
      );
      return { previousValues };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["names"], context?.previousValues);
    },
  });

  const handleHideForm = () => {
    setShowRenewForm(false);
  };

  const handleShowForm = () => {
    setShowRenewForm(true);
  };
  const handleCancel = () => {
    if (account) cancel({ name, from: account });
  };

  if (status === "pending") {
    return null;
  }
  return (
    <>
      {showRenewForm ? (
        <RenewForm onComplete={handleHideForm} name={name} />
      ) : (
        <div className="action_buttons">
          <button onClick={handleShowForm}>Renew</button>
          <button onClick={handleCancel} className="button--cancel">
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
