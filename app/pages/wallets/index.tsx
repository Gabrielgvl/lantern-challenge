import { Suspense } from "react";
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz";
import Layout from "app/core/layouts/Layout";
import getWallets from "app/wallets/queries/getWallets";

const ITEMS_PER_PAGE = 100;

export const WalletsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ wallets, hasMore }] = usePaginatedQuery(getWallets, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            <Link href={Routes.ShowWalletPage({ walletId: wallet.id })}>
              <a>{wallet.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const WalletsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Wallets</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewWalletPage()}>
            <a>Create Wallet</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <WalletsList />
        </Suspense>
      </div>
    </>
  );
};

WalletsPage.authenticate = true;
WalletsPage.getLayout = (page) => <Layout>{page}</Layout>;

export default WalletsPage;
