/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
//@ts-nocheck
const fs = require("fs");
var { DOMParser, XMLSerializer } = require("xmldom");

const extractChildrenFromSVG = (svgString: string) => {
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgString, "image/svg+xml");

  const svgElement = svgDocument.documentElement;

  return svgChildrenToString(svgElement.childNodes);
};

const svgChildrenToString = (svgElement: NodeListOf<ChildNode>) => {
  const serializer = new XMLSerializer();
  let pathChild = "";
  Array.from(svgElement).forEach((child: ChildNode) => {
    pathChild += serializer.serializeToString(child);
  });
  return pathChild;
};

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const main = () => {
  const types = fs.readdirSync("svg");
  let exportAll = ``;
  types.forEach((type: string) => {
    const iconNames = fs.readdirSync("svg/" + type);
    let exportIcon = "";
    iconNames.forEach((iconName: string) => {
      const files = fs.readdirSync("svg/" + type + "/" + iconName);
      const svgs = files.filter((file: string) => file.endsWith(".svg"));
      let ex = ``;
      svgs.forEach((style: string) => {
        const svg = fs.readFileSync(
          "svg/" + type + "/" + iconName + "/" + style,
          "utf-8",
        );
        const sName = capitalize(style.split("=")[1].split(".")[0]);

        const content = `import { createSvg } from "src/utils/createSvg";

export const ${iconName + sName} = createSvg(<>${extractChildrenFromSVG(svg)}</>);`;
        try {
          const dir = "src/icons/" + type + "/" + iconName;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFileSync(dir + "/" + sName + ".tsx", content);
          ex += `export * from "./${sName}";\n`;
        } catch (err) {
          console.error(err);
        }
      });
      try {
        const dir = "src/icons/" + type + "/" + iconName;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        fs.writeFileSync(dir + "/index.ts", ex);
      } catch (err) {
        console.error(err);
      }
      const folders = files.filter(
        (file: string) => !file.endsWith(".svg") && !file.endsWith(".zip"),
      );
      let outer = ``;
      folders.forEach((name: string) => {
        const folder = fs
          .readdirSync("svg/" + type + "/" + iconName + "/" + name)
          .filter((file: string) => !file.endsWith(".zip"));
        let styleName = "";
        folder.forEach((style: string) => {
          const svg = fs.readFileSync(
            "svg/" + type + "/" + iconName + "/" + name + "/" + style,
            "utf-8",
          );

          const sName = capitalize(style.split("=")[1].split(".")[0]);

          const content = `import { createSvg } from "src/utils/createSvg";
  
  export const ${iconName + name + sName} = createSvg(<>${extractChildrenFromSVG(svg)}</>);`;
          try {
            const dir = "src/icons/" + type + "/" + iconName + "/" + name;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            fs.writeFileSync(dir + "/" + sName + ".tsx", content);
            styleName += `export * from "./${sName}";\n`;
          } catch (err) {
            console.error(err);
          }
        });
        try {
          const dir = "src/icons/" + type + "/" + iconName + "/" + name;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFileSync(dir + "/index.ts", styleName);
          outer += `export * from "./${name}";\n`;
        } catch (err) {
          console.error(err);
        }
      });
      if (folders.length > 0) {
        try {
          const dir = "src/icons/" + type + "/" + iconName;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFileSync(dir + "/index.ts", outer);
          exportIcon += `export * from "./${iconName}";\n`;
        } catch (err) {
          console.error(err);
        }
      }
    });
    try {
      const dir = "src/icons/" + type;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(dir + "/index.ts", exportIcon);
      if (
        fs.readdirSync("svg/" + type).filter((s: string) => !s.endsWith("svg"))
          .length > 0
      )
        exportAll += `export * from "./${type}";\n`;
    } catch (err) {
      console.error(err);
    }
  });
  try {
    const dir = "src/icons";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + "/index.ts", exportAll);
  } catch (err) {
    console.error(err);
  }
};
main();
