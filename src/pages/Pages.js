import React from 'react';
import { useParams } from 'react-router';
import * as All from './index';

const Pages = () => {
    const { pageName } = useParams();
    const Page = All[pageName];

    return (
        <>
            <Page title={pageName} />
        </>
    )
}

export default Pages
