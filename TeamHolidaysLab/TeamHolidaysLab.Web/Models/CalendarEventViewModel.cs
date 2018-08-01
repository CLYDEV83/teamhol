using System;

namespace TeamHolidaysLab.Web.Models
{
    public class CalendarEventViewModel
    {
        public string Uid { get; set; }

        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Summary { get; set; }
        public string Description { get; set; }

        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public TimeSpan Duration { get; set; }

        public bool IsAllDay { get; set; }

        public string StartFormatted { get; set; }
        public string EndFormatted { get; set; }
        public string DurationFormatted { get; set; }
        public string ReturnsFormatted { get; set; }
    }
}
