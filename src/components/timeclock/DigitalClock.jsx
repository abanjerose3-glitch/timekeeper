import { useEffect, useState } from "react";

function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  return (
    <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">

      <p className="text-slate-500 text-sm">
        {date}
      </p>

      <h1 className="mt-3 text-6xl font-bold tracking-tight">
        {time}
      </h1>

    </div>
  );
}

export default DigitalClock;