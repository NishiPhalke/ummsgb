export const ASSEMBLY_INFO_QUERY = `
query Annotations($name: String) {
  assemblies(name: $name) {
    species,
    name,
    description
  }
}
`;
