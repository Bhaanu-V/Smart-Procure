import React from 'react';

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
      case 'ON_TRACK': return '🟢 SLA On Track';
      case 'DUE_SOON': return '⚡ SLA Due Soon';
      case 'OVERDUE': return '🚨 SLA Overdue';
      case 'COMPLETED': return '✓ SLA Completed';
      default: return status;
    }
  };

  return (
    <span className={`sla-badge ${getSlaClass()}`} title={expectedTime ? `Deadline: ${new Date(expectedTime).toLocaleString()}` : ''}>
      {formatText()}
    </span>
  );
}
