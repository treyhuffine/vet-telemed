import { SyntheticEvent } from 'react';

export const FREEZE_CLASS = 'freeze';

export enum KeyCodes {
  Tab = 'Tab',
  Backspace = 'Backspace',
  Enter = 'Enter',
  Esc = 'Escape',
  Space = 'Space',
}

export const isLastChild = (el: HTMLDivElement) => !el.nextElementSibling;

export const hasChildren = (el: HTMLElement | null) => !!el && el.hasChildNodes();

export const freezeBody = () => {
  document.body.classList.add(FREEZE_CLASS);
};

export const unfreezeBody = () => {
  document.body.classList.remove(FREEZE_CLASS);
};

export const isScrolledToBottom = () => {
  return window.innerHeight + window.pageYOffset + 1 >= document.body.offsetHeight;
};

export const canUseDOM = (): boolean => {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
};

export const blockEvent = (e: SyntheticEvent<EventTarget>) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent?.stopImmediatePropagation();
};
