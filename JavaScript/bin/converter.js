const {readFile, writeFile} = require("node:fs/promises");

/**
 * Accepts a path to a file for conversion.
 *
 * @param {string} path - a path to the file to convert.
 * @returns {Promise<void>}
 */
async function handleToJSON(path) {
    try {
        const fileContent = await readFile(path, {encoding: 'utf-8'});

        convert(path, fileContent);
    } catch (err) {
        console.log(err.message)
    }
}

/**
 * Transforms the troy file plain text into an object.
 *
 * @param {string} path - the path of the file.
 * @param {string} content - the utf-8 content of the file.
 * @returns {Promise<void>}
 */
function convert(path, content) {
    try {
        const emitters = content.split(/\n\r/);
        const properties = emitters.map((e) => e.match(/\'?([a-z]+)-?(\w+)(?=\=)/gi));
        const values = emitters.map((e) =>
            e.match(/-?(\d+(\.\d+)?(\s(-)?\d+(\.\d+)?)*)(?![\]\w\=])|[\w-_\.\/]+(?=\")/gi)
        );

        const troyJSON = {};

        for (let i = 0; i < emitters.length; i++) {
            const name = emitters[i].match(/\w+(?=\])/);

            if (name) troyJSON[name] = {};
            for (let j = 0; j < properties[i]?.length; j++) {
                troyJSON[name][properties[i][j]] = values[i][j];
            }
        }

        writeJSON(path, JSON.stringify(troyJSON, null, 2));

    } catch (err) {
        console.log(err.message);
    }
}

/**
 * Rewrite the .troy file into a JSON.
 *
 * @param {string} path - the path of the file.
 * @param {string} json - the troy object "stringified".
 * @returns {Promise<void>}
 */
async function writeJSON(path, json) {
    try {
        const outpath = path.replace(".troy", ".json");

        await writeFile(outpath, json, {encoding: 'utf8'})
            .then(() => console.log('File converted successfully!'));
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    handleToJSON,
}
