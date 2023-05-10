import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Link as MuiLink, LinkProps } from '@mui/material';
import clsx from 'clsx';

interface INextLinkProps extends LinkProps {
  href?: any;
  linkAs?: object | string;
  locale?: string;
  passHref?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  to: object | string;
  children?: any;
}

const NextLinkComposed: React.FC<INextLinkProps> = React.forwardRef<
  HTMLAnchorElement,
  INextLinkProps
>(
  (
    {
      children,
      to,
      linkAs,
      href,
      replace,
      scroll,
      passHref,
      shallow,
      prefetch,
      locale,
      ...props
    },
    ref
  ) => {
    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        locale={locale}
      >
        <a ref={ref} {...(props as any)}>
          {children}
        </a>
      </NextLink>
    );
  }
);

interface ILinkProps {
  activeClassName?: string;
  title?: string;
  as?: any | string;
  className?: string;
  href?: any;
  passHref?: boolean;
  noLinkStyle?: boolean;
  role?: string;
  target?: string;
  onClick?(e: any);
  color?: string | any;
  children?: any;
  style?: React.CSSProperties;
  id?: string;
  disabled?: boolean;
}

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
const Link: React.FC<ILinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ILinkProps
>(
  (
    {
      children,
      activeClassName = 'active',
      as: linkAs,
      className: classNameProps,
      href,
      noLinkStyle,
      role, // Link don't have roles.
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const pathname =
      typeof href === 'string'
        ? href
        : href && href.pathname
        ? href.pathname
        : '';
    const className = clsx(classNameProps, {
      [activeClassName]: router.pathname === pathname && activeClassName,
    });

    const isExternal =
      (typeof href === 'string' &&
        (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)) ||
      props.onClick;

    if (isExternal) {
      if (noLinkStyle) {
        return (
          <a className={className} href={href} ref={ref} {...props}>
            {children}
          </a>
        );
      }

      return (
        <MuiLink className={className} href={href} ref={ref} {...props}>
          {children}
        </MuiLink>
      );
    }

    if (noLinkStyle) {
      return (
        <NextLinkComposed className={className} ref={ref} to={href} {...props}>
          {children}
        </NextLinkComposed>
      );
    }

    return (
      <MuiLink
        component={NextLinkComposed}
        linkAs={linkAs}
        className={className}
        ref={ref}
        to={href}
        {...props}
      >
        {children}
      </MuiLink>
    );
  }
);

export default Link;

//const Link: React.FC<ILinkProps> = ({ children, ...props }) => ( <NextLink {...props}>{children}</NextLink> );
