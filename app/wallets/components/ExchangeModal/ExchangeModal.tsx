import { FC } from "react";

import ModalForm from "app/core/components/ModalForm";
import CurrencySelect from "app/core/components/CurrencySelect";
import { Close } from "@material-ui/icons";
import { invalidateQuery, useMutation } from "blitz";
import updateWallet from "app/wallets/mutations/updateWallet";
import { Exchange, WalletConfig } from "app/wallets/validations";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import { Currency } from "db";
import exchangeAmountWallet from "app/wallets/amount-wallets/mutations/exchangeAmountWallet";

interface WalletConfigModalProps {
  open: boolean;
  handleClose: () => void;
  amountWalletId: string;
}

const ExchangeModal: FC<WalletConfigModalProps> = ({ open, handleClose, amountWalletId }) => {
  const [exchange] = useMutation(exchangeAmountWallet);
  return (
    <ModalForm
      open={open}
      handleClose={handleClose}
      title="Exchange"
      onSubmit={async ({ exchangeAmount, toCurrency }) => {
        await exchange({ amountWalletId, toCurrencyId: toCurrency.id, exchangeAmount });
        await invalidateQuery(getWalletTotal);
        handleClose();
      }}
      initialValues={{ exchangeAmount: 0 }}
      schema={Exchange}
    >
      <CurrencySelect
        name="defaultCurrency"
        inputProps={{ label: "Default Currency", placeholder: "Default Currency" }}
      />
    </ModalForm>
  );
};

export default ExchangeModal;
