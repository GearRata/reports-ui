import versionData from "../../version.json";

export default function Version() {
  return <p> v{versionData.version}</p>;
}
