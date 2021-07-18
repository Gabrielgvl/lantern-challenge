import { BlitzPage, useMutation, Routes } from "blitz";
import Layout from "app/core/layouts/MainLayout";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import ImportExportIcon from "@material-ui/icons/ImportExport";

const Home: BlitzPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold">Welcome to Lantern Wallet</h1>
      <hr />
      <section className="text-lg flex flex-col gap-4">
        <p>To access your wallet, first authenticate in the top-right button.</p>
        <p>
          Once authenticated, you can access your wallet in the sidebar menu. This icon will appear
          in the top-left: <MenuIcon />
        </p>
        <p>
          In the wallet, you can change your default currency by clicking on this icon next to the
          total amount: <SettingsIcon />
        </p>
        <p>
          You may deposit money to any currency in the form bellow. Once deposited, the value show
          appear under the form.
        </p>
        <p>
          You may exchange currencies by clicking on the <ImportExportIcon /> of each amount you
          have.
        </p>
        <p>
          Finnaly, you can see all your transactions by clicking on the Transactions item in
          sidebar.
        </p>
      </section>
    </>
  );
};

Home.suppressFirstRenderFlicker = true;
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
