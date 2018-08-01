using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Ical.Net;
using Microsoft.AspNetCore.Mvc;
using TeamHolidaysLab.Web.Models;
using IcalCalendarEvent = Ical.Net.CalendarComponents.CalendarEvent;

namespace TeamHolidaysLab.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var events = FetchCalendarEvents();

            return View(events);
        }

        public JsonResult GetCalendarEvents()
        {
            var events = FetchCalendarEvents();

            return Json(new { Success = true, CalendarEvents = events });
        }


        private IEnumerable<CalendarEventViewModel> FetchCalendarEvents()
        {
            var icalText = _client.DownloadString(CalendarUrl);
            var calendar = Calendar.Load(icalText);

            var events = calendar.Events
                .Select(CreateCalendarEventViewModel)
                .Where(x => x.End >= DateTime.Now)
                .OrderBy(x => x.Start)
                .ThenBy(x => x.LastName)
                .ThenBy(x => x.FirstName);

            return events;
        }


        private CalendarEventViewModel CreateCalendarEventViewModel(IcalCalendarEvent item)
        {
            // Name.

            var fullname = item.Summary.Split(" - ")[0];
            var names = fullname.Split(" ");

            // Duration.

            var durationSuffix = " days";
            if (item.Duration.Days < 2)
            {
                durationSuffix = (item.Duration.Days == 0) ? durationSuffix = ".5 day" : " day";
                if (item.Duration.Days == 0)
                {
                    durationSuffix += (item.Start.Value.TimeOfDay.Hours > 12) ? " (PM)" : " (AM)";
                }
            }

            // Returns.

            var returnDays = item.End.Value.Subtract(DateTime.Today).Days;
            var returns = returnDays + " days";
            if (returnDays < 2)
            {
                returns = (returnDays == 0) ? "Tomorrow" : "1 day";
            }

            return new CalendarEventViewModel
            {
                Uid = item.Uid,

                FullName = fullname,
                FirstName = names[0],
                LastName = names[1],

                Summary = item.Summary,
                Description = item.Description,

                Start = item.Start.Value,
                End = item.End.Value,
                Duration = item.Duration,

                IsAllDay = item.IsAllDay,

                StartFormatted = String.Format("{0:dd/MM/yyyy}", item.Start.Value),
                EndFormatted = String.Format("{0:dd/MM/yyyy}", item.End.Value),
                DurationFormatted = item.Duration.Days + durationSuffix,
                ReturnsFormatted = returns
            };
        }


        private const string CalendarUrl = "https://freestyleinteractivelimited.breathehr.com/VKkxaKO7HALM2XyMbkJsgBvDmudzoWuLHynC1aP560w/1192/calendar.ics";
        private WebClient _client = new WebClient();
    }
}
