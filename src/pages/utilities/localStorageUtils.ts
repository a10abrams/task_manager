// This localStorage function is being used by both `calendar` and `eventsForm`

export const getEventsFromLocalStorage = () => {
    // Check if localStorage is available
    if (typeof window !== "undefined" && window.localStorage) {
      const storedEventsDataString = localStorage.getItem("eventsData");
      console.log('Stored events data string:', storedEventsDataString);
      const storedEventsData = storedEventsDataString ? JSON.parse(storedEventsDataString) : [];
  
      console.log("Fetched events from localStorage:", storedEventsData);
      
      //May need this chunk of code for error handling if the JSON error continues
      // "try" statement from notebook
      return storedEventsData;
    }
    return [];
  };
