'use client';

import dynamic from 'next/dynamic';

const CMS = dynamic(
    () =>
        import('decap-cms-app').then((cmsModule: any) => {
            const cms = cmsModule.default;

            cms.init({
                config: {
                    local_backend: true,
                    backend: {
                        name: 'git-gateway',
                        branch: 'main',
                    },
                    media_folder: 'public/uploads',
                    public_folder: '/uploads',
                    collections: [
                        {
                            name: 'podcasts',
                            label: 'Episodios del Podcast',
                            folder: 'app/data/podcasts',
                            create: true,
                            extension: 'md',
                            format: 'frontmatter',
                            slug: '{{year}}-{{month}}-{{title}}',
                            fields: [
                                { label: 'ID (Automático)', name: 'id', widget: 'string', default: 'UUID' },
                                { label: 'Título', name: 'title', widget: 'string' },
                                { label: 'Descripción', name: 'description', widget: 'text' },
                                { label: 'Categoría', name: 'category', widget: 'string', default: 'Design' },
                                { label: 'Imagen de Portada', name: 'imageUrl', widget: 'image', required: false },
                                { label: 'Archivo de Audio', name: 'audioUrl', widget: 'file', required: true },
                                { label: 'Puntos Clave (Takeaways)', name: 'takeaways', widget: 'list', required: false },
                                {
                                    label: 'Galería de Imágenes',
                                    name: 'gallery',
                                    widget: 'list',
                                    field: { label: 'Imagen', name: 'image', widget: 'image' },
                                    required: false,
                                },
                                { label: 'Infografía (URL)', name: 'infographicUrl', widget: 'image', required: false },
                                {
                                    label: 'Preguntas Frecuentes (FAQ)',
                                    name: 'faq',
                                    widget: 'list',
                                    fields: [
                                        { label: 'Pregunta', name: 'question', widget: 'string' },
                                        { label: 'Respuesta', name: 'answer', widget: 'text' },
                                    ],
                                    required: false,
                                },
                                {
                                    label: 'Trivia (Quiz)',
                                    name: 'quiz',
                                    widget: 'list',
                                    fields: [
                                        { label: 'Pregunta', name: 'question', widget: 'string' },
                                        {
                                            label: 'Opciones',
                                            name: 'options',
                                            widget: 'list',
                                            field: { label: 'Opción', name: 'option', widget: 'string' },
                                        },
                                        { label: 'Índice de Respuesta Correcta (0, 1, 2...)', name: 'correctAnswer', widget: 'number' },
                                    ],
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            });
            return () => <></>;
        }),
    { ssr: false, loading: () => <p>Cargando Sistema de Archivos CMS...</p> }
);

export default function AdminPage() {
    return <CMS />;
}
