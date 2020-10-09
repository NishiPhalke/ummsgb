export const SNP_AUTOCOMPLETE_QUERY = `
    query suggestions($assembly: String!, $snpid: String!) { 
        snpAutocompleteQuery(assembly: $assembly, snpid: $snpid) {
            rsId
            coordinates {
                chromosome
                start
                end
            }
        }
    }`;

export const GENE_AUTOCOMPLETE_QUERY = `
    query Genes(
        $id: [String]
        $name: [String]
        $strand: String
        $chromosome: String
        $start: Int
        $end: Int
        $gene_type: String
        $havana_id: String
        $orderby: String
        $name_prefix: String
        $limit: Int
        $assembly: String!
    ) {
        gene(
            id: $id
            name: $name
            strand: $strand
            chromosome: $chromosome
            start: $start
            end: $end
            gene_type: $gene_type
            orderby: $orderby
            havana_id: $havana_id
            name_prefix: $name_prefix
            limit: $limit
            assembly: $assembly
        ) {
            id
            name
            coordinates {
                chromosome
                start
                end
            }
        }
    }
`;

export const REFSEQ_AUTOCOMPLETE_QUERY = `
    query Genes(
        $searchTerm: String
        $limit: Int
        $assembly: String!
    ) {
        refseqgenes(
            searchTerm: $searchTerm
            limit: $limit
            assembly: $assembly
        ) {
            id
            transcripts {
                coordinates {
                    chromosome
                    start
                    end
                }
            }
        }
        refseqxenogenes(
            searchTerm: $searchTerm
            limit: $limit
            assembly: $assembly
        ) {
            id
            transcripts {
                coordinates {
                    chromosome
                    start
                    end
                }
            }
        }
    }
`;
