const formatCurrency = (value: number, currency?: string) => {
  return Intl.NumberFormat("lookup", {
    style: currency ? "currency" : "decimal",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

export default formatCurrency;
