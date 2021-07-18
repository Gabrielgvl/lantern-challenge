import { Suspense } from "react";
import { useParam, BlitzPage } from "blitz";
import Layout from "app/core/layouts/MainLayout";
import WalletHeader from "app/wallets/components/WalletHeader";
import AmountList from "app/wallets/components/AmountList";
import DepositForm from "app/wallets/components/DepositForm";

export const Wallet = () => {
  const walletId = useParam("walletId", "string");

  if (!walletId) return null;

  return (
    <>
      <WalletHeader walletId={walletId} />
      <hr className="mx-4" />
      <DepositForm walletId={walletId} />
      <hr className="mx-4" />
      <AmountList walletId={walletId} />
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

ShowWalletPage.authenticate = true;
ShowWalletPage.getLayout = (page) => <Layout title="My Wallet">{page}</Layout>;

export default ShowWalletPage;
