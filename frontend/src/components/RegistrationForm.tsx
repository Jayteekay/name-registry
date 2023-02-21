import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Name, registerName } from "../lib/web3-config";
import useWeb3Setup from "../hooks/useWeb3Setup";

type FormValues = {
  name: string;
  numberOfBlocks: number;
};

export default function RegistrationForm() {
  const { nameFee, account } = useWeb3Setup();
  
  const queryClient = useQueryClient();
  const { mutate, error, isLoading } = useMutation(registerName, {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["names"] });
      const previousValues = queryClient.getQueryData(["names"]);
      queryClient.setQueryData(["names"], (old) => [
        ...((old as Name[]) || []),
        { name: newData.name, expiresAt: 0, status: "pending" },
      ]);
      return { previousValues };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["names"], context?.previousValues);
    },
  });

  const [values, setValues] = useState<FormValues>({
    name: "",
    numberOfBlocks: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (account && nameFee) {
      mutate({
        name: values.name,
        numberOfBlocks: values.numberOfBlocks,
        fee: values.numberOfBlocks * nameFee,
        from: account,
      });
    }
    setValues({ name: "", numberOfBlocks: 0 });
  };

  useEffect(() => {
    error && alert((error as { message: string }).message);
  }, [error]);

  return (
    <form className="registration_form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        name="name"
        type="text"
        value={values.name}
        required
        onChange={handleChange}
      />

      <label htmlFor="numberOfBlocks">Number of Blocks</label>
      <input
        name="numberOfBlocks"
        type="number"
        value={values.numberOfBlocks}
        required
        min={1}
        onChange={handleChange}
      />

      <button disabled={isLoading}>{isLoading ? "Loading ..." : "Register"}</button>
    </form>
  );
}
