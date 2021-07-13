import { Suspense } from "react";
import { Head, useQuery, useParam, BlitzPage, useMutation } from "blitz";
import { FormTextField } from "app/core/components/FormTextField";
import CurrencySelect from "app/core/components/CurrencySelect";
import Layout from "app/core/layouts/MainLayout";
import getWallet from "app/wallets/queries/getWalletAmounts";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import Form from "app/core/components/Form";
import MoneyCountup from "app/core/components/MoneyCountup";
import { Deposit } from "app/wallets/validations";
import SettingsIcon from "@material-ui/icons/Settings";
import createAmountWallet from "app/wallets/amount-wallets/mutations/createAmountWallet";

export const Wallet = () => {
  const walletId = useParam("walletId", "string");
  const [{ total, defaultCurrency }, { refetch }] = useQuery(
    getWalletTotal,
    { id: walletId },
    { staleTime: 60 * 60 * 1000 }
  );
  const [wallet, { setQueryData }] = useQuery(getWallet, { id: walletId });
  const [createAmount] = useMutation(createAmountWallet);

  return (
    <>
      <Head>
        <title>My Wallet</title>
      </Head>

      <section className="px-4 pt-4 grid grid-cols-3 sm:flex sm:justify-between items-center justify-between">
        <h1 className="text-3xl font-bold w-full sm:w-auto col-span-2">My Wallet</h1>
        <IconButton className="justify-self-end row-span-2 sm:row-span-1 self-center sm:flex-grow sm:justify-self-end sm:order-last">
          <SettingsIcon />
        </IconButton>
        <h2 className="text-xl col-span-2 sm:text-right sm:flex-1">
          Total: <MoneyCountup value={total} currency={defaultCurrency.symbol} />
        </h2>
      </section>
      <hr className="mx-4" />
      <section className="px-4 sm:w-1/2 sm:m-auto">
        <h3 className="text-xl font-bold text-center mb-4">Deposit Money</h3>
        <Form
          onSubmit={async ({ amount, currency }) => {
            if (!walletId) return;

            const newAmount = await createAmount({
              amount,
              currencyId: currency.id,
              walletId: walletId,
            });

            const index = wallet.amount.findIndex((amount) => amount.id === newAmount.id);
            if (index >= 0) {
              setQueryData({
                ...wallet,
                amount: [
                  ...wallet.amount.slice(0, index),
                  { ...newAmount, amount },
                  ...wallet.amount.slice(index + 1, wallet.amount.length),
                ],
              });
            } else {
              setQueryData({
                ...wallet,
                amount: [...wallet.amount, { ...newAmount, amount }],
              });
            }

            refetch();
          }}
          submitText="Deposit"
          schema={Deposit}
          initialValues={{ amount: 0, currency: { description: "", id: "", symbol: "" } }}
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
      <hr className="mx-4" />
      <section className="px-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wallet.amount.map((a) => (
          <article
            key={a.id}
            className="rounded border-2 shadow-md border-indigo-900 flex justify-between px-4 py-2 gap-4 flex-wrap items-center"
          >
            <span>{a.currency.symbol}</span>
            <MoneyCountup
              value={a.amount}
              className="flex-1 overflow-ellipsis overflow-hidden block"
            ></MoneyCountup>
            <IconButton size="small">
              <TrendingUpIcon />
            </IconButton>
            <IconButton size="small">
              <AddIcon />
            </IconButton>
          </article>
        ))}
      </section>
    </>
  );
};

const ShowWalletPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Wallet />
    </Suspense>
  );
};

ShowWalletPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowWalletPage;
