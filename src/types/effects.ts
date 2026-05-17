import React from "react";

export type AttrValue = string | string[];

export type TagAttrs = Record<string, AttrValue>;

export type ImageAttrs = Record<string, string>;

export interface EffectComponentProps {
  attrs: TagAttrs;
  children?: React.ReactNode;
}

export type ImageComponentProps = {
  url: string;
  attrs: Record<string, string>;
  adjacentText?: string;
};

export type EffectComponent = React.ComponentType<EffectComponentProps>;

export type ImageComponent = React.ComponentType<ImageComponentProps>;

export type EffectRegistry = Record<string, EffectComponent>;

export type ImageRegistry = Record<string, ImageComponent>;
