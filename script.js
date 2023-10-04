async function getFile() {
  const openOptions = {
    types: [
      {
        description: "Choose file",
        accept: {
          "text/*": [".txt", ".troy"],
        },
      },
    ],
    excludeAcceptAllOption: true,
  };
  try {
    const [fileHandle] = await window.showOpenFilePicker(openOptions);
    const file = await fileHandle.getFile();
    const fileText = await file.text();
    convertToJSON(fileText, file.name);
  } catch (error) {
    console.log(error);
  }
}

function convertToJSON(text, name) {
  const emitters = text.split(/\n\r/);
  const properties = emitters.map((e) => e.match(/\'?([a-z]+)-?(\w+)(?=\=)/gi));
  const values = emitters.map((e) =>
    e.match(/(\d+(\.\d+)?(\s\d+(\.\d+)?)*)(?![\w\=])|[\w-_\.\/]+(?=\")/gi)
  );
  const troyJSON = [];

  for (let i = 0; i < emitters.length; i++) {
    const name = emitters[i].match(/\w+(?=\])/);
    troyJSON.push({
      [name]: {},
    });
    for (let j = 0; j < properties[i]?.length; j++) {
      troyJSON[i][name][properties[i][j]] = values[i][j];
    }
  }
  const json = JSON.stringify(troyJSON);
  writeJSON(json, name);
}

async function writeJSON(stringified, defaultName) {
  const saveOptions = {
    types: [
      {
        description: "JSON file",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    suggestedName: defaultName.replace(".txt", ".json"),
  };
  const formated = stringified
    .replace("[", "[\n\t")
    .replaceAll(":{", ": {\n\t\t\t")
    .replaceAll(/{(?=\")/g, "{\n\t\t")
    .replaceAll(/}(?=})/g, "}\n\t")
    .replaceAll(/,(?=\")/g, ",\n\t\t\t")
    .replaceAll(/,(?={)/g, ",\n\t")
    .replaceAll('"}', '"\n\t\t}')
    .replaceAll(':"', ': "')
    .replace("]", "\n]\n");
  try {
    let fileHandle = await window.showSaveFilePicker(saveOptions);
    const stream = await fileHandle.createWritable();
    await stream.write(formated);
    await stream.close();
  } catch (error) {
    console.log(error);
  }
}
