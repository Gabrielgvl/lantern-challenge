import { FC } from "react";
import ModalForm from "app/core/components/ModalForm";
import CurrencySelect from "app/core/components/CurrencySelect";
import { invalidateQuery, useMutation } from "blitz";
import updateWallet from "app/wallets/mutations/updateWallet";
import { WalletConfig } from "app/wallets/validations";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import { Currency } from "db";

interface WalletConfigModalProps {
  open: boolean;
  handleClose: () => void;
  walletId: string;
  currenctCurrency: Currency;
}

const WalletConfigModal: FC<WalletConfigModalProps> = ({
  open,
  handleClose,
  walletId,
  currenctCurrency,
}) => {
  const [update] = useMutation(updateWallet);
  return (
    <ModalForm
      open={open}
      handleClose={handleClose}
      title="My Wallet Options"
      onSubmit={async ({ defaultCurrency }) => {
        await update({ id: walletId, currencyId: defaultCurrency.id });
        await invalidateQuery(getWalletTotal);
        handleClose();
      }}
      initialValues={{ defaultCurrency: currenctCurrency }}
      schema={WalletConfig}
    >
      <CurrencySelect
        name="defaultCurrency"
        inputProps={{ label: "Default Currency", placeholder: "Default Currency" }}
      />
    </ModalForm>
  );
};

export default WalletConfigModal;
