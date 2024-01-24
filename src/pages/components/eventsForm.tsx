import React from 'react'

const EventsForm = () => {
    //logic

  // jsx structure
  return (
    <>
      <form id="form_conainer">
        <div className="local_events_display">
          <div className="form_title">Tasks</div>
          <div className="task_table">
            <ol className="local_events_name"></ol>
            <ol className="local_events_date"></ol>
            <ol className="local_events_desc"></ol>
          </div>
          <div className="input_form_container">
            <img id = "plus_new_event" alt="Placeholder"></img>
            <div id="input_form">
                <div className = "form_field_container">
                    <label htmlFor="Name">Task name:</label>
                    <input type="text" id="name_field" minLength={3} required />
                </div>

                <div className = "form_field_container">
                    <label htmlFor="Date">Date:</label>
                    <input type="date" id="date_field" required />
                </div>

                <div className = "form_field_container">
                    <label htmlFor="Description">Description:</label>
                    <textarea id="description_field" maxLength={250} />
                </div>

                <div className = "form_field_container">
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
