import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { Name, renewName } from "../lib/web3-config";
import useWeb3Setup from "../hooks/useWeb3Setup";

export default function RenewForm({
  onComplete,
  name,
}: {
  onComplete: () => void;
  name: string;
}) {
  const { nameFee, account } = useWeb3Setup();
  const queryClient = useQueryClient();

  const { mutate, error, isLoading } = useMutation(renewName, {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["names"] });
      const previousValues = queryClient.getQueryData(["names"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["names"], (old) =>
        ((old as Name[]) || []).map((name) =>
          name.name === newData.name ? { ...name, status: "pending" } : name
        )
      );

      return { previousValues };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["names"], context?.previousValues);
    },
    onSettled: onComplete,
  });
  const [numberOfBlocks, setNumberOfBlocks] = useState<number>(0);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberOfBlocks(+e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    console.log({
      name: name,
      numberOfBlocks: numberOfBlocks,
      from: account,
    });
    e.preventDefault();
    if (nameFee && account) {
      mutate({
        name: name,
        numberOfBlocks: numberOfBlocks,
        fee: numberOfBlocks * nameFee,
        from: account,
      });
    }
  };
  return (
    <form className="action_buttons" onSubmit={handleSubmit}>
      <input
        name="numberOfBlocks"
        type="number"
        value={numberOfBlocks}
        required
        min={1}
        onChange={handleChange}
      />
      <button disabled={isLoading}>{isLoading ? "Loading ..." : "Renew"}</button>
      <button className="button--cancel" onClick={onComplete}>
        Close
      </button>
    </form>
  );
}
