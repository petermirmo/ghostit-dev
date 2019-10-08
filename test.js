<CollapsibleMenu activeIndex={activeCalendarIndex} title="Calendars">
  <GIText
    className="x-fill flex full-center clickable orange px16 py8"
    onClick={() =>
      createNewCalendar(
        context,
        handleParentChange,
        calendars.length,
        "Calendar " + calendars.length,
        updateActiveCalendar
      )
    }
    text="Make a New Calendar"
    type="p"
  />
  calendars.map((calendar, index) =>
  {
    <GIContainer className="x-fill" onClick={() => updateActiveCalendar(index)}>
      {calendar.calendarName}
      <GIContainer onClick={e => e.stopPropagation()}>
        <Dropdown
          className="pl16"
          dontShowFaAngleDown={true}
          dropdownClassName="right common-border five-blue br8"
          dropdownItems={[
            {
              name: "Set as Default",
              onClick: index =>
                setDefaultCalendar(
                  calendars[index]._id,
                  context,
                  handleParentChange
                )
            },
            {
              className: "red",
              name: isUserAdminOfCalendar(calendar, context.user)
                ? "Delete"
                : "Leave Calendar",
              onClick: isUserAdminOfCalendar(calendar, context.user)
                ? index =>
                    deleteCalendarClicked(index, calendars, this.handleChange)
                : () =>
                    this.handleChange({
                      leaveCalendarPrompt: true
                    })
            }
          ].map(obj => (
            <GIText
              className={`fs-13 ${obj.className}`}
              text={obj.name}
              type="p"
            />
          ))}
          handleParentChange={dropdownClickedItemObj =>
            options[dropdownClickedItemObj.index].onClick(index)
          }
          noTopBorder={true}
          title={<FontAwesomeIcon icon={faEllipsisV} />}
        />
      </GIContainer>
    </GIContainer>
  }
  )
</CollapsibleMenu>;
