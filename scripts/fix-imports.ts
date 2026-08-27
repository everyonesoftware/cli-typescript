import { Project, SourceFile } from "ts-morph";
import path from "node:path";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const sourceFiles: SourceFile[] = project.getSourceFiles([
    "sources/**/*.ts",
    "tests/**/*.ts",
]);

for (const sourceFile of sourceFiles)
{
    let changed: boolean = false;

    const fixSpecifier = (specifier: string): string =>
    {
        // Ignore non-relative imports
        if (!specifier.startsWith("./") && !specifier.startsWith("../"))
        {
            return specifier;
        }

        // Already has an extension?
        if (/\.[a-z0-9]+$/i.test(specifier))
        {
            return specifier;
        }

        const abs = path.resolve(path.dirname(sourceFile.getFilePath()), specifier);

        const fileCandidates = [
            abs + ".ts",
            abs + ".tsx",
            abs + ".mts",
            abs + ".cts",
        ];

        for (const candidate of fileCandidates)
        {
            if (project.getSourceFile(candidate))
            {
                return specifier + ".js";
            }
        }

        const indexCandidates = [
            path.join(abs, "index.ts"),
            path.join(abs, "index.tsx"),
            path.join(abs, "index.mts"),
            path.join(abs, "index.cts"),
        ];

        for (const candidate of indexCandidates)
        {
            if (project.getSourceFile(candidate))
            {
                return specifier + "/index.js";
            }
        }

        console.warn(
            `Couldn't resolve '${specifier}' from ${sourceFile.getBaseName()}`
        );

        return specifier;
    };

    for (const decl of sourceFile.getImportDeclarations())
    {
        const oldSpecifier = decl.getModuleSpecifierValue();
        const newSpecifier = fixSpecifier(oldSpecifier);

        if (oldSpecifier !== newSpecifier)
        {
            decl.setModuleSpecifier(newSpecifier);
            changed = true;
        }
    }

    for (const decl of sourceFile.getExportDeclarations())
    {
        const oldSpecifier = decl.getModuleSpecifierValue();

        if (!oldSpecifier)
        {
            continue;
        }

        const newSpecifier = fixSpecifier(oldSpecifier);

        if (oldSpecifier !== newSpecifier)
        {
            decl.setModuleSpecifier(newSpecifier);
            changed = true;
        }
    }

    if (changed)
    {
        console.log(`Updated ${sourceFile.getBaseName()}`);
    }
}

await project.save();

console.log("Done!");