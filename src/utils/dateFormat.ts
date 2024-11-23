// Format date string like "Nov 2" / "Nov 23, 9:22 AM"
export const formatDateTime = (dateStr: string) => {
  if (!dateStr) {
    return {
      time: "Invalid time",
      date: "Invalid date",
    };
  }

  try {
    const parts = dateStr.split(", ");
    const monthDay = parts[0]; // This will be "Nov 2" or "Nov 23" in both formats
    const [month, day] = monthDay.split(" ");
    
    // Create date in local timezone
    const now = new Date();
    const date = new Date(
      now.getFullYear(),
      new Date(Date.parse(month + " 1, 2000")).getMonth(),
      parseInt(day)
    );

    // If we have time information
    if (parts.length > 1) {
      const time = parts[1]; // "9:22 AM"
      const [timeValue, period] = time.split(" ");
      const [hours, minutes] = timeValue.split(":");

      let hour = parseInt(hours);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      date.setHours(hour);
      date.setMinutes(parseInt(minutes));
      date.setSeconds(0);
    } else {
      // If no time provided, set to midnight
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
    }

    console.log(
      "formatDateTime",
      dateStr,
      "->",
      "Local:",
      date.toLocaleString(),
      "UTC:",
      date.toUTCString(),
      "Unix:",
      date.getTime()
    );

    return {
      time: parts.length > 1 
        ? date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  } catch (error) {
    console.error("Error parsing date:", dateStr, error);
    return {
      time: "Invalid time",
      date: "Invalid date",
    };
  }
};
