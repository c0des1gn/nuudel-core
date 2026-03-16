import React, { ComponentType, useEffect, useRef, useCallback } from 'react';
import { IIframe } from './types';

const Iframe: ComponentType<IIframe> = ({
  url,
  allowFullScreen,
  position,
  display,
  height,
  width,
  overflow,
  styles,
  onLoad,
  onMouseOver,
  onMouseOut,
  onClose,
  hidden,
  scrolling,
  id,
  frameBorder,
  ariaHidden,
  sandbox,
  allow,
  className,
  title,
  ariaLabel,
  ariaLabelledby,
  name,
  target,
  loading,
  importance,
  referrerpolicy,
  allowpaymentrequest,
  src,
}: IIframe) => {
  const iframeRef = useRef<null | HTMLIFrameElement>(null);

  const _iframeOnLoad = (): void => {
    try {
      // for cross origin requests we can have issues with accessing frameElement
      iframeRef.current.contentWindow.frameElement['cancelPopUp'] = onClose;
    } catch (err) {
      if (err.name !== 'SecurityError') {
        throw err;
      }
    }
    if (onLoad) {
      onLoad();
    }
  };

  const defaultProps: any = {
    src: src || url,
    target: target || null,
    style: {
      position: position || null,
      display: display || 'block',
      overflow: overflow || null,
    },
    scrolling: scrolling || null,
    allowpaymentrequest: allowpaymentrequest || null,
    importance: importance || null,
    sandbox: sandbox || null,
    loading: loading || null,
    styles: styles || null,
    name: name || null,
    className: className || null,
    referrerpolicy: referrerpolicy || null,
    title: title || null,
    allow: allow || null,
    id: id || null,
    'aria-labelledby': ariaLabelledby || null,
    'aria-hidden': ariaHidden || null,
    'aria-label': ariaLabel || null,
    hidden: hidden || null,
    width: width || null,
    height: height || null,
    onLoad: _iframeOnLoad || null,
    onMouseOver: onMouseOver || null,
    onMouseOut: onMouseOut || null,
  };
  let props = Object.create(null);
  for (let prop of Object.keys(defaultProps)) {
    if (defaultProps[prop] != null) {
      props[prop] = defaultProps[prop];
    }
  }

  for (let i of Object.keys(props.style)) {
    if (props.style[i] == null) {
      delete props.style[i];
    }
  }

  if (allowFullScreen) {
    if ('allow' in props) {
      const currentAllow = props.allow.replace('fullscreen', '');
      props.allow = `fullscreen ${currentAllow.trim()}`.trim();
    } else {
      props.allow = 'fullscreen';
    }
  }

  if (frameBorder >= 0) {
    if (!props.style.hasOwnProperty('border')) {
      props.style.border = frameBorder;
    }
  }

  const iframeCallbackRef = useCallback(
    (node: null | HTMLIFrameElement): void => {
      iframeRef.current = node;
    },
    [],
  );
  /*
  useEffect(() => {
    const onBlur = () => {
      if (
        document.activeElement &&
        document.activeElement.nodeName.toLowerCase() === 'iframe' &&
        iframeRef.current &&
        iframeRef.current === document.activeElement &&
        props.onInferredClick
      ) {
        // infer a click event
        props.onInferredClick(iframeRef.current);
      }
    };

    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('blur', onBlur);
    };
  }, []); // */
  return <iframe frameBorder={0} {...props} ref={iframeCallbackRef} />; //return <div dangerouslySetInnerHTML={{ __html: "<iframe src='"+props.src +"' />"}} />;
};

export default Iframe;
