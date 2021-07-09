import { Suspense } from "react";
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz";
import Layout from "app/core/layouts/Layout";
import getWallet from "app/wallets/queries/getWallet";
import deleteWallet from "app/wallets/mutations/deleteWallet";

export const Wallet = () => {
  const router = useRouter();
  const walletId = useParam("walletId", "number");
  const [deleteWalletMutation] = useMutation(deleteWallet);
  const [wallet] = useQuery(getWallet, { id: walletId });

  return (
    <>
      <Head>
        <title>Wallet {wallet.id}</title>
      </Head>

      <div>
        <h1>Wallet {wallet.id}</h1>
        <pre>{JSON.stringify(wallet, null, 2)}</pre>

        <Link href={Routes.EditWalletPage({ walletId: wallet.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWalletMutation({ id: wallet.id });
              router.push(Routes.WalletsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowWalletPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.WalletsPage()}>
          <a>Wallets</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Wallet />
      </Suspense>
    </div>
  );
};

ShowWalletPage.authenticate = true;
ShowWalletPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowWalletPage;
