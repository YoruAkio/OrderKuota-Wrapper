import { FileRegistry } from "../models/FileRegistry.js";
import { isFile } from "./fs.js";
import { i18n, NormalizedPathUtils } from "#utils";
export class ValidatingFileRegistry extends FileRegistry {
    register(sourcePath, relativePath) {
        const absolute = NormalizedPathUtils.resolve(NormalizedPathUtils.dirname(sourcePath), relativePath);
        const absoluteWithoutAnchor = absolute.replace(/#.*/, "");
        if (!isFile(absoluteWithoutAnchor)) {
            return;
        }
        return this.registerAbsolute(absolute);
    }
    fromObject(de, obj) {
        for (const [key, val] of Object.entries(obj.entries)) {
            const absolute = NormalizedPathUtils.resolve(de.projectRoot, val);
            if (!isFile(absolute)) {
                de.logger.warn(i18n.saved_relative_path_0_resolved_from_1_is_not_a_file(val, de.projectRoot));
                continue;
            }
            de.oldFileIdToNewFileId[+key] = this.registerAbsolute(absolute).target;
        }
        de.defer((project) => {
            for (const [media, reflId] of Object.entries(obj.reflections)) {
                const refl = project.getReflectionById(de.oldIdToNewId[reflId]);
                if (refl) {
                    this.mediaToReflection.set(de.oldFileIdToNewFileId[+media], refl.id);
                }
                else {
                    de.logger.warn(i18n.serialized_project_referenced_0_not_part_of_project(reflId.toString()));
                }
            }
        });
    }
}
