import React from 'react';
import { TrackConfigsProps } from './types';
import { Dropdown } from 'semantic-ui-react';
import { getTrackDisplayModes, getDefaultDisplayMode } from './utils';

const TrackConfigs: React.FC<TrackConfigsProps> = (props) => {
    let tracks: {
        title: string;
        color?: string;
        displayMode?: string | undefined;
        track?: { start: number; end: number; chr1: string; url: string; baiUrl?: string; preRenderedWidth: number };
    }[] = props.tracks
        ? props.files
            ? [
                  ...props.tracks,
                  ...props.files.map((f) => {
                      return { title: f.title, displayMode: f.displayMode };
                  }),
              ]
            : props.tracks
        : props.files
        ? [
              ...Object.values(props.files).map((f) => {
                  return { title: f.title, displayMode: f.displayMode };
              }),
          ]
        : [];

    let noOfRows = +Math.round(tracks.length / 5).toFixed() + 1;

    return (
        <>
            {Array.from(Array(noOfRows).keys()).map((k) => {
                return (
                    <React.Fragment key={k}>
                        {tracks.slice(k * 5, k * 5 + 5 > tracks.length ? tracks.length : k * 5 + 5).map((t) => {
                            return (
                                <React.Fragment key={t.title}>
                                    <strong>{t.title}</strong> &nbsp; &nbsp;
                                    <Dropdown
                                        placeholder="Select Display Mode"
                                        selection
                                        value={t.displayMode || getDefaultDisplayMode(t.track ? t.track.url : t.title)}
                                        onChange={(_, data) => {
                                            !t.track && props.onFileSelect(t.title, data.value as string);
                                            t.track &&
                                                props.onSelect([
                                                    {
                                                        title: t.title,
                                                        color: t.color!!,
                                                        url: t.track.url,
                                                        baiUrl: t.track.baiUrl,
                                                        domain: {
                                                            chromosome: t.track.chr1,
                                                            start: t.track.start,
                                                            end: t.track.end,
                                                        },
                                                        displayMode: data.value as string,
                                                    },
                                                ]);
                                        }}
                                        options={getTrackDisplayModes(t.track ? t.track.url : t.title)}
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
