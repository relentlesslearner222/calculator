interface DisplayProps {
  value: string;
}

function Display({ value }: DisplayProps) {
  return (
    <div
      style={{
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: value.length > 9 ? '36px' : '64px',
        fontWeight: '200',
        textAlign: 'right',
        padding: '8px 16px 4px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        lineHeight: 1.1,
        transition: 'font-size 0.1s',
      }}
    >
      {value}
    </div>
  );
}

export default Display;
