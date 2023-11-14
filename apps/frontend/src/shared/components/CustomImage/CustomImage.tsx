import { FC } from 'react'
import Image, { ImageProps } from 'next/image'
import classNames from 'classnames'
import styles from './CustomImage.module.scss'
import { ClassNameable } from '../../types'

type Props = ImageProps & ClassNameable
const CustomImage: FC<Props> = ({
  src,
  alt,
  className,
  width,
  height,
  ...props
}) => (
  <span className={styles.imgWrap}>
    <Image
      className={classNames(styles.img, className)}
      src={src}
      alt={alt}
      fill={!width && !height}
      width={width}
      height={height}
      {...props}
    />
  </span>
)

export default CustomImage
