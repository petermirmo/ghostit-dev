<div className="flex hc vc">
  {isAdmin && (
    <div title="Delete Calendar. Only calendars with one user can be deleted.">
      <FontAwesomeIcon
        className="color-red button pa4 ml8"
        icon={faTrash}
        onClick={() =>
          deleteCalendarClicked(
            activeCalendarIndex,
            calendars,
            this.handleChange
          )
        }
      />
    </div>
  )}
  {!isAdmin && (
    <div title="Leave Calendar">
      <FontAwesomeIcon
        className="close-special button pa4 ml8"
        icon={faSignOutAlt}
        flip="horizontal"
        onClick={() =>
          this.handleChange({ leaveCalendarPrompt: true })
        }
      />
    </div>
  )}
</div>
<div className="flex column fill-flex vc">
  <div className="grid-two-columns py8 border-bottom x-fill">
    <div className="flex vc hc mx16">
      <div className="label">Rename Calendar: </div>
      <input
        type="text"
        className="regular-input ml16"
        placeholder="Calendar Name"
        onChange={event => {
          this.setState({ unsavedChange: true });
          this.handleCalendarChange(
            "tempName",
            event.target.value,
            activeCalendarIndex
          );
        }}
        value={calendar.tempName ? calendar.tempName : ""}
      />
      {unsavedChange && (
        <button
          className="regular-button ml16"
          onClick={e => {
            e.preventDefault();
            saveCalendarName(
              calendars,
              handleChange,
              activeCalendarIndex,
              calendar.tempName
            );
          }}
        >
          Save
        </button>
      )}
    </div>
    <div className="flex hc vc">
      <input
        type="text"
        className="regular-input mx16"
        placeholder="Invite user to calendar"
        onChange={event => {
          this.handleChange({ inviteEmail: event.target.value });
        }}
        value={inviteEmail}
      />
      {inviteEmail !== "" && (
        <button
          className="regular-button mr16"
          onClick={e => {
            e.preventDefault();
            inviteUser(
              calendars,
              context,
              this.handleChange,
              activeCalendarIndex,
              inviteEmail
            );
          }}
        >
          Invite
        </button>
      )}
    </div>
  </div>
  <div className="flex fill-flex x-fill">
    <div className="list-container fill-flex pa16 light-scrollbar border-right">
      <div className="flex row">
        <h4 className="mx16">Social Accounts Linked To Calendar</h4>
        <div
          className="add-accounts-tooltip"
          title="To link social accounts from your user account to a calendar, create a new post and click on the account you want to link."
        >
          <FontAwesomeIcon icon={faQuestionCircle} size="1x" />
        </div>
      </div>
      {calendar.accounts &&
        calendar.accounts.map((account, index) => {
          let title = account.username;
          if (!title) {
            if (account.givenName && account.familyName)
              title = `${account.givenName} ${account.familyName}`;
            else title = account.givenName;
          }
          return (
            <div className="list-item" key={`account${index}`}>
              <div className="list-info">
                <FontAwesomeIcon
                  icon={getPostIcon(account.socialType)}
                  size="3x"
                  color={getPostColor(account.socialType)}
                />
                <div className="flex column fill-flex ml8">
                  <div className="fill-flex">
                    {capitolizeWordsInString(title)}
                  </div>
                  <div className="fill-flex">
                    {capitolizeFirstChar(account.accountType)}
                  </div>
                </div>
                {(isAdmin ||
                  account.userID.toString() ===
                    userID.toString()) && (
                  <div
                    title="Remove Account From Calendar"
                    className="flex hc vc"
                  >
                    <FontAwesomeIcon
                      className="color-red button"
                      icon={faTrash}
                      onClick={e => {
                        e.stopPropagation();
                        this.setState({
                          unlinkAccountPrompt: true,
                          unLinkAccountID: account._id
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
    <div className="list-container fill-flex pa16 light-scrollbar">
      <h4 className="mx16">Calendar Users</h4>
      {calendar.users &&
        calendar.users.map((userObj, index) => (
          <div className="list-item" key={`user${index}`}>
            <div className="list-info">
              <div className="flex column fill-flex">
                <div className="fill-flex">
                  {capitolizeWordsInString(userObj.fullName)}
                  {userObj._id.toString() === userID.toString()
                    ? " (Admin)"
                    : ""}
                </div>
                <div className="fill-flex">{userObj.email}</div>
              </div>
              {isAdmin &&
                userObj._id.toString() !== userID.toString() && (
                  <div className="flex hc vc">
                    <div title="Remove User">
                      <FontAwesomeIcon
                        className="color-red button"
                        icon={faTrash}
                        onClick={e => {
                          e.stopPropagation();
                          this.setState({
                            removeUserPrompt: true,
                            removeUserObj: {
                              userIndex: index,
                              calendarIndex: activeCalendarIndex
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
    </div>
  </div>
  {!isDefaultCalendar && (
    <button
      className="regular-button my8"
      onClick={e => {
        e.preventDefault();
        setDefaultCalendar(
          calendars,
          activeCalendarIndex,
          context,
          this.handleChange
        );
      }}
    >
      Set As Default Calendar
    </button>
  )}
</div>
