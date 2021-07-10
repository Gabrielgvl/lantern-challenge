import { FC, ReactNode } from "react";

interface HeaderProps {
  title: string;
  children: ReactNode;
}

const FormCard: FC<HeaderProps> = ({ title, children }) => {
  return (
    <section className="border-indigo-600 border-2 rounded p-8 flex flex-col items-center drop-shadow-md bg-indigo-900 w-full h-full md:h-auto md:max-w-sm justify-center">
      <h1 className="text-xl mb-4">{title}</h1>
      {children}
    </section>
  );
};

export default FormCard;
