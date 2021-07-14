import { FC } from "react";

import { invalidateQuery, setQueryData, useMutation, useQuery } from "blitz";
import createAmountWallet from "app/wallets/amount-wallets/mutations/createAmountWallet";
import { Deposit } from "app/wallets/validations";
import Form from "app/core/components/Form";
import { FormTextField } from "app/core/components/FormTextField";
import CurrencySelect from "app/core/components/CurrencySelect";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import getWalletAmounts from "app/wallets/queries/getWalletAmounts";

interface DepositFormProps {
  walletId: string;
}

const DepositForm: FC<DepositFormProps> = ({ walletId }) => {
  const [createAmount] = useMutation(createAmountWallet);
  return (
    <section className="px-4 sm:w-1/2 sm:m-auto">
      <h3 className="text-xl font-bold text-center mb-4">Deposit Money</h3>
      <Form
        onSubmit={async ({ amount, currency }, { reset }) => {
          const newAmount = await createAmount({
            amount,
            currencyId: currency.id,
          });

          reset();

          setQueryData(getWalletAmounts, { id: walletId }, (prevWallet) => {
            if (!prevWallet) throw new Error("Wallet is undefined");
            const index = prevWallet.amount.findIndex((amount) => amount.id === newAmount.id);
            if (index >= 0) {
              return {
                ...prevWallet,
                amount: [
                  ...prevWallet.amount.slice(0, index),
                  { ...newAmount, amount },
                  ...prevWallet.amount.slice(index + 1, prevWallet.amount.length),
                ],
              };
            } else {
              return {
                ...prevWallet,
                amount: [...prevWallet.amount, { ...newAmount, amount }],
              };
            }
          });

          await invalidateQuery(getWalletTotal);
        }}
        submitText="Deposit"
        schema={Deposit}
        initialValues={{ amount: 0 }}
      >
        <CurrencySelect name="currency" />
        <FormTextField
          name="amount"
          label="Amount"
          placeholder="Amount"
          type="currency"
          inputProps={{ min: 0, step: 0.01, pattern: /^d+(?:.d{1,2})?$/ }}
        />
      </Form>
    </section>
  );
};

export default DepositForm;
