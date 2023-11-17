import { Oyc } from "./oyc";

/**
 * These are custom overrides for Oyc's purposes.
 *
 * Please, before copying any of these read their description and reasoning.
 * Some may be useful outside of this project, but they are, by definition, unsafe.
 */

declare global {
  /**
   * Patch Oyc into the window object.
   */
  interface Window {
    oyc: Oyc;
  }

  // The override below DOESN'T WORK. No idea why. Leaving this here as a breadcrumb

  /**
   * This isn't safe. The spec says it's an EventTarget.
   * The order of inheritance is:
   * EventTarget -> Node -> Element -> HTMLElement
   *
   * In Oyc's case events are always going to be HTMLElements.
   * Don't want to do a instanceof check every time we use an event.
   */
  // interface EventOYC {
  //     readonly currentTarget: HTMLElement;
  //     readonly target: HTMLElement;
      
  //     readonly bubbles: boolean;
  //     cancelBubble: boolean;
  //     readonly cancelable: boolean;
  //     readonly composed: boolean;
  //     readonly defaultPrevented: boolean;
  //     readonly eventPhase: number;
  //     readonly isTrusted: boolean;
  //     returnValue: boolean;
  //     readonly srcElement: EventTarget | null;
  //     readonly timeStamp: DOMHighResTimeStamp;
  //     readonly type: string;
  //     composedPath(): EventTarget[];
  //     initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
  //     preventDefault(): void;
  //     stopImmediatePropagation(): void;
  //     stopPropagation(): void;
  //     readonly NONE: 0;
  //     readonly CAPTURING_PHASE: 1;
  //     readonly AT_TARGET: 2;
  //     readonly BUBBLING_PHASE: 3;
  //     test: boolean;
  // }

  // interface Event extends EventOYC {}

  // declare var Event: {
  //   prototype: EventOYC;
  //   new(type: string, eventInitDict?: EventInit): EventOYC;
  //   readonly NONE: 0;
  //   readonly CAPTURING_PHASE: 1;
  //   readonly AT_TARGET: 2;
  //   readonly BUBBLING_PHASE: 3;
  // };
}

