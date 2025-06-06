import { ReflectionKind } from 'typedoc';
export function pageTitle() {
    const textContentMappings = this.options.getValue('textContentMappings');
    const pageTitleTemplates = this.options.getValue('pageTitleTemplates');
    const hasCustomPageTitle = this.options.isSet('pageTitleTemplates');
    const indexPageTitle = hasCustomPageTitle
        ? pageTitleTemplates['index']
        : textContentMappings['title.indexPage'];
    const modulePageTitle = hasCustomPageTitle
        ? pageTitleTemplates['module']
        : textContentMappings['title.modulePage'];
    const memberPageTitle = hasCustomPageTitle
        ? pageTitleTemplates['member']
        : textContentMappings['title.memberPage'];
    const page = this.page;
    if (this.urlTo(page.model) === this.urlTo(page.project) &&
        [ReflectionKind.Project, ReflectionKind.Module].includes(page.model.kind)) {
        if (typeof indexPageTitle === 'string') {
            return this.helpers.getProjectName(indexPageTitle, page);
        }
        return indexPageTitle({
            projectName: page?.project?.name,
            version: page?.project?.packageVersion,
        });
    }
    const name = this.partials.memberTitle(page.model);
    const kind = ReflectionKind.singularString(page.model.kind);
    if ([ReflectionKind.Module, ReflectionKind.Namespace].includes(page.model.kind)) {
        if (typeof modulePageTitle === 'string') {
            return getFromString(modulePageTitle, name, kind);
        }
        return modulePageTitle({
            name,
            kind,
        });
    }
    if (typeof memberPageTitle === 'string') {
        return getFromString(memberPageTitle, name, kind);
    }
    const group = getOwningGroupTitle(page.model);
    return memberPageTitle({
        name,
        kind,
        group,
    });
}
function getOwningGroupTitle(reflection) {
    const parent = reflection.parent;
    if (!parent?.groups)
        return null;
    for (const group of parent.groups) {
        if (group.children.some((child) => child.name === reflection.name)) {
            return group.title;
        }
    }
    return null;
}
function getFromString(textContent, name, kind) {
    return textContent.replace('{name}', name).replace('{kind}', kind);
}
