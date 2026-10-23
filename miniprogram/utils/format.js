function formatPrice(cents) {
  return (Number(cents || 0) / 100).toFixed(2)
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp)
  const pad = (value) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

module.exports = {
  formatDateTime,
  formatPrice
}

