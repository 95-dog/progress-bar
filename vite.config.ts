import {defineConfig} from 'vite';

export default defineConfig({
    server: {
        open: 'http://progress-bar.test',
    },

    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: "terser",
        terserOptions: {
            // 清除console和debugger
            compress: {
                // drop_console: true,
                // drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            //laravel input: 已定义
            // input: ['resources/home/js/index.ts'],
            output: {
                // 静态资源打包做处理
                chunkFileNames: 'js/[hash].min.js',
                entryFileNames: 'js/[hash].min.js',
                assetFileNames: function (file) {
                    let ext = file.name.substring(file.name.lastIndexOf(".") + 1),
                        img = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'],
                        video = ['mp4', 'ts', 'avi', 'rmvb'];

                    if (img.indexOf(ext.toLowerCase()) !== -1) {
                        return "images/[hash].[ext]"
                    }
                    // if (video.indexOf(ext.toLowerCase()) !== -1) {
                    //     return "video/[hash].[ext]";
                    // }

                    return '[ext]/[hash].min.[ext]';
                },
            }
        }
    },
})
