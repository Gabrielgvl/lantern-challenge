import { FC, Suspense } from "react";

import ModalForm from "app/core/components/ModalForm";
import CurrencySelect from "app/core/components/CurrencySelect";
import { invalidateQuery, useMutation } from "blitz";
import { Exchange } from "app/wallets/validations";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import exchangeAmountWallet from "app/wallets/amount-wallets/mutations/exchangeAmountWallet";
import FormTextField from "app/core/components/FormTextField";
import { Skeleton, TextField, useMediaQuery } from "@material-ui/core";
import { Amount } from "../AmountList/AmountList";
import PreviewField from "./PreviewField";
import formatCurrency from "app/core/utils/formatCurrency";
import getWalletAmounts from "app/wallets/queries/getWalletAmounts";

interface ExchangeModalProps {
  handleClose: () => void;
  amountWallet?: Amount;
}

const ExchangeModal: FC<ExchangeModalProps> = ({ handleClose, amountWallet }) => {
  const [exchange] = useMutation(exchangeAmountWallet);
  const isTablet = useMediaQuery("(min-device-width: 640px)");
  return (
    <ModalForm
      open={!!amountWallet}
      handleClose={handleClose}
      title={`Exchange - ${amountWallet?.currency.symbol}`}
      onSubmit={async ({ exchangeAmount, toCurrency }) => {
        if (!amountWallet) return;
        await exchange({
          amountWalletId: amountWallet.id,
          toCurrencyId: toCurrency.id,
          exchangeAmount,
        });
        await Promise.all([invalidateQuery(getWalletTotal), invalidateQuery(getWalletAmounts)]);
        handleClose();
      }}
      initialValues={{ exchangeAmount: amountWallet?.amount }}
      schema={Exchange(amountWallet?.amount || 0)}
      maxWidth="md"
      fullScreen={!isTablet}
      className="flex gap-4 flex-col md:grid md:grid-cols-2"
    >
      <TextField
        disabled
        label="Current Balance"
        placeholder="From Currency"
        value={formatCurrency(amountWallet?.amount || 0, amountWallet?.currency.symbol)}
      />
      <FormTextField
        name="exchangeAmount"
        label="Amount"
        placeholder="Amount to exchange"
        type="number"
        inputProps={{ min: 0, step: 0.01, pattern: /^d+(?:.d{1,2})?$/ }}
      />
      <CurrencySelect
        name="toCurrency"
        inputProps={{ label: "To", placeholder: "Destiny Currency" }}
      />
      <Suspense fallback={<Skeleton variant="rectangular" height="100%" />}>
        {amountWallet?.currency.symbol && (
          <PreviewField fromCurrency={amountWallet.currency.symbol} />
        )}
      </Suspense>
    </ModalForm>
  );
};

export default ExchangeModal;
