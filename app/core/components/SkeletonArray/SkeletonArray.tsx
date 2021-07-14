import { ExoticComponent, Fragment, ReactElement, ReactNode } from "react";

interface SkeletonArrayProps {
  length?: number;
  component: ReactNode;
  WrapperElement?: keyof JSX.IntrinsicElements | ExoticComponent;
}

const SkeletonArray: React.FC<SkeletonArrayProps> = ({
  length = 5,
  component,
  WrapperElement = Fragment,
}): ReactElement => {
  const arrayNumber = Array.from({ length }, (_, index) => index);

  return (
    <WrapperElement>
      {arrayNumber.map((number) => (
        <Fragment key={number}>{component}</Fragment>
      ))}
    </WrapperElement>
  );
};

export default SkeletonArray;
