/// <reference types="vite/client" />

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vbot-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        token?: string;
        headless?: string;
        config?: string;
        'base-url'?: string;
        baseUrl?: string;
        ref?: React.RefObject<any>;
        key?: string;
      };
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'vbot-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        token?: string;
        headless?: string;
        config?: string;
        'base-url'?: string;
        baseUrl?: string;
        ref?: React.RefObject<any>;
        key?: string;
      };
    }
  }
}
