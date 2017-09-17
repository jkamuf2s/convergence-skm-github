import {RealTimeElement} from "./RealTimeElement";
import {ObservableElementEvents} from "../observable/ObservableElement";

export interface RealTimeBasicRichTextEvents extends ObservableElementEvents {

}

export type BasicRichTextPosition = number | BlockOffset;
export type BlockOffset = {blockIndex: number, offset: number};

export class RealTimeBasicRichText extends RealTimeElement<BasicRichTextContent> {

  // Block Manipulation
  public insertBlock(index: number, type: string, attributes?: {[key: string]: any}): void;
  public getBlockType(index: number): string;
  public setBlockType(index: number, type: string): void;

  public setBlockAttributes(index: number, attributes: {[key: string]: any}): void;
  public getBlockAttributes(index: number): {[key: string]: any};
  public mergeBlockAttributes(index: number, attributes: {[key: string]: any}): void;
  public removeBlock(index: number): void;

  // Inline Manipulation
  public insertText(position: BasicRichTextPosition, text: string): void;
  public insertEmbedded(position: BasicRichTextPosition, type: string, value: any): void;
  public removeInline(position: BasicRichTextPosition, length: number): void;
  public getInlineType(position: BasicRichTextPosition): string;
  public getInlineAttributes(position: BasicRichTextPosition): {[key: string]: any};
  public setInlineAttributes(position: BasicRichTextPosition, length: number, attributes: {[key: string]: any}): void;
  public mergeInlineAttributes(position: BasicRichTextPosition, length: number, attributes: {[key: string]: any}): void;

  // Common
  public getAttributes(position: BasicRichTextPosition): BasicRichTextFormatting;
  public getLenth(): number;
}

export interface BasicRichTextFormatting {
  block: {[key: string]: any};
  inline: {[key: string]: any};
  combined: {[key: string]: any};
}

export class BasicRichTextContent {
  public blocks: BasicRichTextBlock[];
}

export class BasicRichTextBlock {
  public type: string;
  public attributes: {[key: string]: any};
  public elements: RealTimeBasicRichElement[];
}

export class RealTimeBasicRichElement {
  public attributes: {[key: string]: any};
  public type: string;
  public data: any;
}
