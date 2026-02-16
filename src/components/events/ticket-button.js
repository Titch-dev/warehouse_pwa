import styles from './ticket-button.module.css';

function TicketButton({ link }) {

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.ticket_link}
    >
        Buy tickets online
    </a>
  )
}

export default TicketButton