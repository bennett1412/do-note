import React from "react";
import type { IconProps as RadixIconProps } from "@radix-ui/react-icons/dist/types";

// Radix icons use width/height, not size. Wrap them for convenience.
function wrap(Icon: React.ForwardRefExoticComponent<RadixIconProps>) {
  return ({ size, width, height, ...props }: RadixIconProps & { size?: number }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(Icon as any, {
      width: size ?? width ?? 24,
      height: size ?? height ?? 24,
      ...props,
    });
}

import { PlusIcon as _PlusIcon } from "@radix-ui/react-icons";
import { Cross2Icon as _CloseIcon } from "@radix-ui/react-icons";
import { HomeIcon as _HomeIcon } from "@radix-ui/react-icons";
import { FileTextIcon as _FileTextIcon } from "@radix-ui/react-icons";
import { ExitIcon as _LogOutIcon } from "@radix-ui/react-icons";
import { CopyIcon as _CopyIcon } from "@radix-ui/react-icons";
import { CheckIcon as _CheckIcon } from "@radix-ui/react-icons";
import { TrashIcon as _DeleteIcon } from "@radix-ui/react-icons";
import { ListBulletIcon as _ListIcon } from "@radix-ui/react-icons";
import { HeadingIcon as _HeadingIcon } from "@radix-ui/react-icons";
import { CheckboxIcon as _ChecklistIcon } from "@radix-ui/react-icons";
import { ImageIcon as _ImageIcon } from "@radix-ui/react-icons";
import { CheckCircledIcon as _CloudCheckIcon } from "@radix-ui/react-icons";
import { GearIcon as _PaletteIcon } from "@radix-ui/react-icons";

export const PlusIcon = wrap(_PlusIcon);
export const CloseIcon = wrap(_CloseIcon);
export const HomeIcon = wrap(_HomeIcon);
export const FileTextIcon = wrap(_FileTextIcon);
export const LogOutIcon = wrap(_LogOutIcon);
export const CopyIcon = wrap(_CopyIcon);
export const CheckIcon = wrap(_CheckIcon);
export const DeleteIcon = wrap(_DeleteIcon);
export const ListIcon = wrap(_ListIcon);
export const HeadingIcon = wrap(_HeadingIcon);
export const ChecklistIcon = wrap(_ChecklistIcon);
export const ImageIcon = wrap(_ImageIcon);
export const CloudCheckIcon = wrap(_CloudCheckIcon);
export const PaletteIcon = wrap(_PaletteIcon);
