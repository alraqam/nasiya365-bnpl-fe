import Icon from '../icon/icon'

interface Props {
  title: string
}

const Title = ({ title }: Props) => {
  return (
    <div className='page-title'>
      <Icon svg='/icons/star-s-fill.svg' width={20} height={20} color='#7367F0' /> {title}
    </div>
  )
}

export default Title
