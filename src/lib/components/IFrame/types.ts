export interface IIframe {
  url: string;
  src?: string;
  allowFullScreen?: boolean;
  position?:
    | 'relative'
    | 'absolute'
    | 'fixed'
    | 'sticky'
    | 'static'
    | 'inherit'
    | 'initial'
    | 'unset';
  display?: 'block' | 'none' | 'inline';
  height?: string;
  width?: string;
  loading?: 'auto' | 'eager' | 'lazy';
  target?: string;
  importance?: 'auto' | 'high' | 'low';
  overflow?: string;
  styles?: object;
  name?: string;
  allowpaymentrequest?: boolean;
  referrerpolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  onLoad?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClose?: (e?: boolean) => void;
  hidden?: boolean;
  frameBorder?: number;
  scrolling?: 'auto' | 'yes' | 'no';
  id?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  sandbox?:
    | 'allow-forms'
    | 'allow-modals'
    | 'allow-orientation-lock'
    | 'allow-pointer-lock'
    | 'allow-popups'
    | 'allow-popups-to-escape-sandbox'
    | 'allow-presentation'
    | 'allow-same-origin'
    | 'allow-scripts'
    | 'allow-storage-access-by-user-activation'
    | 'allow-top-navigation'
    | 'allow-top-navigation-by-user-activation';
  allow?: string;
  className?: string;
  title?: string;
  onInferredClick?: (iframe: HTMLIFrameElement) => void;
}