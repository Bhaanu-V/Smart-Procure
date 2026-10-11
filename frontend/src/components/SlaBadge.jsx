export default function SlaBadge({ status, expectedTime }) {
  const getSlaClass = () => {
    switch (status) {
      case 'ON_TRACK': return 'sla-on-track';
      case 'DUE_SOON': return 'sla-due-soon';
      case 'OVERDUE': return 'sla-overdue';
      case 'COMPLETED': return 'sla-completed';
      default: return 'sla-on-track';
    }
  };

  const formatText = () => {
    switch (status) {
      case 'ON_TRACK': return 'On Track';
      case 'DUE_SOON': return 'Due Soon';
      case 'OVERDUE': return 'Overdue';
      case 'COMPLETED': return 'Completed';
      default: return status || 'Standard';
    }
  };

  return (
    <span
      className={`sla-badge ${getSlaClass()}`}
      title={expectedTime ? `Deadline: ${new Date(expectedTime).toLocaleString()}` : ''}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block',
        }}
      />
      <span>SLA {formatText()}</span>
    </span>
  );
}
