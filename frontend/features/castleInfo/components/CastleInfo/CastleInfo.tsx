import { FC } from 'react';
import styles from './CastleInfo.module.scss';
import { TClassNameable } from '../../../../shared/types';
import { CastleInfoProvider, useCastleInfoContext } from '../../contexts/castleInfoContext';
import Unit from '../Unit/Unit';
import goldImg from '../../assets/gold.png';
import classNames from 'classnames';
import Tribe from '../Tribe/Tribe';
import { useAuthContext } from '../../../auth';

type TProps = TClassNameable

const CastleInfo: FC<TProps> = ({ className}) => {
  const { castleInfo: { units, money, tribe, userId: castleUserId } } = useCastleInfoContext()
  const { userData: { userId } } = useAuthContext()

  return (
    <div className={className}>
      <div className={styles.section}>
        <div className={styles.title}>Player</div>
        <div className={styles.sectionBody}>
          <div>Id: {castleUserId} {castleUserId === userId && ('(me)')}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Tribe</div>
        <div className={styles.sectionBody}>
          <Tribe type={tribe} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Gold</div>
        <div className={classNames(styles.sectionBody, styles.goldWrap)}>
          <img className={styles.gold} src={goldImg.src} alt=""/>
          <span>{money}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Troops</div>
        <div className={classNames(styles.sectionBody, styles.units)}>
          {units.map(({ type, amount }) => <Unit className={styles.unit} key={type} type={type} amount={amount} />)}
        </div>
      </div>
    </div>
  )
}

export default ({...props}: TProps) => <CastleInfoProvider><CastleInfo {...props}/></CastleInfoProvider>
