import { Suspense } from "react";
import { Link, BlitzPage, useMutation, Routes } from "blitz";
import Layout from "app/core/layouts/MainLayout";
import { useCurrentUser } from "app/core/hooks/useCurrentUser";
import CurrencySelect from "app/core/components/CurrencySelect";

const Home: BlitzPage = () => {
  return null;
};

Home.suppressFirstRenderFlicker = true;
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
