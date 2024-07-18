import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default [
    {
        input: 'src/js/dogProgress-bar.ts',
        plugins: [typescript()],
        output: [
            {
                file: 'dist/js/dogProgress-bar.cjs.js',
                format: 'cjs',
                name: 'DogProgress',
                sourcemap: true
            },
            {
                file: 'dist/js/dogProgress-bar.cjs.min.js',
                format: 'cjs',
                name: 'DogProgress',
                sourcemap: true
            },
            {
                file: 'dist/js/dogProgress-bar.js',
                format: 'umd',
                name: 'DogProgress',
                sourcemap: true
            },
            {
                file: 'dist/js/dogProgress-bar.min.js',
                format: 'umd',
                name: 'DogProgress',
                sourcemap: true,
                plugins: [terser()]
            },
            {
                file: 'dist/js/dogProgress-bar.esm.js',
                format: 'es',
                name: 'DogProgress',
                sourcemap: true,
            },
            {
                file: 'dist/js/dogProgress-bar.esm.min.js',
                format: 'es',
                name: 'DogProgress',
                sourcemap: true,
                plugins: [terser()]
            }
        ],
    }
];
