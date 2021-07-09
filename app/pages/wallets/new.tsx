import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz";
import Layout from "app/core/layouts/Layout";
import createWallet from "app/wallets/mutations/createWallet";
import { WalletForm, FORM_ERROR } from "app/wallets/components/WalletForm";

const NewWalletPage: BlitzPage = () => {
  const router = useRouter();
  const [createWalletMutation] = useMutation(createWallet);

  return (
    <div>
      <h1>Create New Wallet</h1>

      <WalletForm
        submitText="Create Wallet"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateWallet}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const wallet = await createWalletMutation(values);
            router.push(Routes.ShowWalletPage({ walletId: wallet.id }));
          } catch (error) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.WalletsPage()}>
          <a>Wallets</a>
        </Link>
      </p>
    </div>
  );
};

NewWalletPage.authenticate = true;
NewWalletPage.getLayout = (page) => <Layout title={"Create New Wallet"}>{page}</Layout>;

export default NewWalletPage;
