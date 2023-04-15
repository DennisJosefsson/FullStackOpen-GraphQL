const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  return (
    <div>
      <h2 style={{ color: 'blue' }}>{notification}</h2>
    </div>
  )
}

export default Notification
