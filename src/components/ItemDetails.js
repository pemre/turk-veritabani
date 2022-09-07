import Modal from 'react-modal'
import { useEffect } from 'react'
import { useClickOutside } from 'react-click-outside-hook'

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

const customStyles = {
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none', color: 'white', backdropFilter: 'blur(5px)', // top: '50%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
  }, overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)', left: '50%', zIndex: '99999999', // backdropFilter: 'blur(5px)',
  },
}

export const ItemDetails = (props) => {
  const {
    name, year, years, state,
  } = props.item

  const [ref, hasClickedOutside] = useClickOutside()

  useEffect(() => {
    if (hasClickedOutside) {
      props.onClose();
    }
  }, [hasClickedOutside])

  // TODO Remove Modal dependency
  return (
    <Modal
      isOpen={true}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div
        // For useClickOutside hook
        ref={ref}
      >
        <h2>{name}</h2>
        <button onClick={props.onClose}>Close</button>
        <p>
          {years ? <>[{years[0]} - {years[1]}]</> : <>{year}</>}
        </p>
        <p>{state}</p>
      </div>
    </Modal>
  )
}
