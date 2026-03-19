'use client';

import { useEffect } from 'react';

export default function AdminRedirect() {
    useEffect(() => {
        // Redirige al html independiente que no usa React 19 para evitar "ErrorBoundary" bugs
        window.location.replace('/admin/index.html');
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
            <h2>Cargando Panel de Administración...</h2>
        </div>
    );
}
