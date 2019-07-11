const createQueuePostDiv = (post, key) => {
  let content = post.content;
  if (post.socialType === "custom") content = post.instructions;
  if (post.socialType === "newsletter") content = post.notes;
  if (post.socialType === "blog") content = post.title;

  return (
    <div
      key={key}
      className="queue-post-container flex py8 button"
      onClick={() => this.props.onSelectPost(post)}
    >
      <div className="queue-post-attribute flex">
        {getPostIcon(post.socialType) && (
          <FontAwesomeIcon
            icon={getPostIcon(post.socialType)}
            style={{ color: getPostColor(post.socialType) }}
            size="2x"
          />
        )}
        {!getPostIcon(post.socialType) && <div>{post.socialType}</div>}
      </div>

      <div className="queue-post-attribute">
        {new moment(post.postingDate).format("LLL")}
      </div>
      <div className="queue-post-attribute important">{content}</div>
      <div className="queue-post-attribute">
        <FileUpload
          currentFiles={post.files ? post.files : []}
          hideUploadButton={true}
          id="xyz"
          imageClassName="flex image tiny"
        />
      </div>
    </div>
  );
};

const addMonth = props => {
  let { calendarDate } = props;
  const { onDateChange } = props;

  calendarDate.add(1, "months");
  onDateChange(calendarDate);
};

const subtractMonth = props => {
  let { calendarDate } = props;
  const { onDateChange } = props;

  calendarDate.subtract(1, "months");
  onDateChange(calendarDate);
};
