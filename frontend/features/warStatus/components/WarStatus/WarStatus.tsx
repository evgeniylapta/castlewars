import { FC } from 'react';
import { TClassNameable } from '../../../../shared/types';

const WarStatus: FC<TClassNameable> = ({ className }) => {
  return (
    <div className={className}>War status</div>
  )
}

export default WarStatus
