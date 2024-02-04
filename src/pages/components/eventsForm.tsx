import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import { getEventsFromLocalStorage } from '../../utilities/localStorageUtils';

// Define prop type
interface EventsFormProps {
  updateCalendar: () => void;
}

// EventsForm is specified as a functional component (FC), `EventsFormProps` is the generic type
const EventsForm: React.FC<EventsFormProps> = ({ updateCalendar }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);

  //added to fix prevEvents error
  interface Event {
    name: string;
    date: string;
    description: string;
  }

  // Fetch events from localStorage on component render
  useEffect(() => {
      const storedEventsData = getEventsFromLocalStorage();
      setEvents(storedEventsData);
    }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    // Extract month and day from the input; this makes it so that the users don't have to input dates in "yyyy-mm-dd" format
    const [month, day] = event.target.elements.date_field.value.split('-')

    // Create a new date string with default year and input month + day
    const completeDate = `2024-${month}-${day}`;
    const parsedDate = dayjs(completeDate);
  
    if (!parsedDate.isValid()) {
      // Invalid date, display an error message or take action
      alert('Invalid date format. Please enter a valid date (MM-DD).');
      return; // Exit the function early
    }
  
    // Create a new event object
    const newEvent = {
      name,
      date: parsedDate.format('YYYY-MM-DD'), // Format the date consistently
      description,
    };

    // Update the events state with the new event + trigger calendar update
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];

      // Save events to localStorage
      saveEventsToLocalStorage(updatedEvents, updateCalendar);
      
      return updatedEvents;
    });

    // Reset form fields
    setName('');
    setDate('');
    setDescription('');
  };

  // This simplified (no more stringify) function directly recieves the events array
  // Now, it should ensure that the data being saved to localStorage is serializable--name, date, and description
  const saveEventsToLocalStorage = (events: Event[], updateCalendar: () => void) => {
    // Extract only necessary properties
    const serializableEvents = events.map(({ name, date, description }) => ({ name, date, description }));
  
    // Save events to local storage
    localStorage.setItem("eventsData", JSON.stringify(serializableEvents));

    // Trigger callback to update calendar
    if (updateCalendar) {
      updateCalendar();
    }
  };

  // Delete events
  const handleDelete = (index) => {
    // Remove event from the list
    const updatedEvents = [...events.slice(0, index), ...events.slice(index + 1)];
    setEvents(updatedEvents);

    // Update localstorage and trigger calendar update
    saveEventsToLocalStorage(updatedEvents, updateCalendar);
  }

  // Edit events
  const handleEdits = (index) => {
    const editedEvent = events[index];
    // Set form fields with the values of the event to be edited
    setName(editedEvent.name);
    setDate(dayjs(editedEvent.date).format("MM-DD"));
    setDescription(editedEvent.description);

    // Remove the event from the list
    const updatedEvents = [...events.slice(0, index), ...events.slice(index + 1)];
    setEvents(updatedEvents);

    // Update localstorage and trigger calendar update
    saveEventsToLocalStorage(updatedEvents, updateCalendar);
  }

  return (
    <>
      <form id="form_container" onSubmit={handleFormSubmit}>
        <div className="local_events_display">
          <div className="task_table">
            <table>
              <thead>
                <tr>
                  <th className="label_task_table">Name</th>
                  <th className="label_task_table">Date</th>
                  <th className="label_task_table">Description</th>
                </tr>
              </thead>
              <tbody>
                {/* Display events from localStorage as table rows */}
                {events
                .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
                .map((event, index) => (
                  <tr key={index}>
                    <td className="name_table_data">{event.name}</td>
                    <td className="date_table_data">{dayjs(event.date).format("MM/DD")}</td>
                    <td className="description_table_data">{event.description}</td>
                    <td id="buttons_edit_delete_container">
                      <button id="edit_event_button" onClick={() => handleEdits(index)}>&#x1F589;</button>
                      <button id="delete_event_button" onClick={() => handleDelete(index)}>X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="input_form_container">
            <div id="input_form">
              <div className="form_field_container">
                <label htmlFor="Name">Task name: </label>
                <input type="text" id="name_field" value={name} onChange={handleNameChange} minLength={3} required />
              </div>

              <div className="form_field_container">
                <label htmlFor="Date">Date: </label>
                <input type="text" id="date_field" placeholder="MM-DD" value={date} onChange={handleDateChange} required />
              </div>

              <div className="form_field_container">
                <label htmlFor="Description">Description: </label>
                <textarea id="description_field" value={description} onChange={handleDescriptionChange} maxLength={250} />
              </div>

              <div className="form_field_container" id="submit_container">
                <input type="submit" id="submit_button" value="Create event" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EventsForm;
