import React from 'react';
import { TrackConfigsProps } from './types';
import { Dropdown } from 'semantic-ui-react';
import { customTrack } from '../types';
import { getTrackDisplayModes, getDefaultDisplayMode } from './utils';

const TrackConfigs: React.FC<TrackConfigsProps> = (props) => {
    let noOfRows = +Math.round(props.tracks.length / 5).toFixed() + 1;

    return (
        <>
            {Array.from(Array(noOfRows).keys()).map((k) => {
                return (
                    <React.Fragment key={k}>
                        {props.tracks
                            .slice(k * 5, k * 5 + 5 > props.tracks.length ? props.tracks.length : k * 5 + 5)
                            .map((t: customTrack) => {
                                return (
                                    <React.Fragment key={t.title}>
                                        <strong>{t.title}</strong> &nbsp; &nbsp;
                                        <Dropdown
                                            placeholder="Select Display Mode"
                                            selection
                                            value={t.displayMode || getDefaultDisplayMode(t.track.url)}
                                            onChange={(_, data) => {
                                                props.onAccept([
                                                    {
                                                        title: t.title,
                                                        color: t.color,
                                                        url: t.track.url,
                                                        domain: {
                                                            chromosome: t.track.chr1,
                                                            start: t.track.start,
                                                            end: t.track.end,
                                                        },
                                                        displayMode: data.value as string,
                                                    },
                                                ]);
                                            }}
                                            options={getTrackDisplayModes(t.track.url)}
                                        />{' '}
                                        &nbsp; &nbsp; &nbsp; &nbsp;
                                    </React.Fragment>
                                );
                            })}
                        <br />
                        <br />
                    </React.Fragment>
                );
            })}
            <br />
            <br />
        </>
    );
};

export default TrackConfigs;
