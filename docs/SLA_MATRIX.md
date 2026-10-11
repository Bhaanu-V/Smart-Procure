# SLA Matrix & Priority Scoring Engine

SmartProcure computes priority levels and SLA resolution targets through dynamic multi-factor scoring.

## 1. Priority Scoring Formula

The total priority score is calculated as:
$$\text{Total Score} = \text{Cost Score} + \text{Urgency Score} + \text{Age Score}$$

### 1.1 Cost Component (Max: 40 points)
| Requisition Cost | Points |
|------------------|--------|
| $\ge \$50,000$   | 40     |
| $\ge \$10,000$   | 30     |
| $\ge \$2,500$    | 20     |
| $< \$2,500$      | 10     |

### 1.2 Urgency Component (Max: 35 points)
| Urgency Level | Points |
|---------------|--------|
| `CRITICAL`    | 35     |
| `HIGH`        | 25     |
| `MEDIUM`      | 15     |
| `LOW`         | 5      |

### 1.3 Age Component (Max: 25 points)
| Days Pending Approval | Points |
|-----------------------|--------|
| $\ge 7\text{ days}$   | 25     |
| $\ge 3\text{ days}$   | 15     |
| $< 3\text{ days}$     | 5      |

---

## 2. Priority Classification

| Total Score Range | Priority Level | Default SLA Target |
|-------------------|----------------|--------------------|
| 75 - 100          | `URGENT`       | 12 Hours           |
| 50 - 74           | `HIGH`         | 24 Hours           |
| 30 - 49           | `NORMAL`       | 48 Hours           |
| 0 - 29            | `LOW`          | 48 Hours           |

---

## 3. SLA Breach Lifecycle States
- **`ON_TRACK`**: Time elapsed is $< 75\%$ of the allotted window.
- **`DUE_SOON`**: Time elapsed is $\ge 75\%$ but not yet exceeded.
- **`OVERDUE`**: Expected approval time passed without decision.
- **`COMPLETED`**: Order approved or rejected prior to or after SLA deadline.
