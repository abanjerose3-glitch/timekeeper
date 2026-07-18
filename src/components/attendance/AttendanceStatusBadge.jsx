function AttendanceStatusBadge({ record }) {
    let text = "Not Clocked In";
    let style =
      "bg-slate-100 text-slate-600";
  
    if (record?.time_out) {
      text = "Shift Complete";
      style =
        "bg-green-100 text-green-700";
    } else if (
      record?.break_out &&
      !record?.break_in
    ) {
      text = "On Break";
      style =
        "bg-yellow-100 text-yellow-700";
    } else if (record?.time_in) {
      text = "Working";
      style =
        "bg-blue-100 text-blue-700";
    }
  
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}
      >
        {text}
      </span>
    );
  }
  
  export default AttendanceStatusBadge;