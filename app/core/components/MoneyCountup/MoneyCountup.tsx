import { FC } from "react";
import useContUpPrevious from "app/core/hooks/useCountUpPrevious";
import formatCurrency from "app/core/utils/formatCurrency";

interface MoneyCountupProps
  extends React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement> {
  value: number;
  currency?: string;
}

const MoneyCountup: FC<MoneyCountupProps> = ({ value, currency, ...props }) => {
  const { countUp } = useContUpPrevious(value, { decimals: 2, duration: 0.5 });
  return <data {...props}>{formatCurrency(countUp as number, currency)}</data>;
};

export default MoneyCountup;
