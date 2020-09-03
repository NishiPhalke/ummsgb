import { Hg38BrowserProps } from './types';
import React from 'react';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedFullBigWig,
    WrappedTrack,
    GraphQLTranscriptTrack,
    WrappedPackTranscriptTrack,
    GenomeBrowser,
} from 'umms-gb';
import {
    dnasetrack,
    h3k4me3track,
    h3k27actrack,
    ctcftrack,
    conservationtrack,
    rampageplus,
    rampageminus,
} from './tracks';
import { Domain } from './types';
import { CustomTrack } from '../../components/customtrack';
import { Container } from 'semantic-ui-react';
const tracks = (range: Domain) => [
    dnasetrack(range),
    h3k4me3track(range),
    h3k27actrack(range),
    ctcftrack(range),
    conservationtrack(range),
    rampageplus(range),
    rampageminus(range),
];

const Hg38Browser: React.FC<Hg38BrowserProps> = (props) => (
    <Container style={{ width: "90%" }}>
        <GenomeBrowser width="100%" innerWidth={2000} domain={props.domain} svgRef={props.svgRef}>
            <WrappedTrack width={2000} height={50} title="scale" titleSize={12} trackMargin={12}>
                <RulerTrack width={2000} height={50} {...(props || {})} />
            </WrappedTrack>
            <GraphQLTrackSet
                tracks={tracks(props.domain)}
                transform={'translate (0,0)'}
                id={'hg38_tracks'}
                width={2000}
                endpoint={'https://ga.staging.wenglab.org/graphql'}
            >
                <WrappedFullBigWig
                    title="Aggregated DNase-seq from ENCODE"
                    width={2000}
                    height={50}
                    id="dnase"
                    color="#06da93"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
                <WrappedFullBigWig
                    title="Aggregated H3K4me3 ChIP-seq from ENCODE"
                    width={2000}
                    height={50}
                    id="H3K4me3"
                    color="#ff0000"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
                <WrappedFullBigWig
                    title="Aggregated H3K27ac ChIP-seq from ENCODE"
                    width={2000}
                    height={50}
                    id="H3K27ac"
                    color="#ffcd00"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
                <WrappedFullBigWig
                    title="Aggregated CTCF ChIP-seq from ENCODE"
                    width={2000}
                    height={50}
                    id="ctcf"
                    color="#00b0f0"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
                <WrappedFullBigWig
                    title="phyloP 100-way conservatio"
                    width={2000}
                    height={50}
                    id="phyloP"
                    color="#000088"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
                <WrappedFullBigWig
                    title="rampage plus"
                    width={2000}
                    height={50}
                    id="ramplus"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
                <WrappedFullBigWig
                    title="rampage minus"
                    width={2000}
                    height={50}
                    id="ramminus"
                    domain={props.domain}
                    titleSize={12}
                    trackMargin={12}
                />
            </GraphQLTrackSet>                
            <GraphQLTranscriptTrack
                domain={props.domain}
                transform={'translate (0,0)'}
                assembly={'GRCh38'}
                endpoint={'https://ga.staging.wenglab.org/graphql'}
                id="g"
            >
                <WrappedPackTranscriptTrack
                    titleSize={12}
                    trackMargin={12}
                    title={'GENCODE v29 transcripts'}
                    color="#8b0000"
                    id="transcript_track"
                    rowHeight={14}
                    width={2000}
                    domain={props.domain}
                />
            </GraphQLTranscriptTrack>
            { props.customTracks && props.customTracks!.length > 0 && (
                <GraphQLTrackSet
                    tracks={props.customTracks!.map(x => ({ ...x.track, chr1: props.domain.chromosome!, start: props.domain.start, end: props.domain.end }))}
                    endpoint="https://ga.staging.wenglab.org/graphql"
                    width={2000}
                    transform="translate(0,0)"
                    id={`customtrack,${props.customTracks!.map((x, i) => i).join(',')}`}
                >
                    { props.customTracks!.map((track, i) => (
                        <CustomTrack
                            key={`ct${i}`}
                            width={2000}
                            height={50}
                            id={`ct${i}`}                               
                            transform="translate(0,0)"
                            title={track.title}
                            color={track.color}
                            domain={props.domain}
                        />
                    ))}
                </GraphQLTrackSet>
            )}
        </GenomeBrowser>
    </Container>
);
export default Hg38Browser;
