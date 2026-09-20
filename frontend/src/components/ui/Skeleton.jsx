import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Skeleton width="40%" height="16px" />
      <Skeleton width="70%" height="32px" />
      <Skeleton width="100%" height="12px" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th><Skeleton width="80px" height="14px" /></th>
            <th><Skeleton width="150px" height="14px" /></th>
            <th><Skeleton width="80px" height="14px" /></th>
            <th><Skeleton width="100px" height="14px" /></th>
            <th><Skeleton width="60px" height="14px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td><Skeleton width="90px" height="16px" /></td>
              <td><Skeleton width="180px" height="16px" /></td>
              <td><Skeleton width="70px" height="16px" /></td>
              <td><Skeleton width="100px" height="20px" borderRadius="9999px" /></td>
              <td><Skeleton width="60px" height="16px" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
