import { Suspense } from "react";
import { BlitzPage } from "blitz";
import Layout from "app/core/layouts/MainLayout";
import TransactionsTable from "app/transactions/components/TransactionsTable";

export const Transaction = () => {
  return (
    <>
      <header className="mx-4 mt-4">oi</header>
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
