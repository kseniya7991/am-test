const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const postcssPresetEnv = require("postcss-preset-env");

const isDev = process.argv[2] !== "--env=build";

const SCRIPTS = (env) =>
    createConfig({
        isDev,
        entry: "./src/index.js",
        outputFile: "./dist/index.min.js",
        cssFile: "./css/index.min.css",
        copyFiles: [
            // {
            //     from: "./src/img",
            //     to: "./img",
            // },
            // {
            //     from: "./src/video",
            //     to: "./video",
            // },
            // {
            //     from: "./src/fonts",
            //     to: "./fonts",
            // },
        ],
    });

const createConfig = ({ isDev, entry, outputFile, cssFile, copyFiles }) => {
    return {
        mode: !isDev ? "production" : "development",
        entry: path.resolve(__dirname, entry),
        output: {
            path: path.resolve(__dirname, path.dirname(outputFile)),
            filename: path.basename(outputFile),
            clean: true,
        },
        devServer: {
            static: {
                directory: path.resolve(__dirname, "dist"), // Путь к статическим файлам
            },
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: [".js", ".css", ".scss", ".png", ".svg"],
            alias: {
                img: path.resolve(process.cwd(), "src/img"),
                svg: path.resolve(process.cwd(), "src/img/svg"),
                js: path.resolve(process.cwd(), "src/js"),
                css: path.resolve(process.cwd(), "src/css"),
            },
        },
        optimization: {
            minimizer: [
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            "default",
                            {
                                discardComments: {
                                    removeAll: true,
                                },
                            },
                        ],
                    },
                }),
                new TerserPlugin(),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: cssFile,
            }),
            // new CopyWebpackPlugin({
            //     patterns: copyFiles,
            // }),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                filename: "index.html",
            }),
        ],
        devtool: !isDev ? false : "source-map",
    };
};

module.exports = [SCRIPTS];
