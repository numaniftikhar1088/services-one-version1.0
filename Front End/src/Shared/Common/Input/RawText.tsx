import useLang from "./../../hooks/useLanguage";
const RawText = (props: any) => {
  const { t } = useLang();
  const renderWithClickableLink = (text: string, url: string) => {
    const parts = text.split(/click here/i);
    if (parts.length === 1) return text;
    return (
      <>
        {parts[0]}
        <a
          href={url}
          target="_blank"
        >
          <span className="fw-bold">click here</span>
        </a>
        {parts[1]}
      </>
    );
  };

  const translatedText = t(props.label);
  const content =
    props.linkUrl
      ? renderWithClickableLink(translatedText, props.linkUrl)
      : translatedText;

  return (
    <>
      {props.sectionId === 36 ? (
        <div
          className={`${props.parentDivClassName || ""} pb-2 border-solid border-bottom border-gray-300 mb-3 mt-1`}
        >
          <p className="text-wrap fw-600 text-dark text-capitalize p-0 m-0">
            {content}
          </p>
        </div>
      ) : props.sectionId === 17 ? (
        <h6 className="text-primary text-wrap mb-5">{content}</h6>
      ) : props.sectionId === 89 ? (
        <><h6 className="text-wrap mb-5">{content}</h6></>
      ) :
        (
          <div className={props.parentDivClassName}>
            <p className="text-gray-600 text-wrap">{content}</p>
          </div >
        )}
    </>
  );
};

export default RawText;
