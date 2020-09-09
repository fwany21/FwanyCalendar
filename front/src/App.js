import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import createEventId from "./event-utils";
import axios from 'axios';
// import Data from './Data';

class App extends Component {
  state = {
    data: [],
    weekendsVisible: true,
    currentEvents: [],
  };
  componentDidMount() {
    fetch("/data")
      .then((res) => res.json())
      .then((result) => this.setState({ data: result }));
  }

  render() {
    return (
      <div>
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
          eventContent={renderEventContent} // custom render function
          eventClick={this.handleEventClick}
          eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          eventAdd={this.handleDataAdded}
          /* you can update a remote database when these fire:
            
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </div>
    );
  }
  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: "",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  handleDataAdded = (addInfo) => {
    console.log("add Data");
    console.log(addInfo.event.title);
    axios.post('/register', addInfo.event)
    .then(() => console.log("register Data"))
    .catch(err => {
      console.error(err);
    });
  };

  handleEventClick = (clickInfo) => {
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
