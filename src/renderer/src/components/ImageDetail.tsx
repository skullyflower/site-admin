import CloseButton from '@renderer/components/ui/CloseButton'
const ImageDetail = ({
  src,
  alt,
  isOpen,
  close
}: {
  src: string
  alt: string
  isOpen: boolean
  close: () => void
}): React.ReactNode => {
  return (
    <div className={`modal ${isOpen ? 'opaque' : 'translucent'}`}>
      <div id="overlay" onClick={close}></div>
      <div className="popover-window">
        <div className="popover-content">
          <div style={{ textAlign: 'right' }}>
            <CloseButton onClick={close} />
          </div>
          <div style={{ textAlign: 'center' }}>
            {isOpen ? <img src={`${src}`} alt={alt} /> : <div style={{ height: '700px' }} />}
          </div>
          <header style={{ padding: '10px', textAlign: 'right' }}>{alt}</header>
        </div>
      </div>
    </div>
  )
}
export default ImageDetail
