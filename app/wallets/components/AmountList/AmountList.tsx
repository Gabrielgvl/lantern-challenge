import { FC, Suspense } from "react";

import getWalletAmounts from "app/wallets/queries/getWalletAmounts";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import AddIcon from "@material-ui/icons/Add";
import { IconButton, Skeleton } from "@material-ui/core";
import MoneyCountup from "app/core/components/MoneyCountup";
import { useQuery } from "blitz";
import SkeletonArray from "app/core/components/SkeletonArray";

interface AmountListProps {
  walletId: string;
}

const List: FC<AmountListProps> = ({ walletId }) => {
  const [wallet] = useQuery(getWalletAmounts, { id: walletId });
  return (
    <>
      {wallet.amount.map((a) => (
        <li
          key={a.id}
          className="rounded border-2 shadow-md border-indigo-900 flex justify-between px-4 py-2 gap-4 flex-wrap items-center"
        >
          <span>{a.currency.symbol}</span>
          <MoneyCountup
            value={a.amount}
            className="flex-1 overflow-ellipsis overflow-hidden block"
          />
          <IconButton size="small">
            <TrendingUpIcon />
          </IconButton>
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </li>
      ))}
    </>
  );
};

const AmountList: FC<AmountListProps> = ({ walletId }) => {
  return (
    <ul className="px-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Suspense
        fallback={
          <SkeletonArray component={<Skeleton variant="rectangular" height="54px" />} length={10} />
        }
      >
        <List walletId={walletId} />
      </Suspense>
    </ul>
  );
};

export default AmountList;
