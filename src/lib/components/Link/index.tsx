import React, { CSSProperties } from 'react';
import NextLink from 'next/link';
import { Link as MuiLink, LinkProps, SxProps, Theme } from '@mui/material';
import { isServer } from 'nuudel-utils';
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
  legacyBehavior?: boolean;
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
      underline = 'hover',
      legacyBehavior,
      ...props
    },
    ref
  ) => {
    return !legacyBehavior ? (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        locale={locale}
        ref={ref}
        underline={underline}
        {...(props as any)}
      >
        {children}
      </NextLink>
    ) : (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        locale={locale}
        legacyBehavior
      >
        <a ref={ref} underline={underline} {...(props as any)}>
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
  style?: CSSProperties;
  sx?: SxProps<Theme>;
  id?: string;
  disabled?: boolean;
  legacyBehavior?: boolean;
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
      sx,
      ...props
    },
    ref
  ) => {
    const pathname =
      typeof href === 'string' ? href : href?.pathname ? href.pathname : '';
    const className = clsx(classNameProps, {
      [activeClassName]:
        !!activeClassName &&
        !isServer &&
        require('next/router')?.pathname === pathname,
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
        <MuiLink className={className} href={href} ref={ref} sx={sx} {...props}>
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
