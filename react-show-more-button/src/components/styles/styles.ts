const ShowMore: React.CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  background: 'inherit',
};

const Shadow: React.CSSProperties = {
  content: '',
  background: 'inherit',
  position: 'absolute',
  bottom: 0,
  right: 0,
  left: 0,
  opacity: 0.93,
};

const ButtonDiv: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '15px 0',
};

const Anchor: React.CSSProperties = {
  height: '1px',
  position: 'absolute',
  top: -35,
};

const DefaultButton: React.CSSProperties = {
  background: '#26a8da',
  color: '#ffffff',
  padding: '10px 15px',
  borderRadius: '10px',
  width: '40%',
  maxWidth: '250px',
  cursor: 'pointer',
};

const styles = {
  ShowMore,
  Shadow,
  ButtonDiv,
  Anchor,
  DefaultButton,
};

export default styles;
