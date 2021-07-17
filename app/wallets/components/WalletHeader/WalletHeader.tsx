import { FC, Suspense } from "react";

import { useQuery } from "blitz";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import useModal from "app/core/hooks/useModal";
import WalletConfigModal from "../WalletConfigModal";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import MoneyCountup from "app/core/components/MoneyCountup";
import { Skeleton } from "@material-ui/core";

interface WalletHeaderProps {
  walletId: string;
}

interface TotalFieldProps extends WalletHeaderProps {
  isOpen: boolean;
  closeModal: () => void;
}

const TotalField: FC<TotalFieldProps> = ({ walletId, isOpen, closeModal }) => {
  const [{ total, defaultCurrency }] = useQuery(
    getWalletTotal,
    { id: walletId },
    { staleTime: 60 * 60 * 1000 }
  );

  return (
    <>
      <WalletConfigModal
        open={isOpen}
        handleClose={closeModal}
        walletId={walletId}
        currenctCurrency={defaultCurrency}
      />
      <MoneyCountup value={total} currency={defaultCurrency.symbol} />
    </>
  );
};

const WalletHeader: FC<WalletHeaderProps> = ({ walletId }) => {
  const { isOpen, toggleModal, closeModal } = useModal();

  return (
    <hgroup className="px-4 pt-4 grid grid-cols-3 sm:flex sm:justify-between items-center justify-between">
      <h1 className="text-3xl font-bold w-full sm:w-auto col-span-2">My Wallet</h1>
      <IconButton
        onClick={toggleModal}
        className="justify-self-end row-span-2 sm:row-span-1 self-center sm:flex-grow sm:justify-self-end sm:order-last"
      >
        <SettingsIcon />
      </IconButton>
      <h2 className="text-xl col-span-2 sm:text-right sm:flex-1 sm:justify-end flex gap-1 items-center">
        <span>Total:</span>
        <Suspense fallback={<Skeleton className="flex w-20" />}>
          <TotalField walletId={walletId} isOpen={isOpen} closeModal={closeModal} />
        </Suspense>
      </h2>
    </hgroup>
  );
};

export default WalletHeader;
