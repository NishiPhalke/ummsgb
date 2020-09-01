export const ASSEMBLY_QUERY = `
query Assemblies($name: String) {
    genomicAssemblies(name: $name) {
      name,
      species,
      description
    }
  }
`;
