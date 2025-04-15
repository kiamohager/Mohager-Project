import esbuild from "esbuild";

const isProduction = process.env.NODE_ENV === "production";

async function buildLambdaFunction(entrypoint, directory, watch = false) {
    const target = { bundle: true, platform: "node", sourcemap: true, target: "node18" };
    const productionOptions = { minify: true, treeShaking: true };
    const options = {
        entryPoints: [entrypoint],
        outdir: directory,
        ...target,
        ...(isProduction && productionOptions)
    };
    const build = watch ? esbuild.context : esbuild.build;
    return await build(options);
}

await buildLambdaFunction("src/lambdas/index.ts", "dist/trackStats");
