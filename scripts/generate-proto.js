const { exec: spawnAsync } = require("child_process");
const { readdir: readdirAsync } = require("fs");
const util = require("util");
const path = require("path");

const spawn = util.promisify(spawnAsync);
const readdir = util.promisify(readdirAsync);

const {
  PROTOS_PATH = "./proto",
  PROTOC_GEN_TS_PATH = "node_modules/.bin/protoc-gen-ts",
  OUT_DIR = "node_modules/protos",
} = process.env;

const [node, script, ...protos] = process.argv;

const plugin_path = path.resolve(process.cwd(), PROTOC_GEN_TS_PATH);
const out_path = path.resolve(process.cwd(), OUT_DIR);
const proto_path = path.resolve(process.cwd(), PROTOS_PATH);

main();

async function main() {
  if (!protos.length) {
    const protos = await readdir(proto_path);
    protos.filter(filterProto).forEach(forEachProtoName);
  } else {
    protos.forEach(forEachProtoName);
  }
}

function filterProto(file_name) {
  return file_name.match(/\.proto/g);
}

async function forEachProtoName(proto_name) {
  try {
    console.log(`info`, `Generating Classes for proto: ${proto_path}`);
    await spawn(`mkdir -p ${out_path};`);
    await spawn(
      `./bin/protoc --plugin="protoc-gen-ts=${plugin_path}" --js_out="import_style=commonjs,binary:${out_path}" --ts_out="${OUT_DIR}" --proto_path="${proto_path}" ${proto_name};`
    );
    console.log(
      `info`,
      `Generated Classes for proto: ${proto_path} installed in ${out_path}/${proto_name}_pb.js`
    );
  } catch ({ message }) {
    console.error("error", message);
  }
}
