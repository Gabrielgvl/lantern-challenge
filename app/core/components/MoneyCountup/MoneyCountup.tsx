import { FC } from "react";
import useContUpPrevious from "app/core/hooks/useCountUpPrevious";

interface MoneyCountupProps
  extends React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement> {
  value: number;
  currency?: string;
}

const MoneyCountup: FC<MoneyCountupProps> = ({ value, currency, ...props }) => {
  const { countUp } = useContUpPrevious(value, { decimals: 2, duration: 0.5 });
  return (
    <data {...props}>
      {Intl.NumberFormat("lookup", {
        style: currency ? "currency" : "decimal",
        currency,
        minimumFractionDigits: 2,
      }).format(countUp as number)}
    </data>
  );
};

export default MoneyCountup;
