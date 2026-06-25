const CloseIcon = ({ onClick }: { onClick: () => void }): React.ReactNode => (
  <button
    onClick={onClick}
    style={{
      width: '25px',
      height: '25px',
      padding: '0',
      marginLeft: '5px',
      lineHeight: '25px',
      textAlign: 'center',
      border: 'none'
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="none" />
      <line
        x1="160"
        y1="96"
        x2="96"
        y2="160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="96"
        y1="96"
        x2="160"
        y2="160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle
        cx="128"
        cy="128"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  </button>
)
export default CloseIcon
