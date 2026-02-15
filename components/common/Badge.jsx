"use client";

const Badge = ({ status }) => {
  if (!status) return null;

  const normalizedStatus = status.toLowerCase();
  let badgeClass = "";

  switch (normalizedStatus) {
    case "success":
      badgeClass = "badge-success";
      break;
    case "approved":
      badgeClass = "badge-success";
      break;
    case "active":
      badgeClass = "badge-success";
      break;
    case "published":
      badgeClass = "badge-success";
      break;
    case "pending":
      badgeClass = "badge-pending";
      break;
    case "failed":
      badgeClass = "badge-error";
      break;
    case "rejected":
      badgeClass = "badge-error";
      break;
    case "inactive":
      badgeClass = "badge-error";
      break;
    case "draft":
      badgeClass = "badge-error";
      break;
    case "processing":
      badgeClass = "badge-processing";
      break;
    case "open":
      badgeClass = "badge-open";
      break;
    case "closed":
      badgeClass = "badge-closed";
      break;
    case "claimed":
      badgeClass = "badge-pending";
      break;
    case "claimable":
      badgeClass = "badge-success";
      break;
    default:
      badgeClass = "badge-default";
      break;
  }

  return <span className={`${badgeClass} badge`}>{status}</span>;
};

export default Badge;
