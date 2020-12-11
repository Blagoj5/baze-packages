import React, { useEffect, useRef, useState } from 'react';
// import styles from './ShowMore.module.scss';
import styles from './styles/styles';

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  button?: JSX.Element;
  anchor?: string;
  maxHeight?: number;
  className?: string;
  classNameButton?: string;
  classNameButtonDiv?: string;
  style?: React.CSSProperties | undefined;
  styleButton?: React.CSSProperties | undefined;
  styleButtonDiv?: React.CSSProperties | undefined;
  defaultAnchor?: boolean;
  backgroundColor?: string;
  onChange?: (showValue: boolean) => void;
}
// TODO: Future, create showMore component that will concat the whole content. That means that it won't show it (because like this you can see it with inspect element)
const ShowMore: React.FC<Props> = ({
  maxHeight = 400,
  children,
  button,
  className,
  classNameButton,
  classNameButtonDiv,
  style,
  styleButton,
  styleButtonDiv,
  anchor,
  defaultAnchor = false,
  backgroundColor = '#fff',
  onChange,
}) => {
  const [showMore, setShowMore] = useState<boolean | string>('hide');
  const divRef = useRef<HTMLDivElement>(null);
  const buttonDivRef = useRef<HTMLDivElement>(null);

  // On mount, Check if height matches
  useEffect(() => {
    if (divRef.current) {
      // TODO: In the future, maybe make it responsive (if you change content to automatically decide whenever it should show content or not, that can be done by adding event listener on height change on main div -> divRef, and do the check bellow but inside eventListener)
      // Check the height, to know if you need to display showMoreButton or not.
      if (maxHeight > divRef.current.offsetHeight) {
        setShowMore('hide');
      } else {
        setShowMore(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   Show toggle
  const showToggleHandler = () => {
    const currentShowMore = !showMore;

    setShowMore(!showMore);
    if (onChange) {
      // Need to set !showMore because here it still isn't updated, so i need to send the updated version
      onChange(!showMore);
    }

    if (currentShowMore) {
      if (anchor) {
        document.querySelector(anchor)?.scrollIntoView();
        return;
      }

      if (defaultAnchor) {
        // If you click on Show Less, anchor it
        if (divRef.current) {
          // If the scroll view port is bellow the element that uses showMore
          if (window.scrollY > divRef.current.offsetTop) {
            //   window.scrollTo(0, divRef.current ? divRef.current?.scrollTop : 0);
            // divRef.current?.scrollIntoView();
            document.querySelector('#anchor697948554')?.scrollIntoView();
            return;
          }
        }
      }
    }
  };

  const styleDivInside: React.CSSProperties | undefined = {
    ...styles.ShowMore,
    ...style,
    backgroundColor,
  };
  const styleButtonDivInside: React.CSSProperties | undefined = {
    ...styles.ButtonDiv,
    ...styleButtonDiv,
  };
  let buttonText = 'Show More';
  let height: string | number = maxHeight;

  //   showmore can also be uninitialized/true/false
  if (!showMore && showMore !== 'hide') {
    buttonText = 'Show Less';
    height = 'none';
    styleDivInside.overflow = 'visible';
    styleButtonDivInside.position = 'relative';
  }

  let buttonInside: JSX.Element | JSX.Element[] = (
    <button
      className={`${classNameButton ? classNameButton : ''}`}
      onClick={showToggleHandler}
      style={{ ...styles.DefaultButton, ...styleButton }}
    >
      {buttonText}
    </button>
  );

  // debugger;
  // If button provided to prop, add it here
  if (button) {
    // If button is multiple elements
    // if (Array.isArray(button)) {
    //   buttonInside = button.map((element, index) => {
    //     // The first iteration, that's the parent element add showMore here
    //     if (index === 0) {
    //       return React.cloneElement(element, {
    //         ...element.props,
    //         onClick: showToggleHandler,
    //       });
    //     }
    //     return element;
    //   });
    // } else {
    // if button is single element
    buttonInside = React.cloneElement(button, {
      ...button.props,
      onClick: showToggleHandler,
    });
    // }
  }

  let content = children;
  // If content is just a string
  if (typeof children === 'string') {
    content = <p>{children}</p>;
  }

  return (
    <div
      ref={divRef}
      className={className ? className : ''}
      style={{ ...styleDivInside, maxHeight: height }}
    >
      <div id='anchor697948554' style={styles.Anchor}></div>
      {content}
      <div
        style={{
          ...styles.Shadow,
          height: buttonDivRef.current
            ? buttonDivRef.current.offsetHeight
            : 'auto',
          display: showMore === 'hide' ? 'none' : 'block',
        }}
      />
      <div
        className={`${classNameButtonDiv ? classNameButtonDiv : ''}`}
        ref={buttonDivRef}
        style={{
          ...styles.ButtonDiv,
          ...styleButtonDivInside,
          opacity: showMore === 'hide' ? '0' : '1',
          zIndex: showMore === 'hide' ? -1 : 'initial',
        }}
      >
        {/* Ne go rachuna dugmeto zato e do pola golemina ! */}
        {buttonInside}
      </div>
    </div>
  );
};

export default ShowMore;
