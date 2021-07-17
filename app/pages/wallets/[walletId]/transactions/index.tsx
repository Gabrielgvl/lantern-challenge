import { Suspense } from "react";
import { BlitzPage } from "blitz";
import Layout from "app/core/layouts/MainLayout";
import TransactionsTable from "app/transactions/components/TransactionsTable";

export const Transaction = () => {
  return (
    <>
      <hgroup className="mx-4 mt-4">
        <h1 className="text-3xl font-bold w-full sm:w-auto col-span-2">My Wallet</h1>
      </hgroup>
      <hr className="mx-4" />
      <TransactionsTable />
    </>
  );
};

const ShowTransactionsPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Transaction />
    </Suspense>
  );
};

ShowTransactionsPage.getLayout = (page) => <Layout title="Transactions">{page}</Layout>;

export default ShowTransactionsPage;
