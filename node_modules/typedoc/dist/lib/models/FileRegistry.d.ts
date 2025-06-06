import type { Deserializer, JSONOutput, Serializer } from "#serialization";
import type { ProjectReflection, Reflection } from "./index.js";
import type { ReflectionId } from "./Reflection.js";
import { type NormalizedPath } from "#utils";
export declare class FileRegistry {
    protected nextId: number;
    protected mediaToReflection: Map<number, ReflectionId>;
    protected mediaToPath: Map<number, NormalizedPath>;
    protected reflectionToPath: Map<ReflectionId, NormalizedPath>;
    protected pathToMedia: Map<NormalizedPath, number>;
    protected names: Map<number, string>;
    protected nameUsage: Map<string, number>;
    registerAbsolute(absolute: NormalizedPath): {
        target: number;
        anchor: string | undefined;
    };
    registerReflection(absolute: NormalizedPath, reflection: Reflection): void;
    getReflectionPath(reflection: Reflection): string | undefined;
    register(sourcePath: NormalizedPath, relativePath: NormalizedPath): {
        target: number;
        anchor: string | undefined;
    } | undefined;
    removeReflection(reflection: Reflection): void;
    resolve(id: number, project: ProjectReflection): string | Reflection | undefined;
    getName(id: number): string | undefined;
    getNameToAbsoluteMap(): ReadonlyMap<string, string>;
    toObject(ser: Serializer): JSONOutput.FileRegistry;
    /**
     * Revive a file registry from disc.
     * Note that in the packages context this may be called multiple times on
     * a single object, and should merge in files from the other registries.
     */
    fromObject(de: Deserializer, obj: JSONOutput.FileRegistry): void;
}
