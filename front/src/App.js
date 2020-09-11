import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import createEventId from "./event-utils";
import axios from "axios";
// import Data from './Data';

class App extends Component {
  state = {
    data: [],
    weekendsVisible: true,
    currentEvents: [],
    latestCount: 0,
  };
  componentDidMount() {
    fetch("/data")
      .then((res) => res.json())
      .then((event) => this.setState({ data: event }));
  }

  render() {
    return (
      <div className="demo-app">
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            events={this.state.data} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            dateClick={this.handleDateClick}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            eventAdd={this.handleDataAdded}
            eventRemove={this.handleDataRemove}
            /* you can update a remote database when these fire:
            
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    );
  }
  handleDateSelect = (arg) => {
    fetch("/data")
      .then((res) => res.json())
      .then((event) => {
        arg.view.calendar.removeAllEvents();
        arg.view.calendar.refetchEvents();
        this.setState({ data: event });
      });

    let tempDate = new Date(arg.start.getTime());
    tempDate.setDate(tempDate.getDate() + 1);
    if (arg.end.getTime() !== tempDate.getTime()) {
      let title = prompt("Please enter a new title for your event");
      let calendarApi = arg.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        fetch("/countData")
          .then((res) => res.json())
          .then((result) => this.setState({ latestCount: result }))
          .then(() =>
            this.setState({
              latestCount: this.state.latestCount + 1,
            })
          )
          .then(() =>
            calendarApi.addEvent({
              id: this.state.latestCount.toString(),
              title,
              start: arg.startStr,
              end: arg.endStr,
              allDay: arg.allDay,
            })
          );
      }
    }
  };

  handleDateClick = (arg) => {
    if (arg.hasOwnProperty("dateStr") === true) {
      let title = prompt("Please enter a new title for your event");
      let calendarApi = arg.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        fetch("/countData")
          .then((res) => res.json())
          .then((result) => this.setState({ latestCount: result }))
          .then(() =>
            this.setState({
              latestCount: this.state.latestCount + 1,
            })
          )
          .then(() =>
            calendarApi.addEvent({
              id: this.state.latestCount.toString(),
              title,
              start: arg.dateStr,
              end: arg.dateStr,
              allDay: arg.allDay,
            })
          );
      }
    }
  };

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDataRemove = (removeInfo) => {
    axios
      .post("/unregister", removeInfo.event)
      .then(() => console.log("unregister Data"))
      .catch((err) => {
        console.error(err);
      });
  };

  handleDataAdded = (addInfo) => {
    console.log("add Data");
    console.log(addInfo.event.id);
    axios
      .post("/register", addInfo.event)
      .then(() => console.log("register Data"))
      .catch((err) => {
        console.error(err);
      });
  };

  handleEventClick = (clickInfo) => {
    fetch("/data")
      .then((res) => res.json())
      .then((event) => {
        clickInfo.view.calendar.removeAllEvents();
        clickInfo.view.calendar.refetchEvents();
        this.setState({ data: event });
      });
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };
}

// function App() {
//   const [data, setData] = useState({});
//   fetch("/data/Req")
//     .then((res) => res.json())
//     .then(
//       (result) => setData(result),
//       () => {
//         console.log("data read : ", data);
//       }
//     );
//   return (
//     // <div>
//     //   <Data />
//     // </div>
//     <div>
//       {data.lastname} {data.firstname}
//     </div>
//   );
// }
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
export default App;
