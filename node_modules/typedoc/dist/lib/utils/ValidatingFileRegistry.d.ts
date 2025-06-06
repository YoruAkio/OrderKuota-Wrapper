import { FileRegistry } from "../models/FileRegistry.js";
import type { Deserializer, JSONOutput } from "#serialization";
import { type NormalizedPath } from "#utils";
export declare class ValidatingFileRegistry extends FileRegistry {
    register(sourcePath: NormalizedPath, relativePath: NormalizedPath): {
        target: number;
        anchor: string | undefined;
    } | undefined;
    fromObject(de: Deserializer, obj: JSONOutput.FileRegistry): void;
}
