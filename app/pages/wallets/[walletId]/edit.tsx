import { Suspense } from "react";
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz";
import Layout from "app/core/layouts/Layout";
import getWallet from "app/wallets/queries/getWallet";
import updateWallet from "app/wallets/mutations/updateWallet";
import { WalletForm, FORM_ERROR } from "app/wallets/components/WalletForm";

export const EditWallet = () => {
  const router = useRouter();
  const walletId = useParam("walletId", "number");
  const [wallet, { setQueryData }] = useQuery(
    getWallet,
    { id: walletId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateWalletMutation] = useMutation(updateWallet);

  return (
    <>
      <Head>
        <title>Edit Wallet {wallet.id}</title>
      </Head>

      <div>
        <h1>Edit Wallet {wallet.id}</h1>
        <pre>{JSON.stringify(wallet)}</pre>

        <WalletForm
          submitText="Update Wallet"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateWallet}
          initialValues={wallet}
          onSubmit={async (values) => {
            try {
              const updated = await updateWalletMutation({
                id: wallet.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowWalletPage({ walletId: updated.id }));
            } catch (error) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditWalletPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWallet />
      </Suspense>

      <p>
        <Link href={Routes.WalletsPage()}>
          <a>Wallets</a>
        </Link>
      </p>
    </div>
  );
};

EditWalletPage.authenticate = true;
EditWalletPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditWalletPage;
