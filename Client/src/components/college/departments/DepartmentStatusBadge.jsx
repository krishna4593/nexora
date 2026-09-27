
const DepartmentStatusBadge = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-label-md font-bold tracking-widest uppercase bg-success/10 text-success border border-success/20">
        <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot"></span>
        ACTIVE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-label-md font-bold tracking-widest uppercase bg-surface-variant text-on-surface-variant border border-outline-variant/40">
      INACTIVE
    </span>
  );
};

export default DepartmentStatusBadge;
