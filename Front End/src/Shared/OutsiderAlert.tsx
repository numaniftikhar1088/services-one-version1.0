import { useEffect, useRef } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref: any,
  setSuggestions: any,
  setSearchedValue: any,
  setSelectedSuggestion: any,
  setActiveSuggestion: any,
  setTouched: any
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        //setSearchedValue()
        setSuggestions([]);
        setSelectedSuggestion("");
        setActiveSuggestion(0);
        setTouched(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props: any) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(
    wrapperRef,
    props?.setSuggestions,
    props?.setSearchedValue,
    props.setSelectedSuggestion,
    props.setActiveSuggestion,
    props.setTouched
  );

  return (
    <div className={props?.displayType} ref={wrapperRef}>
      {props.children}
    </div>
  );
}

export default OutsideAlerter;
