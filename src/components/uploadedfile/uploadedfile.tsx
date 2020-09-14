import React, { useEffect, useState } from 'react';
import { UploadedFileProps } from './types';
import { FileDataLoader, BigWigReader, FileType, BigWigData, BigBedData } from 'bigwig-reader';
import { condensedData, isReactElement } from './utils';
import { StackedTracks } from 'umms-gb';
const UploadedFile: React.FC<UploadedFileProps> = (props) => {
    const [data, setData] = useState<BigWigData[] | BigBedData[] | { x: number; max: number; min: number }[] | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const reader = new BigWigReader(new FileDataLoader(props.file));
                const fileType = await reader.fileType();
                let data = null;
                switch (fileType) {
                    case FileType.BigWig:
                        data = await reader.readBigWigData(
                            props.domain.chromosome!,
                            props.domain.start,
                            props.domain.chromosome!,
                            props.domain.end
                        );
                        if (data && data.length && data[0].value !== undefined)
                            data = condensedData(data, props.width - 150, props.domain);

                        break;
                    case FileType.BigBed:
                        data = await reader.readBigBedData(
                            props.domain.chromosome!,
                            props.domain.start,
                            props.domain.chromosome!,
                            props.domain.end
                        );
                        break;
                    default:
                        data = null;
                }
                setData(data);
                setLoading(false);
            } catch (e) {
                setError('Error Occured');
                setLoading(false);
            }
        };
        fetchData();
    }, [props.domain, props.file, props.width]);

    return (
        <>
            <StackedTracks transform={props.transform} id={props.id} height={0} onHeightChanged={props.onHeightChanged}>
                {React.Children.map(props.children, (child: React.ReactNode, i: number) =>
                    isReactElement(child)
                        ? data
                            ? React.cloneElement(child, { ...child.props, data: data, loading, error })
                            : React.cloneElement(child, { ...child.props, loading: true, error })
                        : child
                )}
            </StackedTracks>
        </>
    );
};

export default UploadedFile;
