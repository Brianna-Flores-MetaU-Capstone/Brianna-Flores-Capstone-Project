// Parse user events to extract only necessary data
const parseUserEvents = ( userEventsData: any) => {
    return userEventsData.map((userEvent: any) => ({
        event: userEvent.summary,
        start: userEvent.start.dateTime,
        end: userEvent.end.dateTime,
    }))
}

export { parseUserEvents }