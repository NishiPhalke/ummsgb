export const CYTOBAND_QUERY = `
query Annotations($assembly: String!, $chromosome: String!) {
  cytoband(assembly: $assembly, chromosome: $chromosome) {
    coordinates {
      chromosome,
      start,
      end
    },
    bandname,
    stain
  }
}
`;
