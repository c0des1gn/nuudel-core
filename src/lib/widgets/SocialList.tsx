import React, { FC, CSSProperties } from 'react';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

type socialtype =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'whatsapp';

interface ISocial {
  name: socialtype;
  link: string;
}
interface IProps {
  items?: ISocial[];
  style?: CSSProperties;
}

const components = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
};

export const SocialList: FC<IProps> = ({ items = [], ...props }) => {
  return (
    <div className={'widget-social-list'} style={props.style}>
      {items.map(item => {
        let name = item.name?.toLowerCase();
        if (!!name && Object.keys(components).indexOf(name) >= 0) {
          const Component = components[name];
          return (
            <IconButton
              href={item.link}
              title={item.name}
              target="_blank"
              className={'widget-social-' + name}
            >
              <Component className="widget-social-icon" />
            </IconButton>
          );
        } else {
          return null;
        }
      })}
      {props.children}
    </div>
  );
};
