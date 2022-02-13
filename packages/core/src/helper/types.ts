import type { namedTypes } from "ast-types";

export interface RenameOptions<T = namedTypes.Identifier> {
  identifier: T;
  newName: string;
  originName?: string;
  shouldUpdate?: (...args: any[]) => boolean;
}
