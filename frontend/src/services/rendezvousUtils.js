export function checkIsEmptyState(appointmentsData) {
  return !appointmentsData || appointmentsData.length === 0;
}

export function getBadgeColorByStatus(statut) {
  switch (statut) {
    case 'PLANIFIE':
      return '#3182ce';
    case 'PRESENT':
      return '#38a169';
    case 'ANNULE':
      return '#e53e3e';
    default:
      return '#718096';
  }
}
