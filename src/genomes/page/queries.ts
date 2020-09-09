export const ASSEMBLY_INFO_QUERY = `
query Annotations($name: String) {
  genomicAssemblies(name: $name) {
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


export const SINGLE_TRANSCRIPT_QUERY = `
  query Gene($assembly: String!, $limit: Int) {
    refseqgenes(assembly: $assembly, limit: $limit) {
      transcripts {
        coordinates {
          chromosome,
          start,
          end
        }
      }
    },
    refseqxenogenes(assembly: $assembly, limit: $limit) {
      transcripts {
        coordinates {
          chromosome,
          start,
          end
        }
      }
    }
  }
`;
