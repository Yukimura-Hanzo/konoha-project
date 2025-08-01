"use client";

//? REACT
import React, { useEffect, useState } from "react";

export const FormattedDate = ({ date }: { date?: Date }) => {

  //* Use provided date or current date
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    setTargetDate(date ?? new Date());
  }, [date]);

  if (!targetDate) return null;

  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(targetDate);

  //* Add a comma after the weekday & month
  const [weekday, day, month, year] = formatted.replace(",", "").split(" ");

  return (
    <time dateTime={targetDate.toISOString()}>
      {`${weekday}, ${day} ${month}, ${year}`}
    </time>
  );
};
