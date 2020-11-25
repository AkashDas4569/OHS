import { QueryParamsHandling } from '@angular/router';
export interface NavAttributes {
    [propName: string]: any;
}
export interface NavWrapper {
    attributes: NavAttributes;
    element: string;
}
export interface NavBadge {
    text: string;
    variant: string;
    class?: string;
}
export interface NavLabel {
    class?: string;
    variant: string;
}
export interface NavLinkProps {
    queryParams?: {
        [key: string]: any;
    };
    fragment?: string;
    queryParamsHandling?: QueryParamsHandling;
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    state?: {
        [key: string]: any;
    };
    routerLinkActiveOptions?: {
        exact: boolean;
    };
    routerLinkActive?: string | string[];
}

export interface NavData {
  usertype?: string;
  name?: string;
  url?: string | any[];
  href?: string;
  type?: 'link' | 'button';
  icon?: string;
  iconType?: 'fa' | 'mat' | 'img';
  img?: string;
  badge?: NavBadge;
  title?: boolean;
  show?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
  linkProps?: NavLinkProps;
  state?: 'close' | string;
  rightArrow?: boolean;
}
