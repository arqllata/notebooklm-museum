'use client';

import { useEffect } from 'react';

export default function AdminPage() {
    useEffect(() => {
        // Dynamically load the Decap CMS script only on the client side
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/decap-cms@^3.1.2/dist/decap-cms.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <div id="nc-root"></div>
        </>
    );
}
