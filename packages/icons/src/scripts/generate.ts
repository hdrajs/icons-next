/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
//@ts-nocheck
import fs from "fs";
import { DOMParser, XMLSerializer } from "xmldom";
import path from "path";

function* walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      const filePath = path.join(dir, file.name);
      if (path.extname(filePath) === ".svg") {
        yield filePath;
      }
    }
  }
}

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

function makeIndex(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (fs.lstatSync(dir + "/" + file.name).isDirectory()) {
      createIndex(dir, file.name);
      makeIndex(path.join(dir, file.name));
    } else {
      createIndex(dir, file.name.split(".")[0]);
    }
  }
}

const createIndex = (dir, child) => {
  if (fs.existsSync(dir + "/index.ts")) {
    const current = fs.readFileSync(dir + "/index.ts", "utf-8");
    fs.writeFileSync(
      dir + "/index.ts",
      current + `export * from "./${child}";\n`,
    );
  } else {
    fs.writeFileSync(dir + "/index.ts", `export * from "./${child}";\n`);
  }
};

const main = () => {
  for (const filePath of walkSync("svg")) {
    const svg = fs.readFileSync(filePath, "utf-8");

    const { more, second, last } = split(filePath);
    const sName = capitalize(last.split("=")[1].split(".")[0]);
    const content = `import { createSvg } from "src/utils/createSvg";

export const ${more.join("") + sName} = createSvg(<>${extractChildrenFromSVG(svg)}</>);`;
    try {
      const dirOutput = "src/icons/" + second + "/" + more.join("/");
      if (!fs.existsSync(dirOutput)) {
        fs.mkdirSync(dirOutput, { recursive: true });
      }
      fs.writeFileSync(dirOutput + "/" + sName + ".tsx", content);
    } catch (err) {
      console.error(err);
    }
  }
  makeIndex("src/icons");
};

const split = (filePath: string) => {
  const more = (filePath as string).split("\\");
  const first = more.shift();
  const second = more.shift();
  const last = more.pop();
  return { first, second, more, last };
};

main();
