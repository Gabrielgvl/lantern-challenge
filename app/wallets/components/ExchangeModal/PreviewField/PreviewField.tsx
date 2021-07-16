import { FC, useMemo } from "react";

import { useQuery } from "blitz";
import { Exchange } from "app/wallets/validations";
import { TextField } from "@material-ui/core";
import getExchangePreviewAmount from "app/wallets/amount-wallets/queries/getExchangePreviewAmount";
import { useFormState } from "react-final-form";
import { z } from "zod";
import useDebounce from "app/core/hooks/useDebounce";

interface PreviewFieldProps {
  fromCurrency: string;
}

const PreviewField: FC<PreviewFieldProps> = ({ fromCurrency }) => {
  const { values } = useFormState<z.infer<ReturnType<typeof Exchange>>>();
  const debounceValues = useDebounce(values, 500);

  const [exchange] = useQuery(
    getExchangePreviewAmount,
    {
      fromCurrency,
      amount: debounceValues.exchangeAmount,
      toCurrency: debounceValues.toCurrency?.symbol,
    },
    { enabled: !!debounceValues.toCurrency }
  );

  const value = useMemo(() => {
    if (!debounceValues.toCurrency) return "";

    return Intl.NumberFormat(undefined, {
      style: "currency",
      currency: debounceValues.toCurrency.symbol,
    }).format(exchange);
  }, [debounceValues.toCurrency, exchange]);

  return <TextField label="Preview" placeholder="Amount to exchange" value={value} disabled />;
};

export default PreviewField;
