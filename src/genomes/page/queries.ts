export const ASSEMBLY_INFO_QUERY = `
query Annotations($name: String) {
  assemblies(name: $name) {
    species,
    name,
    description
  }
}
`;

export const CHROM_LENGTHS_QUERY = `
query Annotations($assembly: String!, $chromosome: String) {
  chromlengths(assembly: $assembly, chromosome: $chromosome) {
    chromosome,
    length
  }
}
`;
